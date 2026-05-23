// Roles — keep in sync with guard files
export const ROLES = {
  ADMIN: 'ADMIN',
  ORGANIZER: 'ORGANIZER',
  USER: 'USER',
};

// Get authenticated user from Redux store or storage
// Note: This is used by route guards. For components, use Redux selectors.
export const getAuthUser = () => {
  // Try to get from localStorage (set by Redux)
  try {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading auth user:', error);
    return null;
  }
};

// Get dashboard path based on user role
export const getDashboardPathByRole = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return '/dash';
    case ROLES.ORGANIZER:
      return '/org';
    case ROLES.USER:
      return '/user';
    default:
      return '/auth/login';
  }
};

// Check if user has specific role
export const hasRole = (user, role) => {
  return user?.role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (user, roles) => {
  return user && roles.includes(user.role);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const user = getAuthUser();
  return user !== null;
};
