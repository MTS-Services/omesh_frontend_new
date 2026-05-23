import { ENV } from './env';

/* ----------------------------- App ----------------------------- */
export const APP_CONFIG = Object.freeze({
  NAME: ENV.VITE_APP_NAME || 'React Boilerplate',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'en',
  DEFAULT_THEME: 'light',
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
});

/* ----------------------------- API ----------------------------- */
export const API_CONFIG = Object.freeze({
  BASE_URL: ENV.VITE_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: ENV.IS_DEV ? 10_000 : 15_000,
  WITH_CREDENTIALS: false,
});

/* ----------------------------- Auth ---------------------------- */
export const AUTH_CONFIG = Object.freeze({
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'auth_user',
  LOGIN_REDIRECT: '/dashboard',
  LOGOUT_REDIRECT: '/login',
});

/* --------------------------- Storage --------------------------- */
export const STORAGE_KEYS = Object.freeze({
  TOKEN: AUTH_CONFIG.TOKEN_KEY,
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: AUTH_CONFIG.USER_KEY,
  THEME: 'app_theme',
});

/* ---------------------------- Theme ---------------------------- */
export const THEME_CONFIG = Object.freeze({
  STORAGE_KEY: STORAGE_KEYS.THEME,
  MODES: {
    LIGHT: 'light',
    DARK: 'dark',
  },
});
