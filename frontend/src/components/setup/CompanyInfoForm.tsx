// frontend/src/components/setup/CompanyInfoForm.tsx
"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, "Nama perusahaan minimal 2 karakter."),
  address: z.string().optional(),
  phone: z.string().optional(),
  type: z.enum(["JASA", "DAGANG", "MANUFAKTUR"], {
    required_error: "Anda wajib memilih jenis perusahaan.",
  }),
});

interface CompanyInfoFormProps {
  onNext: (data: z.infer<typeof formSchema>) => void;
}

export function CompanyInfoForm({ onNext }: CompanyInfoFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", address: "", phone: "" },
  });

  return (
    <>
      <CardHeader className="p-0 mb-6">
        <CardTitle>Setup Perusahaan Anda</CardTitle>
        <CardDescription>Langkah 1 dari 2: Informasi Dasar</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
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
          <Button type="submit" className="w-full">Selanjutnya</Button>
        </form>
      </Form>
    </>
  );
}