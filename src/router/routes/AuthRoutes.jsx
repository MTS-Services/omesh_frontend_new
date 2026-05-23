import { lazy } from 'react';

const LoginView = lazy(() => import('../../pages/auth/LoginView'));
const RegisterView = lazy(() => import('../../pages/auth/RegisterView'));
const ResetPasswordView = lazy(() => import('../../pages/auth/ResetPasswordView'));
const SetOTPView = lazy(() => import('../../pages/auth/SetOTPView'));
const SetPasswordView = lazy(() => import('../../pages/auth/SetPasswordView'));

export const authRoutes = [
  { path: 'login', element: <LoginView /> },
  { path: 'register', element: <RegisterView /> },
  { path: 'reset-password', element: <ResetPasswordView /> },
  { path: 'verify-otp', element: <SetOTPView /> },
  { path: 'new-password', element: <SetPasswordView /> },
];
