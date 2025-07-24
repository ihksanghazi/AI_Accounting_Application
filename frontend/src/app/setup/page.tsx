// frontend/src/app/setup/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CompanyForm } from "@/components/company/CompanyForm";

export default function SetupPage() {
    const router = useRouter();
    const { isAuthenticated, status, user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        // Jika sudah selesai loading DAN (tidak login ATAU sudah punya perusahaan)
        if (status === 'idle' && (!isAuthenticated || user?.company)) {
            // Tendang ke halaman yang sesuai
            router.replace(isAuthenticated ? '/dashboard' : '/login');
        }
    }, [status, isAuthenticated, user, router]);

    // Tampilkan loading jika Redux masih memuat atau sedang redirect
    if (status === 'loading' || !isAuthenticated || user?.company) {
        return <div className="flex items-center justify-center min-h-screen">Memuat...</div>;
    }
    
    // Tampilkan form hanya jika user sudah login TAPI belum punya perusahaan
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <CompanyForm initialData={null} />
        </div>
    );
}