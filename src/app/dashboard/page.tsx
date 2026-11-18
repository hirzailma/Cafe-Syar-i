import { db, User, Role, News } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Newspaper,
  ShieldAlert,
  ArrowRight,
  Database,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const current = await getCurrentUser();
  const [users, roles, newsList] = await Promise.all([
    db.find<User>("Users"),
    db.find<Role>("Roles"),
    db.find<News>("News"),
  ]);

  const publishedNews = newsList.filter((n) => n.status === "published").length;
  const isUsingAppsScript = !!process.env.APPS_SCRIPT_URL;

  // Cek apakah admin masih memakai hash default 123456
  const isDefaultPassword =
    current?.user.password_hash ===
    "$2b$10$lIJuRVQtg80iUlGPewB/9.cL/m2g15bkovpASGnaS6bSBo1TcbYFm";

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#d0c4be]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#AEAC78] uppercase tracking-wider">
            Selamat Datang di Admin Panel
          </span>
          <h1 className="text-2xl font-extrabold text-[#352f2b] tracking-tight mt-1">
            Assalamu&apos;alaikum, {current?.user.name || "Administrator"}
          </h1>
          <p className="text-xs text-[#4d4540] mt-1">
            Kelola pengguna, perizinan role, dan artikel warta Cafe Syar&apos;i dari satu tempat.
          </p>
        </div>

        {/* Database Status Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f9edd7] border border-[#d0c4be]/40 text-xs text-[#626034] font-semibold self-start sm:self-auto">
          <Database className="w-3.5 h-3.5 text-[#626034]" />
          <span>
            {isUsingAppsScript
              ? "Terhubung ke Google Spreadsheet"
              : "Database Mode: Lokal Siap Cloud"}
          </span>
        </div>
      </div>

      {/* Security Warning If Default Password Still Active */}
      {isDefaultPassword && (
        <div className="p-4 rounded-2xl bg-[#ffdad6]/80 border border-[#ba1a1a]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#93000a]">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-[#ba1a1a]" />
            <div>
              <h4 className="text-xs font-bold text-[#ba1a1a]">
                Peringatan Keamanan: Kata Sandi Bawaan Aktif
              </h4>
              <p className="text-xs text-[#93000a]/90 mt-0.5">
                Akun admin Anda masih menggunakan kata sandi bawaan (<code className="font-mono bg-white/60 px-1 rounded">123456</code>). Harap segera ganti kata sandi ini demi keamanan website sebelum peluncuran.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/profile"
            className="px-4 py-2 rounded-xl bg-[#ba1a1a] text-white text-xs font-bold hover:bg-[#93000a] transition-colors self-start sm:self-auto shrink-0 flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Ganti Password Sekarang</span>
          </Link>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-2xl border border-[#d0c4be]/40 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#7f7570] uppercase">Total Pengguna</p>
            <h3 className="text-3xl font-extrabold text-[#352f2b] mt-1">{users.length}</h3>
            <p className="text-[11px] text-[#AEAC78] font-semibold mt-1">
              {users.filter((u) => u.status === "active").length} Aktif
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FCF0DA] flex items-center justify-center text-[#626034]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-2xl border border-[#d0c4be]/40 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#7f7570] uppercase">Total Role</p>
            <h3 className="text-3xl font-extrabold text-[#352f2b] mt-1">{roles.length}</h3>
            <p className="text-[11px] text-[#AEAC78] font-semibold mt-1">
              {roles.filter((r) => String(r.is_system) === "true").length} Sistem Bawaan
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FCF0DA] flex items-center justify-center text-[#626034]">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-2xl border border-[#d0c4be]/40 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#7f7570] uppercase">Artikel Berita</p>
            <h3 className="text-3xl font-extrabold text-[#352f2b] mt-1">{newsList.length}</h3>
            <p className="text-[11px] text-[#626034] font-semibold mt-1">
              {publishedNews} Tayang di Beranda
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FCF0DA] flex items-center justify-center text-[#626034]">
            <Newspaper className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/dashboard/users"
          className="bg-white p-6 rounded-2xl border border-[#d0c4be]/40 shadow-xs hover:border-[#626034] transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#f9edd7] flex items-center justify-center text-[#626034] mb-3 group-hover:bg-[#F2C46A] group-hover:text-[#2F2B28] transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#352f2b]">Kelola Pengguna</h3>
            <p className="text-xs text-[#4d4540] mt-1">
              Lihat daftar akun terdaftar, ubah hak role, atau nonaktifkan akun yang melanggar.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#d0c4be]/20 flex items-center justify-between text-xs font-bold text-[#626034]">
            <span>Buka Manajemen User</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          href="/dashboard/roles"
          className="bg-white p-6 rounded-2xl border border-[#d0c4be]/40 shadow-xs hover:border-[#626034] transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#f9edd7] flex items-center justify-center text-[#626034] mb-3 group-hover:bg-[#F2C46A] group-hover:text-[#2F2B28] transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#352f2b]">Kelola Hak Role</h3>
            <p className="text-xs text-[#4d4540] mt-1">
              Atur hak akses kustom untuk kasir, roaster, staf barista, atau editor konten.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#d0c4be]/20 flex items-center justify-between text-xs font-bold text-[#626034]">
            <span>Buka Manajemen Role</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          href="/dashboard/news"
          className="bg-white p-6 rounded-2xl border border-[#d0c4be]/40 shadow-xs hover:border-[#626034] transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#f9edd7] flex items-center justify-center text-[#626034] mb-3 group-hover:bg-[#F2C46A] group-hover:text-[#2F2B28] transition-colors">
              <Newspaper className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#352f2b]">Tulis &amp; Sunting Berita</h3>
            <p className="text-xs text-[#4d4540] mt-1">
              Tambahkan catatan rasa kopi, info workshop seduh, atau warta kajian dengan upload media lokal.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#d0c4be]/20 flex items-center justify-between text-xs font-bold text-[#626034]">
            <span>Buka CRUD Berita</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
