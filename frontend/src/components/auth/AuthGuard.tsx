// frontend/src/components/auth/AuthGuard.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, status, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (status === 'idle') {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (user && !user.company) {
        router.replace('/setup');
      }
    }
  }, [status, isAuthenticated, user, router]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Memeriksa sesi...</div>;
  }

  if (isAuthenticated && user?.company) {
    return <>{children}</>;
  }

  return <div className="flex items-center justify-center min-h-screen">Mengarahkan...</div>;
}