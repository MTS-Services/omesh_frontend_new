import { HomeIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usePassword } from '../../features/auth/hooks';

const ResetPasswordView = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { forgotPassword, loading, error } = usePassword();

  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue.trim()) {
      return 'Email is required';
    }
    if (!emailRegex.test(emailValue)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      toast.error(emailError);
      return;
    }

    try {
      const response = await forgotPassword(email);
      
      if (response && response.success) {
        toast.success('Check your email for the verification code');
        // Pass email to next page
        navigate('/auth/verify-otp', { state: { email } });
      } else {
        const errorMsg = response?.message || 'Failed to send reset code. Please try again.';
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      const errorMsg = err?.message || 'An error occurred. Please try again.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div
        className="hidden w-1/2 bg-cover bg-top lg:block"
        style={{
          backgroundImage: "url('/img/home/forget.jpg')",
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
            <h1 className="mb-3 text-2xl font-bold text-gray-800 md:text-3xl">Forgot Password</h1>
       
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-6">
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({});
                }}
                placeholder="Enter your email here..."
                className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-700 transition-colors focus:outline-none ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                }`}
                required
                disabled={loading}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>

            {/* Links */}
            <div className="mt-4">
              {/* Sign Up Link */}
              <p className="mt-2 text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-[#1FB356] hover:underline">
                  Sign Up
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

export default ResetPasswordView;
