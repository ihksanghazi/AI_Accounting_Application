// frontend/src/app/login/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  
  const { isAuthenticated, status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (status === 'idle' && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router, status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Anda sudah login, mengarahkan ke dasbor...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
}