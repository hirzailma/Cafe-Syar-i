"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Newspaper,
  KeyRound,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Coffee,
  UtensilsCrossed,
  ClipboardList,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Ringkasan",      href: "/dashboard",         icon: LayoutDashboard },
    { name: "Manajemen User", href: "/dashboard/users",   icon: Users           },
    { name: "Manajemen Role", href: "/dashboard/roles",   icon: ShieldCheck     },
    { name: "CRUD Berita",    href: "/dashboard/news",    icon: Newspaper       },
    { name: "Menu Kafe",      href: "/dashboard/menu",    icon: UtensilsCrossed },
    { name: "Pesanan",        href: "/dashboard/orders",  icon: ClipboardList   },
    { name: "Ganti Password", href: "/dashboard/profile", icon: KeyRound        },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f1] flex flex-col md:flex-row text-[#352f2b]">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#2F2B28] text-[#FCF0DA] px-4 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-md bg-[#201b0e] p-1 border border-[#AEAC78]/30">
            <Image
              src={siteConfig.logo}
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">{siteConfig.name}</h1>
            <p className="text-[10px] text-[#AEAC78]">Admin Panel</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg text-[#FCF0DA] hover:bg-[#4c4541]"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2F2B28] text-[#FCF0DA] flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-[#4c4541] hidden md:flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg bg-[#201b0e] p-1 border border-[#AEAC78]/40">
              <Image
                src={siteConfig.logo}
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#FCF0DA] leading-tight">
                {siteConfig.name}
              </h2>
              <span className="text-[10px] uppercase font-bold text-[#F2C46A] tracking-wider">
                Admin Dashboard
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Menu Admin">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#626034] text-white shadow-xs"
                      : "text-[#d0c4be] hover:bg-[#4c4541] hover:text-[#FCF0DA]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#4c4541] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold text-[#d0c4be] hover:bg-[#4c4541] hover:text-[#FCF0DA] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Coffee className="w-3.5 h-3.5 text-[#AEAC78]" />
              <span>Lihat Website</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#ba1a1a] hover:bg-[#ba1a1a]/15 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
