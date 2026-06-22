import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Loader2 } from 'lucide-react';

export function AdminProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-brand-900">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export function AdminGuestRoute({ children, allowRegister = false }) {
  const { isAuthenticated, loading, registered } = useAdminAuth();

  if (loading || registered === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-brand-900">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!allowRegister && !registered) {
    return <Navigate to="/admin/register" replace />;
  }

  if (allowRegister && registered) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
