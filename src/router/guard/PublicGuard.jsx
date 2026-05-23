import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  selectAuthUser,
  selectIsAuthenticated,
  selectAuthInitialized,
} from '../../features/auth/selectors';
import { getDashboardPathByRole } from '../../utils/auth';
import { getToken } from '../../utils/storage';

/**
 * Prevents authenticated users from accessing auth pages (login, register, etc.).
 *
 * IMPORTANT: Waits for auth initialization before making decisions.
 *
 * Flow:
 * 1. If auth not initialized → Wait (return null)
 * 2. If authenticated → Redirect to dashboard
 * 3. If not authenticated → Allow access to auth pages
 */
const PublicGuard = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authInitialized = useSelector(selectAuthInitialized);
  const user = useSelector(selectAuthUser);
  const hasToken = getToken();
  const location = useLocation();

  // CRITICAL: Wait for auth initialization
  // Prevents flicker when refreshing on login page
  if (!authInitialized) {
    return null; // App.jsx shows AuthInitLoader
  }

  // Allow authenticated users to revisit registration, but keep organizers/admins on their dashboard.
  if (location.pathname === '/auth/register' && user?.role === 'USER') {
    return <Outlet />;
  }

  // If authenticated with valid token, redirect to dashboard
  if (isAuthenticated && hasToken && user) {
    return <Navigate to={getDashboardPathByRole(user.role)} replace />;
  }

  return <Outlet />;
};

export default PublicGuard;
