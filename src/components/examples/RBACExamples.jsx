/**
 * Example Component Demonstrating Role-Based Access Control
 *
 * This file shows various ways to implement RBAC in your components.
 * Copy these patterns into your own components as needed.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useIsAuthenticated,
  useIsAdmin,
  useIsOrganizer,
  useCurrentUser,
  useHasAnyRole,
} from '../../hooks/useRoleAccess.js';
import {
  AdminOnly,
  OrganizerOnly,
  RoleBasedRender,
  AuthRequired,
} from '../../hooks/useRoleAccess.jsx';
import { ROLES } from '../../utils/auth';
import { useLogout } from '../../features/auth/hooks';
import { toast } from 'react-toastify';

/**
 * Example 1: Basic Authentication Check
 */
export const ExampleAuthCheck = () => {
  const isAuthenticated = useIsAuthenticated();
  const user = useCurrentUser();

  if (!isAuthenticated) {
    return (
      <div className="rounded border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-yellow-800">Please log in to view this content</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2>Welcome back, {user.fullName}!</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

/**
 * Example 2: Role-Specific UI Elements
 */
export const ExampleRoleBasedUI = () => {
  const isAdmin = useIsAdmin();
  const isOrganizer = useIsOrganizer();
  const navigate = useNavigate();

  return (
    <div className="space-y-4 p-4">
      {/* Button visible to all authenticated users */}
      <AuthRequired>
        <button
          onClick={() => navigate('/profile')}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          View Profile
        </button>
      </AuthRequired>

      {/* Admin-only button */}
      {isAdmin && (
        <button
          onClick={() => navigate('/dash/users')}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Manage Users (Admin Only)
        </button>
      )}

      {/* Organizer-only button */}
      {isOrganizer && (
        <button
          onClick={() => navigate('/org/events')}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Manage Events (Organizer Only)
        </button>
      )}
    </div>
  );
};

/**
 * Example 3: Using Role-Based Components
 */
export const ExampleRoleComponents = () => {
  return (
    <div className="space-y-4 p-4">
      {/* Show to authenticated users */}
      <AuthRequired fallback={<p>Please log in to continue</p>}>
        <div className="rounded bg-blue-50 p-4">
          <h3>Authenticated User Content</h3>
          <p>This is visible to all logged-in users</p>
        </div>
      </AuthRequired>

      {/* Show only to admins */}
      <AdminOnly fallback={<p>Admin access required</p>}>
        <div className="rounded bg-red-50 p-4">
          <h3>Admin Panel</h3>
          <p>System configuration and user management</p>
        </div>
      </AdminOnly>

      {/* Show only to organizers */}
      <OrganizerOnly>
        <div className="rounded bg-green-50 p-4">
          <h3>Organizer Dashboard</h3>
          <p>Create and manage your events</p>
        </div>
      </OrganizerOnly>

      {/* Show to multiple roles */}
      <RoleBasedRender
        allowedRoles={[ROLES.ADMIN, ROLES.ORGANIZER]}
        fallback={<p>Event management access required</p>}
      >
        <div className="rounded bg-purple-50 p-4">
          <h3>Event Management</h3>
          <p>Available to admins and organizers</p>
        </div>
      </RoleBasedRender>
    </div>
  );
};

/**
 * Example 4: Programmatic Role Checks
 */
export const ExampleProgrammaticCheck = () => {
  const user = useCurrentUser();
  const hasEventAccess = useHasAnyRole([ROLES.ADMIN, ROLES.ORGANIZER]);

  const handleCreateEvent = () => {
    if (!hasEventAccess) {
      toast.error('You do not have permission to create events');
      return;
    }

    // Proceed with event creation
    toast.success('Creating event...');
  };

  const handleDeleteUser = () => {
    if (user?.role !== ROLES.ADMIN) {
      toast.error('Only admins can delete users');
      return;
    }

    // Proceed with user deletion
    toast.success('Deleting user...');
  };

  return (
    <div className="space-x-4 p-4">
      <button
        onClick={handleCreateEvent}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Create Event
      </button>

      <button
        onClick={handleDeleteUser}
        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Delete User
      </button>
    </div>
  );
};

/**
 * Example 5: Navigation Menu with Role-Based Links
 */
export const ExampleNavigationMenu = () => {
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();
  const isOrganizer = useIsOrganizer();
  const user = useCurrentUser();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/auth/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <a href="/" className="hover:text-gray-300">
            Home
          </a>
          <a href="/events" className="hover:text-gray-300">
            Events
          </a>

          {isAdmin && (
            <a href="/dash" className="hover:text-gray-300">
              Admin Dashboard
            </a>
          )}

          {isOrganizer && (
            <a href="/org" className="hover:text-gray-300">
              My Events
            </a>
          )}

          {isAuthenticated && (
            <a href="/user" className="hover:text-gray-300">
              My Profile
            </a>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm">
                {user?.fullName} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-4 py-2 hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <a href="/auth/login" className="rounded bg-blue-500 px-4 py-2 hover:bg-blue-600">
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

/**
 * Example 6: Dashboard Selector Based on Role
 */
export const ExampleDashboardSelector = () => {
  const user = useCurrentUser();
  const isAdmin = useIsAdmin();
  const isOrganizer = useIsOrganizer();

  if (isAdmin) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded bg-red-100 p-4">
            <h3>Users</h3>
            <p className="text-3xl">1,234</p>
          </div>
          <div className="rounded bg-blue-100 p-4">
            <h3>Events</h3>
            <p className="text-3xl">567</p>
          </div>
          <div className="rounded bg-green-100 p-4">
            <h3>Revenue</h3>
            <p className="text-3xl">$12,345</p>
          </div>
        </div>
      </div>
    );
  }

  if (isOrganizer) {
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Organizer Dashboard</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded bg-green-100 p-4">
            <h3>My Events</h3>
            <p className="text-3xl">12</p>
          </div>
          <div className="rounded bg-blue-100 p-4">
            <h3>Total Attendees</h3>
            <p className="text-3xl">456</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">User Dashboard</h1>
      <div className="rounded bg-blue-100 p-4">
        <h3>My Bookings</h3>
        <p className="text-3xl">5</p>
      </div>
    </div>
  );
};

/**
 * Example 7: Conditional Form Fields Based on Role
 */
export const ExampleConditionalForm = () => {
  const isAdmin = useIsAdmin();

  return (
    <form className="max-w-md space-y-4 p-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Event Name</label>
        <input
          type="text"
          className="w-full rounded border px-3 py-2"
          placeholder="Enter event name"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          className="w-full rounded border px-3 py-2"
          placeholder="Enter description"
          rows={3}
        />
      </div>

      {/* Admin-only field */}
      <AdminOnly>
        <div>
          <label className="mb-1 block text-sm font-medium">Featured Event (Admin Only)</label>
          <input type="checkbox" className="mr-2" />
          <span className="text-sm">Mark as featured on homepage</span>
        </div>
      </AdminOnly>

      {isAdmin && (
        <div>
          <label className="mb-1 block text-sm font-medium">System Priority (Admin Only)</label>
          <select className="w-full rounded border px-3 py-2">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
      >
        Create Event
      </button>
    </form>
  );
};
