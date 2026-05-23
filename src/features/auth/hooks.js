import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  otpVerifyAPI,
  resetPasswordAPI,
  getUserStatsAPI,
} from './authAPI';
import {
  selectAuth,
  selectAuthUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserStats,
  selectUserRole,
  selectIsAdmin,
  selectIsOrganizer,
  selectIsUser,
} from './selectors';
import { clearAuth } from './authSlice';

// Hook for auth state
export const useAuth = () => {
  const auth = useSelector(selectAuth);
  const user = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const role = useSelector(selectUserRole);
  const isAdmin = useSelector(selectIsAdmin);
  const isOrganizer = useSelector(selectIsOrganizer);
  const isUser = useSelector(selectIsUser);

  return {
    auth,
    user,
    isAuthenticated,
    loading,
    error,
    role,
    isAdmin,
    isOrganizer,
    isUser,
  };
};

// Hook for login
export const useLogin = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const login = useCallback(
    async (credentials) => {
      return await dispatch(loginAPI(credentials)).unwrap();
    },
    [dispatch]
  );

  return { login, loading, error };
};

// Hook for register
export const useRegister = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const register = useCallback(
    async (userData) => {
      return await dispatch(registerAPI(userData)).unwrap();
    },
    [dispatch]
  );

  return { register, loading, error };
};

// Hook for logout
export const useLogout = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAPI()).unwrap();
    } catch {
      // Clear auth even if API call fails
      dispatch(clearAuth());
    }
  }, [dispatch]);

  return { logout, loading };
};

// Hook for token refresh
export const useRefreshToken = () => {
  const dispatch = useDispatch();

  const refresh = useCallback(
    async (refreshToken) => {
      return await dispatch(refreshTokenAPI(refreshToken)).unwrap();
    },
    [dispatch]
  );

  return { refresh };
};

// Hook for getting current user
export const useGetMe = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    if (!user) {
      const promise = dispatch(getMeAPI());
      return () => promise.abort();
    }
  }, [dispatch, user]);

  return { user, loading, error };
};

// Hook for profile operations
export const useProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const getProfile = useCallback(async () => {
    return await dispatch(getProfileAPI()).unwrap();
  }, [dispatch]);

  const updateProfile = useCallback(
    async (profileData) => {
      return await dispatch(updateProfileAPI(profileData)).unwrap();
    },
    [dispatch]
  );

  return { user, loading, error, getProfile, updateProfile };
};

// Hook for password operations
export const usePassword = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const changePassword = useCallback(
    async (passwordData) => {
      return await dispatch(changePasswordAPI(passwordData)).unwrap();
    },
    [dispatch]
  );

  const forgotPassword = useCallback(
    async (email) => {
      return await dispatch(forgotPasswordAPI(email)).unwrap();
    },
    [dispatch]
  );

  const otpVerify = useCallback(
    async (otpData) => {
      return await dispatch(otpVerifyAPI(otpData)).unwrap();
    },
    [dispatch]
  );

  const resetPassword = useCallback(
    async (resetData) => {
      return await dispatch(resetPasswordAPI(resetData)).unwrap();
    },
    [dispatch]
  );

  return { changePassword, forgotPassword, otpVerify, resetPassword, loading, error };
};

// Hook for admin statistics
export const useUserStats = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectUserStats);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const fetchStats = useCallback(async () => {
    return await dispatch(getUserStatsAPI()).unwrap();
  }, [dispatch]);

  return { stats, loading, error, fetchStats };
};
