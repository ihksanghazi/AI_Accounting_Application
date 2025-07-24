// frontend/src/components/layout/Header.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

export function Header() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout()); 
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div>
        <h1 className="text-lg font-semibold">Dasbor</h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Tampilkan nama user dari state Redux */}
        <span>Halo, {user?.name || "Pengguna"}!</span>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}