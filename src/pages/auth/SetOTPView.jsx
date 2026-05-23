import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usePassword } from '../../features/auth/hooks';

const SetOTPView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const inputRefs = useRef([]);
  const { otpVerify, forgotPassword, loading } = usePassword();

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear errors on input
    if (errors.otp) setErrors({});

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);
    if (errors.otp) setErrors({});
  };

  const validateOTP = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      return 'Please enter a valid 6-digit OTP code';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate OTP
    const otpError = validateOTP();
    if (otpError) {
      setErrors({ otp: otpError });
      toast.error(otpError);
      return;
    }

    try {
      const otpCode = otp.join('');
      const response = await otpVerify({
        email,
        token: otpCode,
      });

      if (response && response.success) {
        toast.success('OTP verified successfully');
        // Pass email and token to next page
        navigate('/auth/new-password', { state: { email, token: otpCode } });
      } else {
        const errorMsg = response?.message || 'Invalid OTP. Please try again.';
        toast.error(errorMsg);
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      const errorMsg = err?.message || 'An error occurred. Please try again.';
      toast.error(errorMsg);
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Email not found. Please start over.');
      navigate('/auth/reset-password');
      return;
    }

    try {
      toast.info('Resending OTP...');
      await forgotPassword({ email });
      toast.success('New OTP sent to your email');
    } catch (err) {
      console.error('Resend error:', err);
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div
        className="hidden w-1/2 bg-cover bg-center lg:block"
        style={{
          backgroundImage: "url('/img/home/register.jpg')",
        }}
      >
        {/* Optional overlay */}
        <div className="h-full w-full bg-black/20" />
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-2xl font-bold text-gray-800 md:text-3xl">OTP Verification</h1>
            <p className="text-sm text-gray-600 md:text-base">
              Enter the verification code we just sent to your email address
            </p>
            {email && <p className="mt-2 text-xs text-gray-500">Email: {email}</p>}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* OTP Inputs */}
            <div className="mb-6 flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={loading}
                  className={`h-10 md:h-14 w-10 md:w-14 rounded-lg border-2 text-center text-xl font-semibold transition-colors focus:outline-none disabled:opacity-50 ${
                    errors.otp
                      ? 'border-red-500 bg-red-50 text-gray-800 focus:ring-2 focus:ring-red-500/20'
                      : digit
                      ? 'border-green-500 bg-green-50 text-gray-800 focus:ring-2 focus:ring-green-500/20'
                      : 'border-gray-300 text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                  }`}
                />
              ))}
            </div>
            {errors.otp && <p className="text-center text-xs text-red-500">{errors.otp}</p>}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            {/* Resend Link */}
            <div className="mt-6 text-center text-sm text-gray-600 md:text-base">
              Didn't receive a code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="font-medium text-green-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetOTPView;
