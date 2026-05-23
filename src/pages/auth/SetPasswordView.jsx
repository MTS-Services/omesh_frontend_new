import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { usePassword } from '../../features/auth/hooks';

const SetPasswordView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const token = location.state?.token || '';

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { resetPassword, loading } = usePassword();

  const validatePassword = (passwordValue) => {
    if (!passwordValue) {
      return 'Password is required';
    }
    if (passwordValue.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return '';
  };

  const validateConfirmPassword = (confirmValue, passwordValue) => {
    if (!confirmValue) {
      return 'Please confirm your password';
    }
    if (confirmValue !== passwordValue) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate both fields
    const passwordError = validatePassword(formData.password);
    const confirmError = validateConfirmPassword(formData.confirmPassword, formData.password);

    const newErrors = {};
    if (passwordError) newErrors.password = passwordError;
    if (confirmError) newErrors.confirmPassword = confirmError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(Object.values(newErrors)[0]);
      return;
    }

    // Validate required fields from previous steps
    if (!email || !token) {
      toast.error('Session expired. Please start over.');
      navigate('/auth/reset-password');
      return;
    }

    try {
      const response = await resetPassword({
        email,
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response && response.success) {
        toast.success('Password reset successfully! Redirecting to login...');
        // Redirect to login after successful reset
        setTimeout(() => {
          navigate('/auth/login');
        }, 1500);
      } else {
        const errorMsg = response?.message || 'Failed to reset password. Please try again.';
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      const errorMsg = err?.message || 'An error occurred. Please try again.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div
        className="hidden w-1/2 bg-cover bg-center lg:block"
        style={{
          backgroundImage: "url('/img/home/new-password-bg.jpg')",
        }}
      >
        {/* Optional overlay */}
        <div className="h-full w-full bg-black/20" />
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-2xl font-bold text-gray-800 md:text-3xl">Reset Password</h1>
            <p className="text-sm text-gray-600">
              Create a new password. It must be at least 8 characters.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="8+ characters"
                  disabled={loading}
                  className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm text-gray-700 transition-colors focus:outline-none disabled:opacity-50 ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                  }`}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={loading}
                  className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm text-gray-700 transition-colors focus:outline-none disabled:opacity-50 ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-green-500 bg-white px-6 py-3 font-semibold text-green-500 transition-colors hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordView;
