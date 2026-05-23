import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthInitialized } from '../../features/auth/selectors';
import { getToken } from '../../utils/storage';

/**
 * Protects routes that require authentication.
 *
 * IMPORTANT: This guard waits for auth initialization before making decisions.
 * This prevents blank screens and premature redirects.
 *
 * Flow:
 * 1. If auth not initialized yet → Show nothing (parent shows loader)
 * 2. If initialized + authenticated → Allow access
 * 3. If initialized + not authenticated → Redirect to login
 */
const AuthGuard = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authInitialized = useSelector(selectAuthInitialized);
  const hasToken = getToken();

  // CRITICAL: Wait for auth initialization
  // Without this, routes render before we know if user is logged in
  if (!authInitialized) {
    return null; // Return nothing - App.jsx shows AuthInitLoader
  }

  // Check both Redux state and token existence
  if (!isAuthenticated || !hasToken) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
