import { createAsyncThunk } from '@reduxjs/toolkit';
import { getNormalizedError, handleApiError } from '../../api/errorHandler';
import {
  loginService,
  registerService,
  logoutService,
  refreshTokenService,
  getMeService,
  getProfileService,
  updateProfileService,
  changePasswordService,
  forgotPasswordService,
  otpVerifyService,
  resetPasswordService,
  getUserStatsService,
} from './authService';

// Login API thunk
export const loginAPI = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, signal }) => {
    try {
      return await loginService(credentials, { signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Register API thunk
export const registerAPI = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue, signal }) => {
    try {
      return await registerService(userData, { signal });
    } catch (error) {
      return rejectWithValue(getNormalizedError(error));
    }
  }
);

// Logout API thunk
export const logoutAPI = createAsyncThunk('auth/logout', async (_, { rejectWithValue, signal }) => {
  try {
    return await logoutService({ signal });
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

// Refresh token API thunk
export const refreshTokenAPI = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken, { rejectWithValue, signal }) => {
    try {
      return await refreshTokenService(refreshToken, { signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Get current user API thunk
export const getMeAPI = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await getMeService({ signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
  {
    condition: (_, { getState }) => {
      const { user, status } = getState().auth;
      return !(user && status === 'succeeded');
    },
  }
);

// Get profile API thunk
export const getProfileAPI = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await getProfileService({ signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Update profile API thunk
export const updateProfileAPI = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue, signal }) => {
    try {
      return await updateProfileService(profileData, { signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Change password API thunk
export const changePasswordAPI = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue, signal }) => {
    try {
      return await changePasswordService(passwordData, { signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Forgot password API thunk
export const forgotPasswordAPI = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue, signal }) => {
    try {
      return await forgotPasswordService(email, { signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// OTP verify API thunk
export const otpVerifyAPI = createAsyncThunk(
  'auth/otpVerify',
  async (otpData, { rejectWithValue, signal }) => {
    try {
      return await otpVerifyService(otpData, { signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Reset password API thunk
export const resetPasswordAPI = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue, signal }) => {
    try {
      return await resetPasswordService(resetData, { signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Get user statistics API thunk (Admin only)
export const getUserStatsAPI = createAsyncThunk(
  'auth/getUserStats',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await getUserStatsService({ signal });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Export named exports
export {
  loginAPI as login,
  registerAPI as register,
  logoutAPI as logout,
  refreshTokenAPI as refreshToken,
  getMeAPI as getMe,
  getProfileAPI as getProfile,
  updateProfileAPI as updateProfile,
  changePasswordAPI as changePassword,
  forgotPasswordAPI as forgotPassword,
  otpVerifyAPI as otpVerify,
  resetPasswordAPI as resetPassword,
  getUserStatsAPI as getUserStats,
};
