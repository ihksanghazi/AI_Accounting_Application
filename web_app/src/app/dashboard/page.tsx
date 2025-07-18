"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Selamat Datang, {user.name}!</h1>
        <p className="mt-4 text-lg text-muted-foreground">Siap untuk mencatat transaksi?</p>
      </div>
      <div className="mt-8">
        {/* Tombol ini akan mengarahkan ke halaman scan */}
        <Button asChild size="lg">
          <Link href="/dashboard/scan">Tambah Transaksi Baru</Link>
        </Button>
      </div>
    </div>
  );
}