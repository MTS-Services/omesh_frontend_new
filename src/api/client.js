/**
 * ============================================================================
 * PRODUCTION-GRADE AXIOS CLIENT
 * ============================================================================
 *
 * Features:
 * - Automatic access token refresh on 401
 * - Request retry queue (handles concurrent 401s)
 * - Single refresh request at a time (prevents race conditions)
 * - Clean separation of concerns (no hard redirects)
 * - Proper error normalization
 * - Defensive coding patterns
 *
 * Security:
 * - Tokens stored in HTTP-only cookies
 * - No token exposure in error messages
 * - Prevents infinite retry loops
 *
 * ============================================================================
 */

import axios from 'axios';
import { API_CONFIG } from './config/constants';
import { ENDPOINT } from './config/endpoints';
import {
  getToken,
  setToken,
  getRefreshToken,
  removeToken,
  removeRefreshToken,
  removeUser,
} from '../utils/storage';

// ============================================================================
// AXIOS INSTANCE CONFIGURATION
// ============================================================================

export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
  // Don't throw on any status code - we handle errors in interceptor
  validateStatus: () => true,
});

// ============================================================================
// REFRESH TOKEN STATE MANAGEMENT
// ============================================================================

/**
 * State to prevent concurrent refresh attempts
 * @type {boolean}
 */
let isRefreshing = false;

/**
 * Queue to hold failed requests while token is being refreshed
 * @type {Array<{resolve: Function, reject: Function}>}
 */
let failedRequestsQueue = [];

/**
 * Process all queued requests after token refresh completes
 * @param {Error|null} error - Error if refresh failed
 * @param {string|null} newAccessToken - New token if refresh succeeded
 */
const processQueue = (error, newAccessToken = null) => {
  failedRequestsQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(newAccessToken);
    }
  });
  failedRequestsQueue = [];
};

/**
 * Application-level logout callback
 * Set this from App.jsx to handle logout without hard redirects
 * @type {Function|null}
 */
let logoutCallback = null;

/**
 * Register logout callback from application layer
 * @param {Function} callback - Logout handler function
 */
export const setLogoutCallback = (callback) => {
  if (typeof callback !== 'function') {
    console.error('[API Client] Logout callback must be a function');
    return;
  }
  logoutCallback = callback;
};

/**
 * Perform clean logout - clear auth data and trigger app-level logout
 * This decouples the API client from routing/navigation
 */
const performLogout = () => {
  // Clear all auth data
  removeToken();
  removeRefreshToken();
  removeUser();

  // Trigger app-level logout (navigation, state reset, etc.)
  if (typeof logoutCallback === 'function') {
    logoutCallback();
  } else {
    console.warn(
      '[API Client] No logout callback registered. User may need to manually navigate to login.'
    );
  }
};

/**
 * Refresh the access token using refresh token
 * @returns {Promise<string>} New access token
 * @throws {Error} If refresh fails or no refresh token available
 */
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    // Use vanilla axios to avoid interceptor recursion
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${ENDPOINT.AUTH.REFRESH}`,
      { refreshToken },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: API_CONFIG.TIMEOUT,
      }
    );

    // Validate response
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Token refresh failed');
    }

    const newAccessToken = response.data?.data?.tokens?.accessToken;
    const newRefreshToken = response.data?.data?.tokens?.refreshToken;

    if (!newAccessToken) {
      throw new Error('No access token in refresh response');
    }

    // Store new tokens
    setToken(newAccessToken);
    if (newRefreshToken) {
      // Backend may rotate refresh tokens
      setToken(newRefreshToken);
    }

    return newAccessToken;
  } catch (error) {
    console.log(error);
    // Refresh failed - clear everything
    throw new Error('Token refresh failed');
  }
};

// ============================================================================
// REQUEST INTERCEPTOR - Attach Access Token
// ============================================================================

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR - Token Refresh & Error Handling
// ============================================================================

axiosInstance.interceptors.response.use(
  (response) => {
    // Success responses (2xx)
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    // Treat other status codes as errors
    return Promise.reject(createErrorFromResponse(response));
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || '';

    // ========================================================================
    // HANDLE 401 UNAUTHORIZED - TOKEN REFRESH FLOW
    // ========================================================================

    if (status === 401 && originalRequest && !originalRequest._retry) {
      // Mark request as retried to prevent infinite loops
      originalRequest._retry = true;

      // Skip token refresh for authentication endpoints
      const isAuthEndpoint =
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/register') ||
        requestUrl.includes('/auth/refresh') ||
        requestUrl.includes('/auth/forgot-password') ||
        requestUrl.includes('/auth/reset-password');

      if (isAuthEndpoint) {
        // Let the component handle auth failures (show error message)
        return Promise.reject(error);
      }

      // ----------------------------------------------------------------------
      // TOKEN REFRESH LOGIC
      // ----------------------------------------------------------------------

      if (isRefreshing) {
        // Token is already being refreshed by another request
        // Queue this request and wait
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then((newAccessToken) => {
            // Token refreshed - retry with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Start refresh process
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process all queued requests
        processQueue(null, newAccessToken);

        // Reset refresh state
        isRefreshing = false;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Token refresh failed - user needs to login again
        processQueue(refreshError, null);
        isRefreshing = false;

        // Perform clean logout
        performLogout();

        return Promise.reject(refreshError);
      }
    }

    // ========================================================================
    // HANDLE 403 FORBIDDEN
    // ========================================================================

    if (status === 403) {
      error.message = 'Access forbidden — insufficient permissions.';
    }

    // ========================================================================
    // HANDLE NETWORK ERRORS
    // ========================================================================

    if (!error.response) {
      error.message = error.message || 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// ERROR NORMALIZER
// ============================================================================

/**
 * Create standardized error object from axios response
 * @param {Object} response - Axios response object
 * @returns {Error} Normalized error
 */
function createErrorFromResponse(response) {
  const error = new Error(response.data?.message || 'Request failed');
  error.response = response;
  error.status = response.status;
  return error;
}

/**
 * Normalize API errors to consistent format for UI consumption
 * @param {Error} error - Error from axios
 * @returns {Object} Normalized error object
 */
export const normalizeApiError = (error) => {
  // Network error (no response from server)
  if (!error.response) {
    return {
      message: error.message || 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
      status: null,
      errors: null,
    };
  }

  // HTTP error (got response from server)
  const status = error.response.status;
  const data = error.response.data;

  return {
    message: data?.message || error.message || 'An error occurred',
    code: data?.code || `HTTP_${status}`,
    status,
    errors: data?.errors || null, // Validation errors (e.g., field-level errors)
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default axiosInstance;
