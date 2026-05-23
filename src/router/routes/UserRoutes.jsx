import { lazy } from 'react';

const UserDashboardView = lazy(() => import('../../pages/private/User/UserDashboardView'));
const UserEditProfileView = lazy(() => import('../../pages/private/User/UserEditProfileView'));

export const userRoutes = [
  { path: '', element: <UserDashboardView /> },
  { path: 'edit', element: <UserEditProfileView /> },
];
