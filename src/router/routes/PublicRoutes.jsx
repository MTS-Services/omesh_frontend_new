import { lazy } from 'react';

const HomeView = lazy(() => import('../../pages/public/public01Home/HomeView'));
const EventsView = lazy(() => import('../../pages/public/public02Events/EventsView'));
const DetailsView = lazy(() => import('../../pages/public/public02Events/DetailsView'));
const CheckoutView = lazy(() => import('../../pages/public/public02Events/CheckoutView'));
const OrganizerView = lazy(() => import('../../pages/public/public03Organizer/OrganizerView'));
const TrainingView = lazy(() => import('../../pages/public/public04Training/TrainingView'));
const TrainingDetailsView = lazy(
  () => import('../../pages/public/public04Training/TrainingDetailsView')
);
const AboutView = lazy(() => import('../../pages/public/public05About/AboutView'));
const FaqView = lazy(() => import('../../pages/public/public06FAQ/FaqView'));
const TermsView = lazy(() => import('../../pages/public/Terms'));
const PaymentSuccess = lazy(() => import('../../pages/public/payment/PaymentSuccess'));
const PaymentFailed = lazy(() => import('../../pages/public/payment/PaymentFailed'));

export const publicRoutes = [
  { path: '', element: <HomeView /> },
  { path: 'events', element: <EventsView /> },
  { path: 'events/checkout', element: <CheckoutView /> },
  { path: 'payment-success', element: <PaymentSuccess /> },
  { path: 'events/payment-success', element: <PaymentSuccess /> },
  { path: 'payment-failed', element: <PaymentFailed /> },
  { path: 'events/payment-failed', element: <PaymentFailed /> },
  { path: 'events/:id', element: <DetailsView /> },
  { path: 'about', element: <AboutView /> },
  { path: 'organizer-toolkit', element: <OrganizerView /> },
  { path: 'training-plans', element: <TrainingView /> },
  { path: 'training-plans/:id', element: <TrainingDetailsView /> },
  { path: 'faq', element: <FaqView /> },
  { path: 'terms', element: <TermsView /> },
  { path: 'privacy', element: <TermsView /> },
];
