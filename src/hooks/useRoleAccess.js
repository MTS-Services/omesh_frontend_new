import { useSelector } from 'react-redux';
import {
  selectAuthUser,
  selectIsAuthenticated,
  selectUserRole,
  selectAuthInitialized,
} from '../features/auth/selectors';
import { ROLES } from '../utils/auth';

/**
 * Hook to check if auth has been initialized
 * @returns {boolean} - True if auth initialization is complete
 */
export const useAuthInitialized = () => {
  return useSelector(selectAuthInitialized);
};

/**
 * Hook to check if user has a specific role
 * @param {string} role - Role to check (ROLES.ADMIN, ROLES.ORGANIZER, ROLES.USER)
 * @returns {boolean} - True if user has the role
 */
export const useHasRole = (role) => {
  const userRole = useSelector(selectUserRole);
  return userRole === role;
};

/**
 * Hook to check if user has any of the specified roles
 * @param {Array<string>} roles - Array of roles to check
 * @returns {boolean} - True if user has any of the roles
 */
export const useHasAnyRole = (roles) => {
  const userRole = useSelector(selectUserRole);
  return roles.includes(userRole);
};

/**
 * Hook to check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export const useIsAuthenticated = () => {
  return useSelector(selectIsAuthenticated);
};

/**
 * Hook to get current user
 * @returns {Object|null} - Current user object or null
 */
export const useCurrentUser = () => {
  return useSelector(selectAuthUser);
};

/**
 * Hook to check if user is admin
 * @returns {boolean} - True if user is admin
 */
export const useIsAdmin = () => {
  return useHasRole(ROLES.ADMIN);
};

/**
 * Hook to check if user is organizer
 * @returns {boolean} - True if user is organizer
 */
export const useIsOrganizer = () => {
  return useHasRole(ROLES.ORGANIZER);
};

/**
 * Hook to check if user is regular user
 * @returns {boolean} - True if user is regular user
 */
export const useIsUser = () => {
  return useHasRole(ROLES.USER);
};
