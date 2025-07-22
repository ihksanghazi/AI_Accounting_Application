"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function DashboardPage() {
  const router = useRouter();
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => {
    if (user && !user.Company) {
      setShowSetupModal(true);
    }
  }, [user]); // Efek ini akan berjalan setiap kali data 'user' berubah

  return (
    <div>
      <Dialog open={showSetupModal} onOpenChange={setShowSetupModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selamat Datang di Aplikasi Akuntansi AI!</DialogTitle>
            <DialogDescription>
              Sepertinya Anda belum membuat perusahaan. Untuk dapat menggunakan fitur seperti manajemen akun dan pencatatan transaksi, Anda perlu membuat perusahaan terlebih dahulu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => router.push('/dashboard/company')}>
              Lanjutkan ke Setup Perusahaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Konten dasbor utama */}
      <h1 className="text-2xl font-bold mb-4">Ringkasan</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Mulai catat transaksi baru Anda dengan memindai struk.</p>
            <Button asChild>
              <Link href="/dashboard/scan">Scan Transaksi Baru</Link>
            </Button>
          </CardContent>
        </Card>
        {/* Kartu lain bisa ditambahkan di sini nanti */}
      </div>
    </div>
  );
}