"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import { LogIn, ArrowLeft, AlertCircle, CheckCircle2, Lock, Mail, Loader2, ShieldAlert } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) setErrorMsg(error);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
        setLoading(false);
        return;
      }

      setSuccessMsg("Berhasil masuk! Mengalihkan...");
      const redirect = searchParams.get("redirect");

      setTimeout(() => {
        if (data.user.role === "admin") {
          router.push(redirect || "/dashboard");
        } else {
          router.push(redirect || "/");
        }
        router.refresh();
      }, 700);
    } catch {
      setErrorMsg("Terjadi gangguan koneksi. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-8 shadow-sm rounded-2xl border border-[#d0c4be]/40">
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-[#ffdad6]/70 border border-[#ba1a1a]/30 flex items-start gap-2 text-xs text-[#93000a]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-[#e8e5ad]/60 border border-[#626034]/30 flex items-center gap-2 text-xs text-[#1d1d00]">
          <CheckCircle2 className="w-4 h-4 text-[#626034] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#352f2b] mb-1.5" htmlFor="email">
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7f7570]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 focus:border-[#626034] focus:ring-1 focus:ring-[#626034] text-xs sm:text-sm outline-none text-[#352f2b]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#352f2b] mb-1.5" htmlFor="password">
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7f7570]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 focus:border-[#626034] focus:ring-1 focus:ring-[#626034] text-xs sm:text-sm outline-none text-[#352f2b]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-[#352f2b] text-[#FCF0DA] hover:bg-[#4c4541] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memeriksa...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Masuk Sekarang</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-[#4d4540]">
        Belum memiliki akun?{" "}
        <Link href="/register" className="font-bold text-[#626034] hover:underline">
          Daftar akun baru
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fff8f1] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#F2C46A] selection:text-[#2F2B28]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#626034] hover:text-[#352f2b] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Brand Header */}
        <div className="text-center flex flex-col items-center">
          <div className="relative w-14 h-14 overflow-hidden rounded-xl bg-[#2F2B28] p-1.5 shadow-sm border border-[#AEAC78]/30 mb-3">
            <Image
              src={siteConfig.logo}
              alt={`Logo ${siteConfig.name}`}
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-extrabold text-[#352f2b] tracking-tight">
            Masuk ke Akun Anda
          </h2>
          <p className="text-xs text-[#4d4540] mt-1">
            Akses dashboard administrasi atau kelola akun {siteConfig.name}
          </p>
        </div>

        {/* Default Admin Notice Card */}
        <div className="mt-5 p-3.5 rounded-xl bg-[#e8e5ad]/40 border border-[#626034]/20 flex items-start gap-2.5 text-xs text-[#1d1d00]">
          <ShieldAlert className="w-4 h-4 text-[#626034] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Akun Admin Bawaan:</span>
            <div className="text-[11px] font-mono mt-0.5 text-[#352f2b]">
              Email: <strong>admin@gmail.com</strong> | Kata Sandi: <strong>123456</strong>
            </div>
            <p className="text-[10px] text-[#ba1a1a] font-semibold mt-1">
              *Harap segera ganti kata sandi admin setelah masuk melalui menu profil!
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Suspense
          fallback={
            <div className="p-12 text-center bg-white rounded-2xl border border-[#d0c4be]/40 text-xs text-[#7f7570]">
              Memuat formulir masuk...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
