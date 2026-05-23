// Auth selectors
export const selectAuth = (state) => state.auth;
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthRefreshToken = (state) => state.auth.refreshToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthInitialized = (state) => state.auth.authInitialized; // NEW: Check if auth has been initialized
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthLoading = (state) => state.auth.status === 'loading';
export const selectAuthError = (state) => state.auth.error;
export const selectUserStats = (state) => state.auth.stats;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectIsAdmin = (state) => state.auth.user?.role === 'ADMIN';
export const selectIsOrganizer = (state) => state.auth.user?.role === 'ORGANIZER';
export const selectIsUser = (state) => state.auth.user?.role === 'USER';
