"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  const router = useRouter();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Anda sudah login, mengarahkan ke dasbor...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <RegisterForm />
    </div>
  );
}