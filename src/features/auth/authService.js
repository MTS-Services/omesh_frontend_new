
// 🔗 API Integration: Auth related API calls
import { request } from '../../api/request';
import { ENDPOINT } from '../../api/config/endpoints';

// Login service
// 🔗 API Integration: Login API
export const loginService = async (credentials, { signal } = {}) => {
  return await request({
    method: 'POST',
    url: ENDPOINT.AUTH.LOGIN,
    data: credentials,
    signal,
  });
};

// Register service
// 🔗 API Integration: Register API
export const registerService = async (userData, { signal } = {}) => {
  return await request({
    method: 'POST',
    url: ENDPOINT.AUTH.REGISTER,
    data: userData,
    signal,
  });
};

// Logout service
// 🔗 API Integration: Logout API
export const logoutService = async ({ signal } = {}) => {
  return await request({
    method: 'POST',
    url: ENDPOINT.AUTH.LOGOUT,
    signal,
  });
};

// Refresh token service
// 🔗 API Integration: Refresh Token API
export const refreshTokenService = async (refreshToken, { signal } = {}) => {
  return await request({
    method: 'POST',
    url: ENDPOINT.AUTH.REFRESH,
    data: { refreshToken },
    signal,
  });
};

// Get current user service
// 🔗 API Integration: Get Current User API
export const getMeService = async ({ signal } = {}) => {
  return await request({
    method: 'GET',
    url: ENDPOINT.AUTH.ME,
    signal,
  });
};

// Get user profile service
// 🔗 API Integration: Get User Profile API
export const getProfileService = async ({ signal } = {}) => {
  return await request({
    method: 'GET',
    url: ENDPOINT.AUTH.PROFILE,
    signal,
  });
};

// Update user profile service
// 🔗 API Integration: Update User Profile API
export const updateProfileService = async (profileData, { signal } = {}) => {
  return await request({
    method: 'PUT',
    url: ENDPOINT.AUTH.PROFILE,
    data: profileData,
    signal,
  });
};

// Change password service
// 🔗 API Integration: Change Password API
export const changePasswordService = async (passwordData, { signal } = {}) => {
  return await request({
    method: 'POST',
    url: ENDPOINT.AUTH.CHANGE_PASSWORD,
    data: passwordData,
    signal,
  });
};

// Forgot password service
// 🔗 API Integration: Forgot Password API
export const forgotPasswordService = async (email, { signal } = {}) => {
  return await request({
    method: 'POST',
    url: ENDPOINT.AUTH.FORGOT_PASSWORD,
    data: { email },
    signal,
  });
};

// OTP verify service
// 🔗 API Integration: OTP Verify API
export const otpVerifyService = async (otpData, { signal } = {}) => {
  return await request({
    method: 'POST',
    url: ENDPOINT.AUTH.OTP_VERIFY,
    data: otpData,
    signal,
  });
};

// Reset password service
// 🔗 API Integration: Reset Password API
export const resetPasswordService = async (resetData, { signal } = {}) => {
  return await request({
    method: 'POST',
    url: ENDPOINT.AUTH.RESET_PASSWORD,
    data: resetData,
    signal,
  });
};

// Get user statistics (Admin only)
// 🔗 API Integration: Get User Stats API
export const getUserStatsService = async ({ signal } = {}) => {
  return await request({
    method: 'GET',
    url: ENDPOINT.AUTH.STATS,
    signal,
  });
};
