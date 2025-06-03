import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthStore();
  
  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate({ to: '/', replace: true });
    }
  }, [isAuthenticated, token, navigate]);

  if (!isAuthenticated || !token) {
    return null;
  }

  return <>{children}</>;
}