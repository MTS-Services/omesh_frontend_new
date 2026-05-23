import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectAuthUser,
  selectIsAuthenticated,
  selectAuthInitialized,
} from '../../features/auth/selectors';
import { getDashboardPathByRole } from '../../utils/auth';
import { getToken } from '../../utils/storage';

/**
 * Restricts access to users whose role is in allowedRoles.
 *
 * IMPORTANT: Waits for auth initialization before making decisions.
 *
 * Flow:
 * 1. If auth not initialized → Wait (return null)
 * 2. If not authenticated → Redirect to login
 * 3. If wrong role → Redirect to their dashboard
 * 4. If correct role → Allow access
 */
const RoleGuard = ({ allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authInitialized = useSelector(selectAuthInitialized);
  const user = useSelector(selectAuthUser);
  const hasToken = getToken();

  // CRITICAL: Wait for auth initialization
  if (!authInitialized) {
    return null; // App.jsx shows AuthInitLoader
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !hasToken || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Wrong role - redirect to their own dashboard
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPathByRole(user.role)} replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
