import { STORAGE_KEYS } from '../api/config/constants';
import { getCookie, setCookie, removeCookie } from './cookies';

// Token expiration: 15 minutes for access token, 7 days for refresh token
const ACCESS_TOKEN_DAYS = 1400 / (24 * 60); // 1 day
const REFRESH_TOKEN_DAYS = 7; // 7 days

// ==================== TOKEN MANAGEMENT (Cookies) ====================

// Get access token from cookie
export const getToken = () => {
  return getCookie(STORAGE_KEYS.TOKEN) || null;
};

// Set access token in cookie (15 minutes expiry)
export const setToken = (token) => {
  setCookie(STORAGE_KEYS.TOKEN, token, ACCESS_TOKEN_DAYS, {
    secure: true, // Only send over HTTPS
    sameSite: 'Strict', // Prevent CSRF attacks
  });
};

// Remove access token from cookie
export const removeToken = () => {
  removeCookie(STORAGE_KEYS.TOKEN);
};

// Get refresh token from cookie
export const getRefreshToken = () => {
  return getCookie(STORAGE_KEYS.REFRESH_TOKEN) || null;
};

// Set refresh token in cookie (7 days expiry)
export const setRefreshToken = (token) => {
  setCookie(STORAGE_KEYS.REFRESH_TOKEN, token, REFRESH_TOKEN_DAYS, {
    secure: true, // Only send over HTTPS
    sameSite: 'Strict', // Prevent CSRF attacks
  });
};

// Remove refresh token from cookie
export const removeRefreshToken = () => {
  removeCookie(STORAGE_KEYS.REFRESH_TOKEN);
};

// ==================== USER MANAGEMENT (LocalStorage) ====================

// Get user data from localStorage
export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

// Set user data in localStorage
export const setUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

// Remove user data from localStorage
export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// ==================== CLEAR ALL AUTH DATA ====================

// Clear all authentication data (tokens from cookies, user from localStorage)
export const clearAuthData = () => {
  removeToken();
  removeRefreshToken();
  removeUser();
};
