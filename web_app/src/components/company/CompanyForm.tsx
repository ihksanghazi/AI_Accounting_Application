// web_app/src/components/company/CompanyForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface Company { id: string; name: string; }

// Skema validasi form
const formSchema = z.object({
  name: z.string().min(2, "Nama perusahaan minimal 2 karakter."),
});

// Komponen menerima data awal (jika ada) dan fungsi callback
interface CompanyFormProps {
  initialData: Company | null;
  onSuccess: () => void; // Fungsi untuk me-refresh data di halaman utama
}

export function CompanyForm({ initialData, onSuccess }: CompanyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tentukan apakah form ini dalam mode "edit" atau "create"
  const isEditMode = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  useEffect(() => {
    // Update nilai form jika initialData berubah
    form.reset({ name: initialData?.name || "" });
  }, [initialData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");

    try {
      const url = '/api/companies';
      // Tentukan metode HTTP: PUT untuk update, POST untuk create
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Gagal ${isEditMode ? 'mengupdate' : 'membuat'} perusahaan.`);

      // Jika membuat perusahaan baru, data user perlu di-update
      if (!isEditMode && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      alert(`Perusahaan berhasil ${isEditMode ? 'diupdate' : 'dibuat'}!`);
      onSuccess(); // Panggil callback untuk refresh data di halaman utama

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Perusahaan Anda" : "Buat Perusahaan Anda"}</CardTitle>
        <CardDescription>
          {isEditMode ? "Anda bisa mengubah nama perusahaan Anda di sini." : "Anda belum memiliki perusahaan. Silakan buat satu."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Perusahaan</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: PT. Maju Jaya" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : (isEditMode ? "Update Perusahaan" : "Buat Perusahaan")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}