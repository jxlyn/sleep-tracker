import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

export const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 