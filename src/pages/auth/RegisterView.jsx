import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, HomeIcon } from 'lucide-react';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import ErrorBanner from '../../components/common/ErrorBanner';
import FormInput from '../../components/common/FormInput';
import ProfilePhotoUpload from '../../components/auth/ProfilePhotoUpload';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';

const RegisterView = () => {
  const {
    formData,
    profilePhoto,
    validationErrors,
    apiError,
    showPassword,
    loading,
    error,
    handleChange,
    handlePhotoUpload,
    handleSubmit,
    togglePasswordVisibility,
  } = useRegisterForm();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side - Image (Sticky) */}
      <div
        className="sticky top-0 hidden h-screen w-1/2 bg-cover bg-center lg:block"
        style={{
          backgroundImage: "url('/img/home/register.jpg')",
        }}
      >
        {/* Overlay with Logo */}
        <div className="flex h-full w-full items-center justify-center bg-black/30">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg md:text-6xl lg:text-5xl">
              Endura <span className="text-[#4ade80]">Events</span>
            </h1>
            <p className="mt-2 text-lg text-white/90 drop-shadow-md md:text-lg">
              Your Event Management Solution
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form (Scrollable) */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">
              Personal Information
            </h2>
            <p className="text-xs text-gray-600 md:text-sm">
              Provide your basic personal details to create your user profile.
            </p>

            {/* Error Banner */}
            {(apiError || error) && (
              <div className="mt-4">
                <ErrorBanner
                  error={apiError || error?.message || 'An error occurred during registration'}
                  title="Registration Error"
                />
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Profile Photo with Role Toggle */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-4">
                {/* Profile Photo - Left Side */}
                <ProfilePhotoUpload profilePhoto={profilePhoto} onPhotoUpload={handlePhotoUpload} />

                {/* Role Toggle - Right Side */}
                <div className="flex flex-1 flex-col items-end justify-start">
                  <label className="mb-2 flex cursor-pointer items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Are you an organizer?</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="role"
                        checked={formData.role === 'ORGANIZER'}
                        onChange={(e) => {
                          handleChange({
                            target: {
                              name: 'role',
                              value: e.target.checked ? 'ORGANIZER' : 'USER',
                            },
                          });
                        }}
                        className="peer sr-only"
                      />
                      <div className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-green-500"></div>
                      <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>
                  {formData.role === 'ORGANIZER' && (
                    <span className="mt-1 text-xs font-medium text-green-600">
                      ✓ Organizer account
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Full Name */}
            <FormInput
              label="Full Name"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              error={validationErrors.fullName}
              disabled={loading}
              required
            />

            {/* Email */}
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email..."
              error={validationErrors.email}
              disabled={loading}
              required
            />

            {/* Phone Number */}
            <FormInput
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your Phone number..."
              error={validationErrors.phoneNumber}
              disabled={loading}
              required
            />

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  disabled={loading}
                  required
                  className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm text-gray-700 transition-colors focus:ring-2 focus:outline-none ${
                    validationErrors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
              )}

              {/* Password Strength Indicator */}
              <PasswordStrengthIndicator password={formData.password} />
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  disabled={loading}
                  required
                  className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm text-gray-700 transition-colors focus:ring-2 focus:outline-none ${
                    validationErrors.confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>
            {/* Terms & Conditions */}
            <div className="mb-4">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  id="terms"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className={`mt-1 cursor-pointer ${
                    validationErrors.termsAccepted ? 'border-red-500' : ''
                  }`}
                />
                <label htmlFor="terms" className="text-xs text-gray-600 md:text-sm">
                  By signing up, you agree to our{' '}
                  <Link to="/terms" className="text-green-500 hover:underline">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-green-500 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600 ${
                loading ? 'cursor-not-allowed opacity-60' : ''
              }`}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            {/* Role Selection */}
            <div className="mt-4">
              {/* Sign Up Link */}
              {/* Login Link */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Already Have an account{' '}
                <Link to="/auth/login" className="font-medium text-green-500 hover:underline">
                  Log In
                </Link>
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-300" />
                <Link
                  to="/"
                  className="flex items-center justify-center text-green-400 transition-colors hover:text-blue-600 hover:underline"
                >
                  <HomeIcon className="mr-2 h-4 w-4" /> Back to Home
                </Link>
                <span className="h-px flex-1 bg-gray-300" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
