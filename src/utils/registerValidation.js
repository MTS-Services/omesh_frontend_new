/**
 * Registration form validation utilities
 */

/**
 * Validate full name
 * @param {string} fullName - The full name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateFullName = (fullName) => {
  if (!fullName.trim()) {
    return 'Full name is required';
  }
  if (fullName.trim().length < 2) {
    return 'Full name must be at least 2 characters';
  }
  if (!/^[a-zA-Z\s]+$/.test(fullName.trim())) {
    return 'Full name can only contain letters and spaces';
  }
  return null;
};

/**
 * Validate email
 * @param {string} email - The email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

/**
 * Validate phone number (Bangladesh format)
 * @param {string} phoneNumber - The phone number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber.trim()) {
    return 'Phone number is required';
  }
  const phoneDigits = phoneNumber.replace(/\D/g, '');
  if (phoneDigits.length < 11) {
    return 'Phone number must be at least 11 digits';
  }
  // If Bangladesh-style number is expected, enforce starting with 01 and exact 11 digits
  if (/^01[0-9]{9}$/.test(phoneDigits) === false && phoneDigits.length === 11) {
    // not matching exact BD pattern but length is 11 — accept but warn generic invalid format
    return 'Invalid phone number format';
  }
  return null;
};

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!hasLowerCase) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!hasNumber) {
    return 'Password must contain at least one number';
  }
  if (!hasSpecialChar) {
    return 'Password must contain at least one special character';
  }

  return null;
};

/**
 * Validate password confirmation
 * @param {string} password - The original password
 * @param {string} confirmPassword - The confirmation password
 * @returns {string|null} Error message or null if valid
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

/**
 * Validate terms acceptance
 * @param {boolean} termsAccepted - Whether terms are accepted
 * @returns {string|null} Error message or null if valid
 */
export const validateTermsAcceptance = (termsAccepted) => {
  if (!termsAccepted) {
    return 'You must accept the terms and conditions';
  }
  return null;
};

/**
 * Validate entire registration form
 * @param {Object} formData - The form data to validate
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};

  const fullNameError = validateFullName(formData.fullName);
  if (fullNameError) errors.fullName = fullNameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validatePasswordConfirmation(
    formData.password,
    formData.confirmPassword
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  const termsError = validateTermsAcceptance(formData.termsAccepted);
  if (termsError) errors.termsAccepted = termsError;

  return errors;
};

/**
 * Calculate password strength
 * @param {string} password - The password to analyze
 * @returns {Object} Object with strength level, label, and color
 */
export const calculatePasswordStrength = (password) => {
  if (!password) {
    return { strength: 0, label: '', color: '' };
  }

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  const strengthMap = {
    0: { label: 'Very Weak', color: 'bg-red-500' },
    1: { label: 'Weak', color: 'bg-red-400' },
    2: { label: 'Fair', color: 'bg-orange-400' },
    3: { label: 'Good', color: 'bg-yellow-400' },
    4: { label: 'Strong', color: 'bg-green-400' },
    5: { label: 'Very Strong', color: 'bg-green-500' },
  };

  return { strength, ...strengthMap[strength] };
};

/**
 * Get password requirement checks
 * @param {string} password - The password to check
 * @returns {Object} Object with requirement checks
 */
export const getPasswordRequirements = (password) => {
  return {
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasMinLength: password.length >= 8,
  };
};

/**
 * Clean and format registration data for API submission
 * @param {Object} formData - The raw form data
 * @returns {Object} Cleaned and formatted data
 */
export const formatRegistrationData = (formData) => {
  return {
    fullName: formData.fullName.trim(),
    email: formData.email.trim().toLowerCase(),
    phone: formData.phoneNumber.replace(/\D/g, ''),
    password: formData.password,
    role: formData.role,
    avatarUrl: formData.avatarUrl || null,
  };
};

/**
 * Extract and format API error message
 * @param {Error} error - The error object from API
 * @returns {Object} Object with errorMessage and fieldErrors
 */
export const handleRegistrationError = (error) => {
  let errorMessage = 'Registration failed. Please try again.';
  const fieldErrors = {};

  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error?.message) {
    errorMessage = error.message;
  } else if (error?.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error?.response?.data?.error) {
    errorMessage = error.response.data.error;
  }

  const rawErrors =
    error?.errors || error?.response?.data?.errors || error?.response?.data?.details;

  if (Array.isArray(rawErrors)) {
    rawErrors.forEach((item) => {
      if (typeof item === 'string') {
        return;
      }

      const field = item.field || item.path || item.param || item.name;
      const message = item.message || item.msg || item.error;

      if (field && message && !fieldErrors[field]) {
        fieldErrors[field] = message;
      }
    });
  } else if (rawErrors && typeof rawErrors === 'object') {
    Object.entries(rawErrors).forEach(([field, message]) => {
      if (!fieldErrors[field]) {
        fieldErrors[field] = Array.isArray(message) ? message[0] : message;
      }
    });
  }

  // Map specific errors to fields
  const lowerMessage = errorMessage.toLowerCase();

  if (
    lowerMessage.includes('email already exists') ||
    lowerMessage.includes('user already exists')
  ) {
    errorMessage = 'This email is already registered. Please login instead.';
    fieldErrors.email = 'Email already exists';
  } else if (lowerMessage.includes('phone')) {
    fieldErrors.phoneNumber = errorMessage;
  } else if (lowerMessage.includes('password')) {
    fieldErrors.password = errorMessage;
  }

  return { errorMessage, fieldErrors };
};
