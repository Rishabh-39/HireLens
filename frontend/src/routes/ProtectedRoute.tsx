import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import type { Role } from '../api/auth.api';

export function ProtectedRoute({ allow }: { allow: Role }) {
  const { user, accessToken } = useAppSelector((s) => s.auth);

  if (!accessToken || !user) {
    return <Navigate to={allow === 'HR' ? '/hr/login' : '/login'} replace />;
  }
  if (user.role !== allow) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
