import { HomeIcon, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDashboardPathByRole, ROLES } from '../../utils/auth';
import { useLogin } from '../../features/auth/hooks';

const LoginView = () => {
  const navigate = useNavigate();
  const { login, loading } = useLogin();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      // Get user role from response
      const userRole = response?.data?.user?.role || ROLES.USER;
      const userName = response?.data?.user?.fullName || response?.data?.user?.email;

      // Show success toast
      toast.success(`Welcome back, ${userName}!`);

      // Navigate to role-based dashboard
      const dashboardPath = getDashboardPathByRole(userRole);
      navigate(dashboardPath);
    } catch (err) {
      // console.log(err);
      const errorMessage =
        typeof err === 'string' ? err : err?.response?.data?.message || err?.message;
      toast.error(errorMessage || 'Invalid Credentials');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Image */}
      <div
        className="sticky top-0 hidden h-screen w-1/2 bg-cover bg-center lg:block"
        style={{
          backgroundImage: "url('/img/home/login.jpg')",
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

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center bg-white px-4 py-8 sm:px-6 sm:py-12 lg:w-1/2">
        <div className="w-full max-w-md sm:max-w-lg">
          {/* Form Container with Blue Border */}
          <div className="rounded-lg">
            {/* Header */}

            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">
                Login to Your Account
              </h1>
              {/* <p className="text-xs text-gray-600 md:text-sm">
                Enter your credentials to access your account
              </p> */}

              {/* Sign Up Link */}
              <p className="mt-2 text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-[#1FB356] hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email here..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="mb-2">
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password here..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm text-gray-700 transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Forget Password Link */}
              <div className="my-4 flex items-center justify-between">
                {/* Remember Me Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded-[#1FB356] border-gray-300"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                    Remember Me
                  </label>
                </div>
                <div className="text-right">
                  <Link
                    to="/auth/reset-password"
                    className="text-sm font-medium text-green-500 hover:text-green-600 hover:underline"
                  >
                    Forget Password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600 active:bg-green-700 ${
                  loading ? 'cursor-not-allowed opacity-60' : ''
                }`}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Terms & Conditions */}

              <p className="mt-4 text-center text-xs text-gray-400 sm:text-sm">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="text-green-400 hover:underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-green-400 hover:underline">
                  Privacy Policy .
                </Link>
              </p>

              {/* Role Selection */}
              <div className="mt-4">
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
    </div>
  );
};

export default LoginView;
