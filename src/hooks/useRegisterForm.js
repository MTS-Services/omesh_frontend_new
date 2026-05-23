import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useRegister } from '../features/auth/hooks';
import { getDashboardPathByRole } from '../utils/auth';

import {
  validateRegistrationForm,
  formatRegistrationData,
  handleRegistrationError,
} from '../utils/registerValidation';

/**
 * Custom hook for registration form logic
 * Handles form state, validation, and submission
 */
export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useRegister();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    termsAccepted: false,
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
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
   * Handle profile photo upload
   */
  const handlePhotoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
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

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

      // Validate form
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        // Show the first error in a toast
        const firstError = Object.values(errors)[0];
        toast.error(firstError);
        return;
      }

      try {
        // Format and submit data
        const cleanedData = formatRegistrationData(formData);
        const response = await register(cleanedData);

        // Get user info from response
        const userRole = response?.data?.user?.role || 'USER';
        const userName = response?.data?.user?.fullName || formData.fullName;

        // Show success toast
        toast.success(`Welcome ${userName}! Your account has been created successfully.`);

        // Navigate to role-based dashboard
        const dashboardPath = getDashboardPathByRole(userRole);
        navigate(dashboardPath);
      } catch (err) {
        console.error('Registration error:', err);

        // Handle and format error
        const { errorMessage, fieldErrors } = handleRegistrationError(err);

        setApiError(errorMessage);
        setValidationErrors((prev) => ({ ...prev, ...fieldErrors }));
        toast.error(errorMessage);
      }
    },
    [formData, register, navigate, validateForm]
  );

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: 'USER',
      termsAccepted: false,
    });
    setProfilePhoto(null);
    setValidationErrors({});
    setApiError(null);
    setShowPassword(false);
  }, []);

  return {
    // Form state
    formData,
    profilePhoto,
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
