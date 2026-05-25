import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth, usePassword, useProfile } from '../../../../features/auth/hooks';
import { validatePassword } from '../../../../utils/registerValidation';

const ProfileView = () => {
  const { user } = useAuth();
  const { updateProfile } = useProfile();
  const { changePassword } = usePassword();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setEmail(user.email || '');
    setPhone(user.phone || '');
  }, [user]);

  const inputClass =
    'w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400';

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

  const getApiErrorMessage = (error, fallbackMessage) => {
    if (typeof error === 'string') {
      return error;
    }

    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.errors?.[0]?.message ||
      error?.message ||
      fallbackMessage
    );
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Profile data not available');
      return;
    }

    const dateOfBirth = normalizeDate(user.dateOfBirth);
    const organizationName = normalizeText(user.organizationName);
    const fullName = normalizeText(user.fullName) || undefined;
    const emailValue = normalizeText(email) || user.email;
    const phoneValue = normalizePhone(phone) || user.phone || null;

    const payload = {
      ...(fullName ? { fullName } : {}),
      ...(emailValue ? { email: emailValue } : {}),
      ...(phoneValue ? { phone: phoneValue } : {}),
      ...(user.avatarUrl ? { avatarUrl: user.avatarUrl } : {}),
      ...(user.role ? { role: user.role } : {}),
      ...(user.status ? { status: user.status } : {}),
      ...(typeof user.emailVerified === 'boolean' ? { emailVerified: user.emailVerified } : {}),
      ...(user.gender ? { gender: user.gender } : {}),
      ...(user.location ? { location: user.location } : {}),
      ...(user.teamClub ? { teamClub: user.teamClub } : {}),
      ...(user.joinedAt ? { joinedAt: user.joinedAt } : {}),
      ...(user.lastLoginAt ? { lastLoginAt: user.lastLoginAt } : {}),
      ...(dateOfBirth ? { dateOfBirth } : {}),
      ...(organizationName ? { organizationName } : {}),
    };

    try {
      await updateProfile(payload);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Profile update failed'));
    }
  };

  const handleChangePassword = async () => {
    const trimmedOld = String(oldPassword || '').trim();
    const trimmedNew = String(newPassword || '').trim();
    const trimmedConfirm = String(confirmPassword || '').trim();

    if (!trimmedOld || !trimmedNew || !trimmedConfirm) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (trimmedNew !== trimmedConfirm) {
      toast.error('New password and confirmation do not match');
      return;
    }

    const passwordError = validatePassword(trimmedNew);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword({
        currentPassword: trimmedOld,
        newPassword: trimmedNew,
        confirmPassword: trimmedConfirm,
      });
      toast.success('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Password update failed'));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your account settings and preferences</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-green-500 px-5 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          Save
        </button>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Personal Details */}
        <h2 className="mb-5 text-base font-bold text-gray-900">Personal Details</h2>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="mb-8">
          <label className="mb-1.5 block text-sm text-gray-600">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </div>

        <h2 className="mb-5 text-base font-bold text-gray-900">Change Password</h2>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm text-gray-600">Old Password</label>
          <div className="relative">
            <input
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showOldPassword ? 'Hide old password' : 'Show old password'}
            >
              {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm text-gray-600">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            className="rounded-lg bg-green-500 px-5 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isChangingPassword ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
