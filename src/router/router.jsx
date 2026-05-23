// @refresh reset
import { lazy, Suspense } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layout/PublicLayout';
import AuthLayout from '../layout/AuthLayout';
import DashLayout from '../layout/DashLayout';
import EventsLayout from '../layout/EventsLayout';

// Guards
import AuthGuard from './guard/AuthGuard';
import PublicGuard from './guard/PublicGuard';
import RoleGuard from './guard/RoleGuard';
import { ROLES } from '../utils/auth';

// Route definitions
import { publicRoutes } from './routes/PublicRoutes';
import { authRoutes } from './routes/AuthRoutes';
import { dashRoutes } from './routes/DashRoutes';
import { orgRoutes } from './routes/OrgRoutes';
import { userRoutes } from './routes/UserRoutes';

const NotFound = lazy(() => import('../pages/error/NotFound'));
import ErrorFallback from '../components/common/ErrorFallback';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* 🔓 Public — no auth required */}
      <Route path="/" element={<PublicLayout />} errorElement={<ErrorFallback />}>
        {publicRoutes.map((r) => (
          <Route key={r.path} path={r.path} index={r.path === ''} element={r.element} />
        ))}
      </Route>

      {/* 🔐 Auth — redirect to dashboard if already logged in */}
      <Route element={<PublicGuard />} errorElement={<ErrorFallback />}>
        <Route path="/auth" element={<AuthLayout />}>
          {authRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>
      </Route>

      {/* 🛡️ Protected — must be authenticated */}
      <Route element={<AuthGuard />} errorElement={<ErrorFallback />}>
        {/* Admin */}
        <Route element={<RoleGuard allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/dash" element={<DashLayout />}>
            <Route path="events" element={<EventsLayout />}>
              <Route index element={<Navigate to="requested" replace />} />
              {dashRoutes
                .filter((r) => r.path.startsWith('events/'))
                .map((r) => (
                  <Route key={r.path} path={r.path.replace('events/', '')} element={r.element} />
                ))}
            </Route>
            {dashRoutes
              .filter((r) => !r.path.startsWith('events/'))
              .map((r) => (
                <Route key={r.path} path={r.path} index={r.index} element={r.element} />
              ))}
          </Route>
        </Route>

        {/* Organizer */}
        <Route element={<RoleGuard allowedRoles={[ROLES.ORGANIZER]} />}>
          <Route path="/org" element={<DashLayout />}>
            {orgRoutes.map((r) => (
              <Route key={r.path} path={r.path} index={r.path === ''} element={r.element} />
            ))}
          </Route>
        </Route>

        {/* User */}
        <Route element={<RoleGuard allowedRoles={[ROLES.USER]} />}>
          <Route path="/user" element={<PublicLayout />}>
            {userRoutes.map((r) => (
              <Route key={r.path} path={r.path} index={r.path === ''} element={r.element} />
            ))}
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Suspense fallback={null}>
            <NotFound />
          </Suspense>
        }
      />
    </>
  )
);

export default router;
