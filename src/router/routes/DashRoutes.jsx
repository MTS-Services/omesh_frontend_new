import { lazy } from 'react';

const AdminHomeView = lazy(() => import('../../pages/private/Admin/a01Home/HomeView'));
const UserPageView = lazy(() => import('../../pages/private/Admin/a04Payouts/UserPageView'));
const AdminRequestedEventsView = lazy(
  () => import('../../pages/private/Admin/a02Event/view/RequestedEvent')
);
const AdminApprovedEventsView = lazy(
  () => import('../../pages/private/Admin/a02Event/view/ApprovedEventsView')
);
const AdminSuspendedEventsView = lazy(
  () => import('../../pages/private/Admin/a02Event/view/SuspendedEventsView')
);
const AdminEventsDetailsView = lazy(
  () => import('../../pages/private/Admin/a02Event/EventsDetailsView')
);
const AdminTrainingView = lazy(
  () => import('../../pages/private/Admin/a03Training/TrainingPlanView')
);
const AdminPayoutView = lazy(
  () => import('../../pages/private/Admin/a04Payouts/PayoutRequestView')
);
const AdminToolkitView = lazy(() => import('../../pages/private/Admin/a05Toolkit/ToolkitView'));
const AdminSettingsView = lazy(() => import('../../pages/private/Admin/a06Settings/SettingsView'));
const AdminProfileView = lazy(() => import('../../pages/private/Admin/a07Profile/ProfileView'));

export const dashRoutes = [
  { path: '', index: true, element: <AdminHomeView /> },
  { path: 'events/requested', element: <AdminRequestedEventsView /> },
  { path: 'events/approved', element: <AdminApprovedEventsView /> },
  { path: 'events/suspended', element: <AdminSuspendedEventsView /> },
  { path: 'events/:id', element: <AdminEventsDetailsView /> },
  { path: 'training-plan', element: <AdminTrainingView /> },
  { path: 'payout-request', element: <AdminPayoutView /> },
  { path: 'organizer', element: <UserPageView /> },
  { path: 'toolkit', element: <AdminToolkitView /> },
  { path: 'settings', element: <AdminSettingsView /> },
  { path: 'profile', element: <AdminProfileView /> },
];
