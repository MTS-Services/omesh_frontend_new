import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import { useRegister } from '../features/auth/hooks';
import { getDashboardPathByRole } from '../utils/auth';

import {
  validateRegistrationForm,
  formatRegistrationData,
  handleRegistrationError,
} from '../utils/registerValidation';
import { API_CONFIG } from '../api/config/constants';

/**
 * Uploads a single image file to /upload/single
 * @param {File} file
 * @returns {Promise<string>} uploaded image relative url (e.g. /uploads/xxx.jpg)
 */
const uploadSingleImage = async (file) => {
  const formData = new FormData();
  formData.append('images', file);
  const { data } = await axios.post(`${API_CONFIG.BASE_URL}/api/v1/upload/single`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (!data?.success || !data?.data?.url) {
    throw new Error(data?.message || 'Upload failed');
  }

  return data.data.url; // e.g. "/uploads/1782622753330-58369692.jpg"
};

/**
 * Custom hook for registration form logic
 * Handles form state, validation, and submission
 */
export const useRegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loading, error } = useRegister();

  const initialRole = location.state?.role === 'ORGANIZER' ? 'ORGANIZER' : 'USER';

  const createInitialFormData = useCallback(
    () => ({
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: initialRole,
      termsAccepted: false,
    }),
    [initialRole]
  );

  // Form state
  const [formData, setFormData] = useState(createInitialFormData);

  const [profilePhoto, setProfilePhoto] = useState(null); // local preview (base64)
  const [avatarUrl, setAvatarUrl] = useState(null); // uploaded image url from server
  const [photoUploading, setPhotoUploading] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle input field changes
   */
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));

      // Clear validation error for this field
      setValidationErrors((prev) => {
        if (prev[name]) {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        }
        return prev;
      });

      // Clear API error when user starts typing
      if (apiError) {
        setApiError(null);
      }
    },
    [apiError]
  );

  /**
   * Handle profile photo upload — shows local preview instantly,
   * then uploads to server and stores returned url
   */
  const handlePhotoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Instant local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result);
    };
    reader.readAsDataURL(file);

    // Actual upload to server
    setPhotoUploading(true);
    setAvatarUrl(null);

    uploadSingleImage(file)
      .then((url) => {
        setAvatarUrl(url);
      })
      .catch((err) => {
        console.error('Photo upload error:', err);
        toast.error('Failed to upload photo. Please try again.');
        setProfilePhoto(null);
      })
      .finally(() => {
        setPhotoUploading(false);
      });
  }, []);

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  /**
   * Validate form and return errors
   */
  const validateForm = useCallback(() => {
    const errors = validateRegistrationForm(formData);
    setValidationErrors(errors);
    return errors;
  }, [formData]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setApiError(null);

      if (photoUploading) {
        toast.error('Please wait, photo is still uploading.');
        return;
      }

      // Validate form
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        const firstError = Object.values(errors)[0];
        toast.error(firstError);
        return;
      }

      try {
        // Format and submit data, attach uploaded avatar url (if any)
        const cleanedData = formatRegistrationData({
          ...formData,
          avatarUrl: avatarUrl || undefined,
          phone: formData.phoneNumber || undefined, // optional
        });

        console.log('Submitting registration data======:', cleanedData);

        const response = await register(cleanedData);

        const userRole = response?.data?.user?.role || 'USER';
        const userName = response?.data?.user?.fullName || formData.fullName;

        toast.success(`Welcome ${userName}! Your account has been created successfully.`);

        const dashboardPath = getDashboardPathByRole(userRole);
        navigate(dashboardPath);
      } catch (err) {
        console.error('Registration error:', err);

        const { errorMessage, fieldErrors } = handleRegistrationError(err);

        setApiError(errorMessage);
        setValidationErrors((prev) => ({ ...prev, ...fieldErrors }));
        toast.error(errorMessage);
      }
    },
    [formData, avatarUrl, photoUploading, register, navigate, validateForm]
  );

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(createInitialFormData());
    setProfilePhoto(null);
    setAvatarUrl(null);
    setPhotoUploading(false);
    setValidationErrors({});
    setApiError(null);
    setShowPassword(false);
  }, [createInitialFormData]);

  return {
    // Form state
    formData,
    profilePhoto,
    avatarUrl,
    photoUploading,
    validationErrors,
    apiError,
    showPassword,

    // Loading states
    loading,
    error,

    // Handlers
    handleChange,
    handlePhotoUpload,
    handleSubmit,
    togglePasswordVisibility,
    resetForm,
  };
};
