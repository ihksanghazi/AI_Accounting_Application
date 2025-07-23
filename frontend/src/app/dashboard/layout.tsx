// frontend/src/app/dashboard/layout.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
  const router = useRouter();
  const { isAuthenticated, status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (status === 'idle' && !isAuthenticated) {
      router.replace('/login');
    }
  }, [status, isAuthenticated, router]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Memeriksa sesi...</div>;
  }

  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">{children}</main>
        </div>
      </div>
    );
  }

  return null;
}