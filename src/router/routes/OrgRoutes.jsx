import { lazy } from 'react';

const OrganizerHomeView = lazy(() => import('../../pages/private/Org/o01Home/OrganizerHomeView'));
const OrganizerEventView = lazy(() => import('../../pages/private/Org/o02Events/EventView'));
const EventCreateView = lazy(() => import('../../pages/private/Org/o02Events/EventCreateView'));
const OrganizerEventDetailsView = lazy(
  () => import('../../pages/private/Org/o02Events/EventDetailsView')
);
const OrgPaymentView = lazy(() => import('../../pages/private/Org/o03Payment/PaymentView'));
const OrgToolkitView = lazy(() => import('../../pages/private/Org/o04Toolkit/ToolkitView'));
const OrgProfileView = lazy(() => import('../../pages/private/Org/o05Profile/OrgProfileView'));
const OrgCouponView = lazy(() => import('../../pages/private/Org/o06Coupon/CouponView'));

export const orgRoutes = [
  { path: '', element: <OrganizerHomeView /> },
  { path: 'events', element: <OrganizerEventView /> },
  { path: 'create', element: <EventCreateView /> },
  { path: 'events/:eventId', element: <OrganizerEventDetailsView /> },
  { path: 'payment', element: <OrgPaymentView /> },
  { path: 'coupon', element: <OrgCouponView /> },
  { path: 'toolkit', element: <OrgToolkitView /> },
  { path: 'profile', element: <OrgProfileView /> },
];
