import React, { useEffect, useState } from 'react';
import { Camera, Eye, EyeOff, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useLogout, usePassword, useProfile } from '../../../../features/auth/hooks';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_CONFIG } from '../../../../api/config/constants';

const OrgProfileView = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { updateProfile } = useProfile();
  const { changePassword } = usePassword();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: null,
    organization: null,
    avatarUrl: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
      avatarUrl: user.avatarUrl || '',
    }));
  }, [user]);

  console.log('User data:', user);  

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const fileInputRef = React.useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should not exceed 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => {
      const preview = ev.target?.result;
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

        console.log('Upload response:', res);

        // Expecting { success: true, data: '<url>' } or similar
        if (res?.data) {
          const payload = res.data.data.url ?? res.data.url;
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

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/auth/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  const inputClass =
    'h-11 w-full rounded border border-gray-300 px-3 text-sm text-[#42444A] outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500';

  const fullName = user?.fullName || '';
  const avatarUrl = formData.avatarUrl || user?.avatarUrl || '';
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
    const organizationName =
      normalizeText(formData.organization) || normalizeText(user.organizationName);

    const payload = {
      fullName: normalizeText(`${formData.firstName} ${formData.lastName}`) || user.fullName,
      email: normalizeText(formData.email) || user.email,
      phone: normalizePhone(formData.phone) || user.phone || null,
      avatarUrl: normalizeText(formData.avatarUrl) || user.avatarUrl || null,
      role: user.role ?? null,
      status: user.status ?? null,
      emailVerified: user.emailVerified ?? false,
      // gender: user.gender ?? null,
      location: user.location ?? null,
      teamClub: user.teamClub ?? null,
      joinedAt: user.joinedAt ?? null,
      lastLoginAt: user.lastLoginAt ?? null,
      ...(dateOfBirth ? { dateOfBirth } : {}),
      ...(organizationName ? { organizationName } : {}),
    };

    try {
      await updateProfile(payload);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Profile update failed');
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
        typeof error === 'string' ? error : error?.response?.data?.message || error?.message;
      toast.error(message || 'Password update failed');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your organizer account details</p>
      </div>

      {/* Account info */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Account Settings
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {/* Avatar */}
            <div className="relative w-fit shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-100">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-400">
                    {initials}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleUploadClick}
                className="absolute right-0 bottom-0 rounded-full border border-gray-300 bg-[#2B313D] p-1.5 text-white"
                aria-label="Change profile picture"
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
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

            {/* Fields */}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-[#42444A]">First name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-[#42444A]">Last name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-[#42444A]">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-[#42444A]">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm text-[#42444A]">Organization Name</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={handleInputChange('organization')}
                  className={inputClass}
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="w-full rounded bg-[#1FB356] px-6 py-2.5 text-sm font-bold tracking-wide text-white uppercase sm:w-auto"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Change Password
        </div>

        <form className="space-y-4 p-5 sm:p-6" onSubmit={handleChangePassword}>
          {[
            { key: 'current', label: 'Current Password' },
            { key: 'new', label: 'New Password', placeholder: '8+ characters' },
            { key: 'confirm', label: 'Confirm Password' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="mb-1.5 block text-sm text-[#42444A]">{label}</label>
              <div className="relative">
                <input
                  type={showPasswords[key] ? 'text' : 'password'}
                  value={
                    formData[
                      key === 'current'
                        ? 'currentPassword'
                        : key === 'new'
                          ? 'newPassword'
                          : 'confirmPassword'
                    ]
                  }
                  onChange={handleInputChange(
                    key === 'current'
                      ? 'currentPassword'
                      : key === 'new'
                        ? 'newPassword'
                        : 'confirmPassword'
                  )}
                  placeholder={placeholder}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => togglePassword(key)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#42444A] transition-colors hover:text-[#1FB356]"
                  aria-label={showPasswords[key] ? 'Hide password' : 'Show password'}
                >
                  {showPasswords[key] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full rounded bg-[#1FB356] px-6 py-2.5 text-sm font-bold tracking-wide text-white uppercase disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isChangingPassword ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="inline-flex rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 text-[#42444A]"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-normal">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default OrgProfileView;
