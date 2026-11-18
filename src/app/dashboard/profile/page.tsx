"use client";

import { useState } from "react";
import { KeyRound, ShieldAlert, CheckCircle2, AlertCircle, Loader2, Lock } from "lucide-react";

export default function ProfilePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Kata sandi baru minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal mengubah kata sandi.");
      } else {
        setSuccessMsg("Kata sandi Anda berhasil diperbarui dan disimpan dalam bentuk enkripsi hash!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setErrorMsg("Terjadi gangguan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-[#d0c4be]/40 shadow-xs">
        <h1 className="text-xl font-extrabold text-[#352f2b]">
          Profil &amp; Keamanan Akun
        </h1>
        <p className="text-xs text-[#4d4540] mt-1">
          Ubah kata sandi akun administrator Anda untuk menjaga kerahasiaan akses sistem.
        </p>

        {/* Security Alert Reminder */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#e8e5ad]/40 border border-[#626034]/20 flex items-start gap-2.5 text-xs text-[#1d1d00]">
          <ShieldAlert className="w-4 h-4 text-[#626034] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Keamanan Password:</span> Kata sandi disimpan menggunakan algoritma hashing satu arah (Bcrypt). Kata sandi asli tidak pernah dapat dibaca langsung oleh siapa pun di database.
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-[#ffdad6]/80 border border-[#ba1a1a]/30 flex items-start gap-2.5 text-xs text-[#93000a]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-[#e8e5ad]/60 border border-[#626034]/30 flex items-center gap-2.5 text-xs text-[#1d1d00]">
          <CheckCircle2 className="w-4 h-4 text-[#626034] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl border border-[#d0c4be]/40 shadow-xs space-y-4"
      >
        <div>
          <label className="block text-xs font-bold text-[#352f2b] mb-1.5" htmlFor="currentPassword">
            Kata Sandi Saat Ini *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7f7570]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="currentPassword"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Masukkan kata sandi saat ini (bawaan: 123456)"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 focus:border-[#626034] focus:ring-1 focus:ring-[#626034] text-xs sm:text-sm outline-none text-[#352f2b]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#352f2b] mb-1.5" htmlFor="newPassword">
            Kata Sandi Baru * (Min. 6 Karakter)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7f7570]">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              id="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Kata sandi baru yang kuat"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 focus:border-[#626034] focus:ring-1 focus:ring-[#626034] text-xs sm:text-sm outline-none text-[#352f2b]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#352f2b] mb-1.5" htmlFor="confirmPassword">
            Ulangi Kata Sandi Baru *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7f7570]">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi baru"
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
              <span>Memperbarui Sandi...</span>
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4" />
              <span>Simpan Kata Sandi Baru</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
