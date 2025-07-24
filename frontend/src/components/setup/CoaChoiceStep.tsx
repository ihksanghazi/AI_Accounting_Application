// frontend/src/components/setup/CoaChoiceStep.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, FileUp } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { User } from "@/types"; // Impor tipe User

interface CoaChoiceStepProps {
  companyData: any;
  onBack: () => void;
}

// Hapus onFinish dari props, kita akan tangani navigasi di sini
export function CoaChoiceStep({ companyData, onBack }: CoaChoiceStepProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/companies', companyData);
      
      // Ambil data user yang sudah ter-update dari respons API
      const updatedUser: User = response.data.user;

      // --- PERUBAHAN UTAMA DI SINI ---
      
      // 1. Update localStorage SECARA LANGSUNG dengan data user terbaru
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success("Setup berhasil!", {
        description: "Perusahaan dan daftar akun Anda telah dibuat. Mengarahkan ke dasbor..."
      });
      
      // 2. Lakukan FULL PAGE RELOAD ke dasbor
      // Tunda sedikit agar user bisa membaca toast
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Terjadi kesalahan";
      toast.error("Gagal menyelesaikan setup", { description: errorMessage });
      setIsLoading(false);
    }
    // Perhatikan: kita tidak set isLoading ke false di 'finally' jika berhasil,
    // karena halaman akan di-reload total.
  };

  return (
    <>
      <CardHeader className="p-0 mb-6">
        <CardTitle>Setup Daftar Akun</CardTitle>
        <CardDescription>Langkah 2 dari 2: Pilih cara Anda memulai.</CardDescription>
      </CardHeader>
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">Bagaimana Anda ingin membuat Daftar Akun?</p>
        <div className="flex flex-col gap-4">
          <Button onClick={handleGenerate} disabled={isLoading} size="lg">
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "AI sedang bekerja..." : "Generate Otomatis dengan AI"}
          </Button>
          <Button variant="outline" size="lg" disabled>
            <FileUp className="mr-2 h-4 w-4" />
            Impor dari PDF/Gambar (Segera Hadir)
          </Button>
        </div>
        <Button variant="link" onClick={onBack} disabled={isLoading}>
          Kembali
        </Button>
      </div>
    </>
  );
}