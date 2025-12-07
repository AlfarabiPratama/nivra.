import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSyncStore } from '../store/useSyncStore';
import { LoadingScreen } from '../components/ui/LoadingScreen';

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSyncStore();
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    // Give time for auth to initialize
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
