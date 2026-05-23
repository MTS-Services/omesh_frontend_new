import React, { useEffect, useState } from 'react';
import { Camera, Eye, EyeOff, LogOut, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth, usePassword, useProfile } from '../../../features/auth/hooks';
import { API_CONFIG } from '../../../api/config/constants';

import NavbarTemplate from '../../../components/template/public/NavbarTemplate';
import FooterTemplate from '../../../components/template/public/FooterTemplate';

const UserEditProfileView = () => {
  const { user } = useAuth();
  const { updateProfile } = useProfile();
  const { changePassword } = usePassword();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    avatarUrl: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fileInputRef = React.useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should not exceed 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result;
      setFormData((prev) => ({ ...prev, avatarUrl: preview }));
    };
    reader.readAsDataURL(file);

    // Upload to server: POST {{BASE_URL}}/upload/single
    (async () => {
      try {
        setUploadingAvatar(true);
        const formDataObj = new FormData();
        // backend may expect 'image' or 'file' — use 'image'
        formDataObj.append('images', file);

        const res = await axios.post(`${API_CONFIG.BASE_URL}/api/v1/upload/single`, formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Expecting { success: true, data: '<url>' } or similar
        if (res?.data) {
          const payload = res.data.data ?? res.data;
          // payload can be string or object; try to extract URL
          const uploadedUrl =
            typeof payload === 'string'
              ? payload
              : payload?.url || payload?.file || payload?.path || payload?.location || null;

          if (uploadedUrl) {
            // If server returns relative path, prefix base URL
            const finalUrl = uploadedUrl.startsWith('http')
              ? uploadedUrl
              : `${API_CONFIG.BASE_URL}${uploadedUrl}`;

            setFormData((prev) => ({ ...prev, avatarUrl: finalUrl }));
            toast.success('Avatar uploaded successfully');
          } else {
            toast.error('Upload succeeded but no file URL returned');
          }
        } else {
          toast.error('Failed to upload avatar');
        }
      } catch (err) {
        console.error('Avatar upload error:', err);
        toast.error(err?.response?.data?.message || 'Avatar upload failed');
      } finally {
        setUploadingAvatar(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    })();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };
//sadfs
  useEffect(() => {
    if (!user) {
      return;
    }

    const nameParts = (user.fullName || '').trim().split(' ').filter(Boolean);
    const firstName = nameParts.shift() || '';
    const lastName = nameParts.join(' ');

    setFormData((prev) => ({
      ...prev,
      firstName,
      lastName,
      email: user.email || '',
      phone: user.phone || '',
      address: user.location || '',
      gender: String(user.gender || '').trim().toUpperCase(),
      avatarUrl: user.avatarUrl || '',
    }));
  }, [user]);

  const fullName = user?.fullName || '';
  const avatarUrl = formData.avatarUrl || '';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const normalizeText = (value) => {
    const trimmed = String(value ?? '').trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  const normalizePhone = (value) => {
    const trimmed = String(value ?? '').trim();
    if (!trimmed) {
      return null;
    }
    const digits = trimmed.replace(/\D/g, '');
    return digits.length > 0 ? digits : null;
  };

  const normalizeDate = (value) => {
    const trimmed = String(value ?? '').trim();
    if (!trimmed) {
      return undefined;
    }
    return Number.isNaN(Date.parse(trimmed)) ? undefined : trimmed;
  };

  const handleSaveChanges = async () => {
    if (!user) {
      toast.error('Profile data not available');
      return;
    }

    const dateOfBirth = normalizeDate(user.dateOfBirth);
    const organizationName = normalizeText(user.organizationName);
    const normalizedGender = String(formData.gender || '').trim().toUpperCase();

    if (!['MALE', 'FEMALE'].includes(normalizedGender)) {
      toast.error('Please select a valid gender');
      return;
    }

    const payload = {
      fullName: normalizeText(`${formData.firstName} ${formData.lastName}`) || user.fullName,
      email: normalizeText(formData.email) || user.email,
      phone: normalizePhone(formData.phone) || user.phone || null,
      avatarUrl: normalizeText(formData.avatarUrl) || user.avatarUrl || null,
      role: user.role ?? null,
      status: user.status ?? null,
      emailVerified: user.emailVerified ?? false,
      gender: normalizedGender,
      location: normalizeText(formData.address) || user.location || null,
      teamClub: user.teamClub ?? null,
      joinedAt: user.joinedAt ?? null,
      lastLoginAt: user.lastLoginAt ?? null,
      ...(dateOfBirth ? { dateOfBirth } : {}),
      ...(organizationName ? { organizationName } : {}),
    };

    try {
      await updateProfile(payload);
      toast.success('Profile updated successfully');
    } catch (error) {
      const message =
        typeof error === 'string'
          ? error
          : error?.response?.data?.message ||
            error?.response?.data?.errors?.[0]?.message ||
            error?.message ||
            'Profile update failed';
      toast.error(message);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const trimmedCurrent = String(formData.currentPassword || '').trim();
    const trimmedNew = String(formData.newPassword || '').trim();
    const trimmedConfirm = String(formData.confirmPassword || '').trim();

    if (!trimmedCurrent || !trimmedNew || !trimmedConfirm) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (trimmedNew !== trimmedConfirm) {
      toast.error('New password and confirmation do not match');
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword({
        currentPassword: trimmedCurrent,
        newPassword: trimmedNew,
        confirmPassword: trimmedConfirm,
      });
      toast.success('Password updated successfully');
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      const message =
        typeof error === 'string'
          ? error
          : error?.response?.data?.message || error?.message;
      toast.error(message || 'Password update failed');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="bg-[#F0F0F0]">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-0">
        <div className="bg-white">
          <div className="border-b border-gray-300 px-4 py-3 text-sm font-medium text-[#42444A] uppercase md:text-xl">
            Account Setting
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="relative w-fit">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="h-20 w-20 rounded-full object-cover sm:h-35 sm:w-40"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-400 sm:h-35 sm:w-40">
                    {initials}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="absolute right-0 bottom-0 rounded-full border border-gray-300 bg-[#2B313D] p-1.5 text-white"
                  aria-label="Change profile picture"
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  aria-label="Upload profile picture"
                />
              </div>

              <div className="grid w-full grid-cols-1 gap-4 px-4 py-2 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-[#42444A]">First name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    className="h-11 w-full rounded border border-gray-300 px-3 text-sm text-[#42444A] outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-[#42444A]">Last name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    className="h-11 w-full rounded border border-gray-300 px-3 text-sm text-[#42444A] outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-[#42444A]">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    className="h-11 w-full rounded border border-gray-300 px-3 text-sm text-[#42444A] outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-[#42444A]">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    className="h-11 w-full rounded border border-gray-300 px-3 text-sm text-[#42444A] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm text-[#42444A]">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange('address')}
                    className="h-11 w-full rounded border border-gray-300 px-3 text-sm text-[#42444A] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm text-[#42444A]">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={handleInputChange('gender')}
                    className="h-11 w-full rounded border border-gray-300 px-3 text-sm text-[#42444A] outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="mt-4 rounded bg-[#1FB356] px-6 py-2.5 text-sm font-bold tracking-wide text-white uppercase"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded bg-white pb-6">
          <div className="border-b border-gray-300 px-4 py-3 text-sm font-medium text-[#42444A] uppercase md:text-xl">
            Change Password
          </div>

          <form className="space-y-4 px-4 pt-4 sm:px-6" onSubmit={handleChangePassword}>
            <div>
              <label className="mb-1.5 block text-sm text-[#42444A]">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={handleInputChange('currentPassword')}
                  className="h-11 w-full rounded border border-gray-300 px-3 pr-10 text-sm text-[#42444A] outline-none"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#42444A] transition-colors hover:text-[#1FB356]"
                  aria-label={showPasswords.current ? 'Hide password' : 'Show password'}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-[#42444A]">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleInputChange('newPassword')}
                  placeholder="8+ characters"
                  className="h-11 w-full rounded border border-gray-300 px-3 pr-10 text-sm text-[#42444A] outline-none placeholder:text-[#77878F]"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#42444A] transition-colors hover:text-[#1FB356]"
                  aria-label={showPasswords.new ? 'Hide password' : 'Show password'}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-[#42444A]">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  className="h-11 w-full rounded border border-gray-300 px-3 pr-10 text-sm text-[#42444A] outline-none"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#42444A] transition-colors hover:text-[#1FB356]"
                  aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="rounded bg-[#1FB356] px-6 py-2.5 text-sm font-bold tracking-wide text-white uppercase disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isChangingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default UserEditProfileView;
