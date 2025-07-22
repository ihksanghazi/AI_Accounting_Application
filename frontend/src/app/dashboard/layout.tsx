// web_app/src/app/dashboard/layout.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

// Impor hooks dan tipe dari Redux
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace('/login');
      } else {
        setIsReady(true);
      }
    }, 100); // Penundaan kecil untuk memastikan state Redux sudah terisi

    return () => clearTimeout(timer);

  }, [isAuthenticated, router]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Memeriksa sesi...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}