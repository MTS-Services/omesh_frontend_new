import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from './router/router';
import { restoreAuth, clearAuth, setAuthInitialized } from './features/auth/authSlice';
import { selectAuthInitialized } from './features/auth/selectors';
import { getToken, getUser } from './utils/storage';
import { setLogoutCallback } from './api/client';
import AuthInitLoader from './components/common/AuthInitLoader';

function App() {
  const dispatch = useDispatch();
  const authInitialized = useSelector(selectAuthInitialized);

  // Register logout callback for API client
  // This allows the API client to trigger logout without hard redirects
  useEffect(() => {
    const handleLogout = () => {
      dispatch(clearAuth());
      // Use router navigation instead of window.location
      router.navigate('/auth/login', { replace: true });
    };

    setLogoutCallback(handleLogout);
  }, [dispatch]);

  // Initialize authentication on app load
  // This runs ONCE before routes are rendered
  useEffect(() => {
    const initializeAuth = () => {
      const token = getToken();
      const user = getUser();

      if (token && user) {
        // User has valid session - restore auth
        dispatch(restoreAuth({ token, user }));
      } else {
        // No valid session - mark as initialized anyway
        dispatch(setAuthInitialized());
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Show loading screen while checking auth
  // This prevents blank screens and route flicker
  if (!authInitialized) {
    return <AuthInitLoader />;
  }

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
