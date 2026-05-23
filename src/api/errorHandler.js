import { normalizeApiError } from './client';

/**
 * Handle API errors in Redux thunks
 * Re-throws abort errors for RTK to handle
 * Returns normalized error message for other errors
 * @param {Error} error - Error from axios
 * @returns {string} Error message
 */
export const handleApiError = (error) => {
  // Re-throw abort errors — RTK handles cancelled thunks natively
  if (error.name === 'CanceledError' || error.name === 'AbortError') {
    throw error;
  }

  // Normalize the error and return the message
  const normalizedError = normalizeApiError(error);
  return normalizedError.message;
};

/**
 * Get full normalized error object (for detailed error handling)
 * @param {Error} error - Error from axios
 * @returns {Object} Normalized error object with message, code, status, errors
 */
export const getNormalizedError = (error) => {
  if (error.name === 'CanceledError' || error.name === 'AbortError') {
    return {
      message: 'Request cancelled',
      code: 'REQUEST_CANCELLED',
      status: null,
      errors: null,
    };
  }

  return normalizeApiError(error);
};
