"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Definisikan tipe untuk objek user
interface User {
  id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Cek apakah token ada. Jika tidak, tendang ke halaman login.
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // Ambil data user dari localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  if (!user) {
    // Tampilkan loading state atau null selagi data diambil
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Selamat Datang, {user.name}!</h1>
      <p className="mt-4 text-lg text-muted-foreground">Ini adalah dasbor awal Anda.</p>
      {/* Di sini nanti Anda akan menambahkan komponen lain */}
    </div>
  );
}