"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { UserPlus, ArrowLeft, AlertCircle, CheckCircle2, Lock, Mail, User, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Gagal mendaftar.");
        setLoading(false);
        return;
      }

      setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke beranda...");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 900);
    } catch {
      setErrorMsg("Terjadi gangguan koneksi. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f1] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#F2C46A] selection:text-[#2F2B28]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#626034] hover:text-[#352f2b] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

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
            Buat Akun Baru
          </h2>
          <p className="text-xs text-[#4d4540] mt-1">
            Bergabung dengan keluarga pelanggan {siteConfig.name}
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
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
              <label className="block text-xs font-bold text-[#352f2b] mb-1.5" htmlFor="name">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7f7570]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Muhammad Ihsan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 focus:border-[#626034] focus:ring-1 focus:ring-[#626034] text-xs sm:text-sm outline-none text-[#352f2b]"
                />
              </div>
            </div>

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
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 focus:border-[#626034] focus:ring-1 focus:ring-[#626034] text-xs sm:text-sm outline-none text-[#352f2b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#352f2b] mb-1.5" htmlFor="password">
                Kata Sandi (Min. 6 Karakter)
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
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 focus:border-[#626034] focus:ring-1 focus:ring-[#626034] text-xs sm:text-sm outline-none text-[#352f2b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#352f2b] mb-1.5" htmlFor="confirmPassword">
                Ulangi Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7f7570]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
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
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar Sekarang</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#4d4540]">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="font-bold text-[#626034] hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
