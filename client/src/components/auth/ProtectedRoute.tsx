import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '@/services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      const isAdmin = authService.isAdmin();

      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (adminOnly && !isAdmin) {
        router.push('/');
        return;
      }
    };

    checkAuth();
  }, [router, adminOnly]);

  return <>{children}</>;
}
