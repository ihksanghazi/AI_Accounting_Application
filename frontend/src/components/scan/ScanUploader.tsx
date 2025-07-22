"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";

// Definisikan tipe data untuk hasil ekstraksi agar TypeScript mengenali
interface ExtractedData {
  vendor_name: string | null;
  transaction_date: string | null;
  total_amount: number | null;
}

interface ScanResult {
  message: string;
  filename: string;
  extracted_data: ExtractedData;
}

export function ScanUploader() {
  // State untuk menyimpan file yang dipilih oleh user
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // State untuk URL preview gambar agar bisa ditampilkan di UI
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // State untuk menunjukkan proses loading saat API dipanggil
  const [isLoading, setIsLoading] = useState(false);
  // State untuk menyimpan pesan error
  const [error, setError] = useState<string | null>(null);
  // State untuk menyimpan hasil JSON dari API Gemini
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  // 'ref' digunakan untuk memicu klik pada input file yang kita sembunyikan
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi ini berjalan saat user memilih file
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Buat URL sementara untuk preview gambar
      setPreviewUrl(URL.createObjectURL(file));
      // Reset hasil scan sebelumnya
      setScanResult(null); 
      setError(null);
    }
  };

  // Fungsi ini berjalan saat tombol "Proses Sekarang" diklik
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Silakan pilih file terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setScanResult(null);

    // FormData adalah cara standar untuk mengirim file melalui request HTTP
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Panggil API di ai_service
      const response = await fetch(`${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/scan/process`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Gagal memproses gambar.");
      }

      setScanResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Scan Transaksi Baru</CardTitle>
        <CardDescription>Unggah gambar struk atau faktur untuk diproses oleh AI.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input file yang disembunyikan */}
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />

        {/* Area untuk menampilkan preview atau tombol upload */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <Image src={previewUrl} alt="Preview" width={400} height={400} className="mx-auto max-h-64 w-auto" />
          ) : (
            <div>
              <p className="text-gray-500">Klik di sini untuk memilih gambar</p>
              <p className="text-xs text-gray-400">PNG, JPG, atau WEBP</p>
            </div>
          )}
        </div>

        {/* Tombol Aksi */}
        {selectedFile && (
          <div className="flex justify-center">
            <Button onClick={handleUpload} disabled={isLoading} className="w-full md:w-1/2">
              {isLoading ? "Memproses..." : "Proses Sekarang"}
            </Button>
          </div>
        )}

        {/* Area untuk menampilkan hasil atau error */}
        {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}

        {scanResult && (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold mb-2">Hasil Ekstraksi AI:</h3>
            <pre className="text-sm bg-gray-100 p-3 rounded-md overflow-x-auto">
              {JSON.stringify(scanResult.extracted_data, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}