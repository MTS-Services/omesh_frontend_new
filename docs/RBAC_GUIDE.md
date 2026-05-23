# 🛡️ Role-Based Access Control (RBAC)

## Overview

This application implements a comprehensive Role-Based Access Control system using React Router guards and Redux state management. Users are automatically redirected based on their role and authentication status.

## User Roles

```javascript
ROLES = {
  ADMIN: 'ADMIN',
  ORGANIZER: 'ORGANIZER',
  USER: 'USER',
};
```

| Role          | Dashboard Path | Access Level                          |
| ------------- | -------------- | ------------------------------------- |
| **ADMIN**     | `/dash`        | Full system access, admin panel       |
| **ORGANIZER** | `/org`         | Event management, organizer dashboard |
| **USER**      | `/user`        | User dashboard, event participation   |

## Route Protection System

### 1. **AuthGuard** - Requires Authentication

Protects routes that require any authenticated user:

- Checks Redux `isAuthenticated` state
- Validates token existence in cookies
- Redirects to `/auth/login` if not authenticated

```javascript
<Route element={<AuthGuard />}>{/* Protected routes here */}</Route>
```

### 2. **RoleGuard** - Role-Specific Access

Restricts access to specific roles:

- Verifies user has one of the allowed roles
- Redirects unauthorized users to their own dashboard
- Redirects unauthenticated users to login

```javascript
<Route element={<RoleGuard allowedRoles={[ROLES.ADMIN]} />}>{/* Admin-only routes */}</Route>
```

### 3. **PublicGuard** - Guest Only

Prevents authenticated users from accessing auth pages:

- Redirects authenticated users to their dashboard
- Allows unauthenticated users through

```javascript
<Route element={<PublicGuard />}>
  <Route path="/auth" element={<AuthLayout />}>
    {/* Login, Register pages */}
  </Route>
</Route>
```

## Route Structure

```
/                          → Public (no auth required)
  ├─ /                     → Home page
  ├─ /about                → About page
  └─ /events               → Public events listing

/auth                      → PublicGuard (logged in users redirected)
  ├─ /auth/login           → Login page
  ├─ /auth/register        → Registration page
  └─ /auth/reset-password  → Password reset

/dash                      → AuthGuard + RoleGuard(ADMIN)
  ├─ /dash                 → Admin dashboard
  ├─ /dash/events          → Event management
  └─ /dash/users           → User management

/org                       → AuthGuard + RoleGuard(ORGANIZER)
  ├─ /org                  → Organizer dashboard
  ├─ /org/events           → My events
  └─ /org/payments         → Payment management

/user                      → AuthGuard + RoleGuard(USER)
  ├─ /user                 → User dashboard
  ├─ /user/bookings        → My bookings
  └─ /user/profile         → Profile settings
```

## Login Flow

```
User logs in
    ↓
API returns user + role
    ↓
Redux stores auth state
    ↓
Tokens saved to cookies
    ↓
Navigate to role-based dashboard
    ↓
Route guards validate access
    ↓
User sees their dashboard
```

## Access Control in Components

### Using Hooks

```javascript
import { useIsAdmin, useIsAuthenticated, useHasRole } from '@/hooks/useRoleAccess';

function MyComponent() {
  const isAdmin = useIsAdmin();
  const isAuthenticated = useIsAuthenticated();
  const isOrganizer = useHasRole(ROLES.ORGANIZER);

  if (!isAuthenticated) return <LoginPrompt />;
  if (!isAdmin) return <AccessDenied />;

  return <AdminPanel />;
}
```

### Using Components

```javascript
import { AdminOnly, RoleBasedRender, AuthRequired } from '@/hooks/useRoleAccess';

function Dashboard() {
  return (
    <>
      {/* Show only to authenticated users */}
      <AuthRequired fallback={<LoginButton />}>
        <UserMenu />
      </AuthRequired>

      {/* Show only to admins */}
      <AdminOnly>
        <AdminPanel />
      </AdminOnly>

      {/* Show to multiple roles */}
      <RoleBasedRender allowedRoles={[ROLES.ADMIN, ROLES.ORGANIZER]}>
        <EventManagement />
      </RoleBasedRender>
    </>
  );
}
```

## Available Hooks

| Hook                     | Returns        | Description                        |
| ------------------------ | -------------- | ---------------------------------- |
| `useIsAuthenticated()`   | `boolean`      | Check if user is logged in         |
| `useCurrentUser()`       | `User \| null` | Get current user object            |
| `useHasRole(role)`       | `boolean`      | Check if user has specific role    |
| `useHasAnyRole(roles[])` | `boolean`      | Check if user has any of the roles |
| `useIsAdmin()`           | `boolean`      | Check if user is admin             |
| `useIsOrganizer()`       | `boolean`      | Check if user is organizer         |
| `useIsUser()`            | `boolean`      | Check if user is regular user      |

## Available Components

| Component           | Props                              | Description                        |
| ------------------- | ---------------------------------- | ---------------------------------- |
| `<AuthRequired>`    | `children, fallback`               | Show content only if authenticated |
| `<RoleBasedRender>` | `allowedRoles, children, fallback` | Show content based on roles        |
| `<AdminOnly>`       | `children, fallback`               | Show content only to admins        |
| `<OrganizerOnly>`   | `children, fallback`               | Show content only to organizers    |
| `<UserOnly>`        | `children, fallback`               | Show content only to users         |

## Redirect Behavior

### After Login

- **ADMIN** → `/dash`
- **ORGANIZER** → `/org`
- **USER** → `/user`

### Unauthorized Access

- **Not authenticated** → `/auth/login`
- **Wrong role** → User's own dashboard

### Authenticated User Accessing Auth Pages

- Trying to access `/auth/login` → Redirect to dashboard

## Examples

### Protected Component

```javascript
function UserProfile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return <ProfileContent user={user} />;
}
```

### Conditional UI Based on Role

```javascript
function Navigation() {
  const isAdmin = useIsAdmin();
  const isOrganizer = useIsOrganizer();

  return (
    <nav>
      <Link to="/">Home</Link>

      {isAdmin && <Link to="/dash">Admin Panel</Link>}
      {isOrganizer && <Link to="/org">My Events</Link>}

      <AuthRequired>
        <Link to="/profile">Profile</Link>
      </AuthRequired>
    </nav>
  );
}
```

### Programmatic Role Check

```javascript
import { ROLES, hasAnyRole } from '@/utils/auth';

function handleAction(user) {
  if (hasAnyRole(user, [ROLES.ADMIN, ROLES.ORGANIZER])) {
    // Allow event creation
    createEvent();
  } else {
    toast.error('Insufficient permissions');
  }
}
```

## Security Considerations

### Client-Side Guards

- ✅ Prevent UI access to unauthorized routes
- ✅ Hide sensitive UI elements from wrong roles
- ✅ Redirect users appropriately

### ⚠️ Important

Client-side guards are **NOT** sufficient for security!

**Always enforce permissions on the backend:**

- Validate user roles on every API endpoint
- Don't trust client-side role information
- Implement server-side authorization checks

### Backend Authorization Example

```javascript
// Server-side route protection (example)
app.get('/api/admin/users', authenticateToken, authorizeRoles([ROLES.ADMIN]), getUsersHandler);
```

## Testing Different Roles

### Development Testing

1. **Register with different roles**:

   ```json
   { "email": "admin@test.com", "role": "ADMIN" }
   { "email": "org@test.com", "role": "ORGANIZER" }
   { "email": "user@test.com", "role": "USER" }
   ```

2. **Verify redirects**:
   - Login as each role
   - Check redirect to correct dashboard
   - Try accessing other role's routes
   - Verify proper redirect behavior

3. **Test guards**:
   - Try accessing protected routes while logged out
   - Try accessing different role routes
   - Verify fallback behavior

## Troubleshooting

### Issue: Not redirecting after login

**Solution**: Check if `getDashboardPathByRole()` returns correct path for user's role

### Issue: Can access wrong role's routes

**Solution**: Verify `RoleGuard` is wrapping the route correctly

### Issue: Infinite redirect loop

**Solution**: Check `PublicGuard` and `AuthGuard` aren't conflicting

### Issue: User stays on login page

**Solution**: Verify tokens are being saved and auth state is updated

## Best Practices

1. **Always use guards** for route protection
2. **Hide UI elements** users can't access
3. **Show clear error messages** for unauthorized access
4. **Provide fallbacks** for conditional rendering
5. **Validate on backend** - never trust client checks
6. **Use hooks** instead of direct Redux selectors
7. **Test all role paths** thoroughly

---

**Last Updated**: April 22, 2026
**Status**: ✅ Production Ready
