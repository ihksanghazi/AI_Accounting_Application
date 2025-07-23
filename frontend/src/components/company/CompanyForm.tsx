"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/axios";

// Impor hooks, actions, dan tipe data yang benar
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setUser, setCompany } from "@/store/slices/authSlice";
import { Company } from "@/types";

// Impor semua komponen UI yang dibutuhkan
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const formSchema = z.object({
  name: z.string().min(2, "Nama perusahaan minimal 2 karakter."),
  address: z.string().optional(),
  phone: z.string().optional(),
  type: z.enum(["JASA", "DAGANG", "MANUFAKTUR"], {
    required_error: "Anda wajib memilih jenis perusahaan.",
  }),
});

interface CompanyFormProps {
  initialData: Company | null;
}

export function CompanyForm({ initialData }: CompanyFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const method = isEditMode ? 'PUT' : 'POST';
      const response = await api({ method: `/companies`, data: values });

      if (isEditMode) {
        // Update: dispatch data perusahaan yang baru
        dispatch(setCompany(response.data));
        toast.success("Perusahaan berhasil diupdate!");
      } else {
        // Create: dispatch data user yang baru (sudah berisi company)
        dispatch(setUser(response.data.user));
        toast.success("Perusahaan berhasil dibuat! Mengarahkan ke dasbor utama...");
        // Arahkan ke dasbor utama setelah berhasil membuat perusahaan
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(`Gagal ${isEditMode ? 'mengupdate' : 'membuat'} perusahaan`, {
        description: err.response?.data?.error,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Perusahaan Anda" : "Buat Perusahaan Anda"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Form Fields untuk name, address, phone, dan type */}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Nama Perusahaan</FormLabel><FormControl><Input placeholder="PT. Maju Jaya" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem><FormLabel>Alamat</FormLabel><FormControl><Input placeholder="Jl. Jenderal Sudirman No. 1" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>No. Telepon</FormLabel><FormControl><Input placeholder="08123456789" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Perusahaan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Pilih jenis perusahaan..." /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="JASA">Jasa</SelectItem>
                    <SelectItem value="DAGANG">Dagang</SelectItem>
                    <SelectItem value="MANUFAKTUR">Manufaktur</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : (isEditMode ? "Update Perusahaan" : "Buat Perusahaan")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}