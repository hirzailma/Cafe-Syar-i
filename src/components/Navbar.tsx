"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Menu, X, LogIn, LayoutDashboard, User } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authData, setAuthData] = useState<{
    authenticated: boolean;
    user?: { name: string; role: string };
  }>({ authenticated: false });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Cek status sesi pengguna
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthData({ authenticated: true, user: data.user });
        } else {
          setAuthData({ authenticated: false });
        }
      })
      .catch(() => { });
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/#beranda" },
    { name: "Tentang Kami", href: "/#tentang" },
    { name: "Layanan", href: "/#layanan" },
    { name: "Kabar Kopi", href: "/#kabar" },
    { name: "Katalog Menu", href: "/menu" },
    { name: "Kontak", href: "/#kontak" },
  ];
  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[#fff8f1]/95 backdrop-blur-md shadow-sm border-b border-[#352f2b]/10"
        : "bg-[#fff8f1]/90 backdrop-blur-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#AEAC78] rounded-lg p-1"
        >
          <div className="relative w-14 h-14 overflow-hidden rounded-2xl shadow-sm transition-transform duration-200 group-hover:scale-105 shrink-0">
            <Image
              src={siteConfig.logo}
              alt={`Logo ${siteConfig.name}`}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-[#352f2b] tracking-tight group-hover:text-[#626034] transition-colors">
              {siteConfig.name}
            </span>
            <span className="text-[10px] font-semibold text-[#AEAC78] tracking-widest uppercase -mt-0.5">
              Kedai Kopi &amp; Edukasi
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Navigasi Utama">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[#4d4540] hover:text-[#352f2b] font-medium text-sm transition-colors duration-200 relative py-1 hover:border-b-2 hover:border-[#626034]"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right CTA / Auth Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {authData.authenticated ? (
            authData.user?.role === "admin" ? (
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#352f2b] text-[#FCF0DA] hover:bg-[#4c4541] transition-all duration-200 text-xs font-bold shadow-xs"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Buka Dashboard</span>
              </Link>
            ) : (
              <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f9edd7] border border-[#d0c4be]/40 text-xs font-semibold text-[#352f2b]">
                <User className="w-3.5 h-3.5 text-[#626034]" />
                <span>{authData.user?.name}</span>
              </div>
            )
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#352f2b] text-[#352f2b] hover:bg-[#352f2b] hover:text-[#FCF0DA] transition-all duration-200 text-sm font-semibold shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-[#352f2b] hover:bg-[#ede1cc] transition-colors focus:outline-none focus:ring-2 focus:ring-[#AEAC78]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fff8f1] border-b border-[#352f2b]/10 shadow-lg px-6 py-5 transition-all">
          <nav className="flex flex-col gap-4" aria-label="Navigasi Seluler">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#352f2b] text-base font-medium hover:text-[#626034] py-1 border-b border-[#ede1cc]/60 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2">
              {authData.authenticated ? (
                authData.user?.role === "admin" ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#352f2b] text-[#FCF0DA] font-semibold text-sm hover:bg-[#4c4541] transition-colors shadow-xs"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Buka Dashboard</span>
                  </Link>
                ) : (
                  <div className="text-center p-2 rounded-lg bg-[#f9edd7] text-xs font-semibold text-[#352f2b]">
                    Masuk sebagai {authData.user?.name}
                  </div>
                )
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#352f2b] text-[#FCF0DA] font-semibold text-sm hover:bg-[#4c4541] transition-colors shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk Akun</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
