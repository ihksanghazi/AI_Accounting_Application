"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Building ,LayoutDashboard, FileText, BarChart3, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dasbor", icon: LayoutDashboard },
  { href: "/dashboard/company", label: "Perusahaan", icon: Building },
  { href: "/dashboard/scan", label: "Scan Transaksi", icon: FileText },
  { href: "/dashboard/reports", label: "Laporan", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Pengaturan", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-50 border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-center">AI Akuntansi</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}