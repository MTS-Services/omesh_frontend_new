import { createSlice } from '@reduxjs/toolkit';
import {
  loginAPI,
  registerAPI,
  logoutAPI,
  refreshTokenAPI,
  getMeAPI,
  getProfileAPI,
  updateProfileAPI,
  changePasswordAPI,
  forgotPasswordAPI,
  resetPasswordAPI,
  getUserStatsAPI,
} from './authAPI';
import {
  setToken,
  setRefreshToken,
  setUser,
  removeToken,
  removeRefreshToken,
  removeUser,
} from '../../utils/storage';

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  authInitialized: false, // NEW: Track if initial auth check is complete
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  stats: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Manual logout action
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.authInitialized = true; // Auth is still initialized (we know user is logged out)
      state.status = 'idle';
      state.error = null;
      removeToken();
      removeRefreshToken();
      removeUser();
    },
    // Restore auth from storage
    restoreAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.authInitialized = true; // Mark as initialized
      state.status = 'succeeded';
    },
    // Mark auth as initialized (even if no user found)
    setAuthInitialized: (state) => {
      state.authInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginAPI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAPI.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.data?.user;
        state.token = action.payload.data?.tokens?.accessToken;
        state.refreshToken = action.payload.data?.tokens?.refreshToken;
        state.isAuthenticated = true;
        state.authInitialized = true; // Mark as initialized after successful login
        if (state.token) setToken(state.token);
        if (state.refreshToken) setRefreshToken(state.refreshToken);
        if (state.user) setUser(state.user);
      })
      .addCase(loginAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // REGISTER
      .addCase(registerAPI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerAPI.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.data?.user;
        state.token = action.payload.data?.tokens?.accessToken;
        state.refreshToken = action.payload.data?.tokens?.refreshToken;
        state.isAuthenticated = true;
        state.authInitialized = true; // Mark as initialized after successful registration
        if (state.token) setToken(state.token);
        if (state.refreshToken) setRefreshToken(state.refreshToken);
        if (state.user) setUser(state.user);
      })
      .addCase(registerAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // LOGOUT
      .addCase(logoutAPI.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutAPI.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        removeToken();
        removeRefreshToken();
        removeUser();
      })
      .addCase(logoutAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // REFRESH TOKEN
      .addCase(refreshTokenAPI.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(refreshTokenAPI.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.data?.tokens?.accessToken;
        state.refreshToken = action.payload.data?.tokens?.refreshToken;
        if (state.token) setToken(state.token);
        if (state.refreshToken) setRefreshToken(state.refreshToken);
      })
      .addCase(refreshTokenAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // GET ME
      .addCase(getMeAPI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getMeAPI.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.data;
        state.isAuthenticated = true;
        if (state.user) setUser(state.user);
      })
      .addCase(getMeAPI.rejected, (state, action) => {
        if (action.meta.aborted) {
          state.status = 'idle';
          return;
        }
        state.status = 'failed';
        state.error = action.payload;
      })
      // GET PROFILE
      .addCase(getProfileAPI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getProfileAPI.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { ...state.user, ...action.payload.data };
        if (state.user) setUser(state.user);
      })
      .addCase(getProfileAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // UPDATE PROFILE
      .addCase(updateProfileAPI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfileAPI.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { ...state.user, ...action.payload.data };
        if (state.user) setUser(state.user);
      })
      .addCase(updateProfileAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // CHANGE PASSWORD
      .addCase(changePasswordAPI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(changePasswordAPI.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(changePasswordAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // FORGOT PASSWORD
      .addCase(forgotPasswordAPI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(forgotPasswordAPI.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(forgotPasswordAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // RESET PASSWORD
      .addCase(resetPasswordAPI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resetPasswordAPI.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(resetPasswordAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // GET USER STATS (Admin)
      .addCase(getUserStatsAPI.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUserStatsAPI.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload.data;
      })
      .addCase(getUserStatsAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearAuth, restoreAuth, setAuthInitialized } = authSlice.actions;
export default authSlice.reducer;
