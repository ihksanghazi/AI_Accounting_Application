import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div>
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
      </div>
    </div>
  );
}