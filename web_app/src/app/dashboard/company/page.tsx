"use client";

import { useState, useEffect, useCallback } from "react";
import { CompanyForm } from "@/components/company/CompanyForm";

interface Company { id: string; name: string; }

export default function CompanyPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buat fungsi untuk mengambil data agar bisa dipanggil ulang
  const fetchCompanyData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch('/api/companies', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Gagal mengambil data perusahaan.");
      
      const data = await response.json();
      setCompany(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ambil data saat halaman pertama kali dimuat
  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  if (isLoading) {
    return <div>Memuat data perusahaan...</div>;
  }

  if (error) {
    return <div className="text-destructive">Error: {error}</div>;
  }

  // Tampilkan form dengan data awal (bisa null jika belum ada perusahaan)
  // dan berikan fungsi fetchCompanyData sebagai callback onSuccess
  return (
    <div>
      <CompanyForm initialData={company} onSuccess={fetchCompanyData} />
    </div>
  );
}