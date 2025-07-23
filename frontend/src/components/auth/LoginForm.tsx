"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { login } from '@/store/slices/authSlice';

const formSchema = z.object({
  email: z.email({ message: "Format email tidak valid." }),
  password: z.string().min(1, { message: "Password tidak boleh kosong." }),
});

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', values);
      const data = response.data; 
      dispatch(login(data)); 
      toast.success("Login berhasil!");

      if (data.hasCompletedSetup) {
        router.push('/dashboard');
      } else {
        router.push('/setup');
      }

    } catch (err: any) {
      // ... (error handling)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Masuk ke akun Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="email@contoh.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><Input type="password" placeholder="******" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}