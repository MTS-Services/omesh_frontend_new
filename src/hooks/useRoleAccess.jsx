import { useHasAnyRole } from './useRoleAccess';
import { useIsAuthenticated } from './useRoleAccess';
import { ROLES } from '../utils/auth';

/**
 * Component to conditionally render based on user role
 * @param {Object} props
 * @param {Array<string>} props.allowedRoles - Roles that can see the content
 * @param {React.ReactNode} props.children - Content to render if user has role
 * @param {React.ReactNode} props.fallback - Content to render if user doesn't have role
 */
export const RoleBasedRender = ({ allowedRoles, children, fallback = null }) => {
  const hasAccess = useHasAnyRole(allowedRoles);
  return hasAccess ? children : fallback;
};

/**
 * Component to show content only to authenticated users
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render if authenticated
 * @param {React.ReactNode} props.fallback - Content to render if not authenticated
 */
export const AuthRequired = ({ children, fallback = null }) => {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? children : fallback;
};

/**
 * Component to show content only to admins
 */
export const AdminOnly = ({ children, fallback = null }) => {
  return (
    <RoleBasedRender allowedRoles={[ROLES.ADMIN]} fallback={fallback}>
      {children}
    </RoleBasedRender>
  );
};

/**
 * Component to show content only to organizers
 */
export const OrganizerOnly = ({ children, fallback = null }) => {
  return (
    <RoleBasedRender allowedRoles={[ROLES.ORGANIZER]} fallback={fallback}>
      {children}
    </RoleBasedRender>
  );
};

/**
 * Component to show content only to regular users
 */
export const UserOnly = ({ children, fallback = null }) => {
  return (
    <RoleBasedRender allowedRoles={[ROLES.USER]} fallback={fallback}>
      {children}
    </RoleBasedRender>
  );
};
