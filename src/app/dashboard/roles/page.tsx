"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
} from "lucide-react";

interface RoleItem {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: string | boolean;
  created_at: string;
}

const AVAILABLE_PERMISSIONS = [
  { key: "read", label: "Membaca Konten" },
  { key: "order", label: "Membuat Reservasi & Pesanan" },
  { key: "write_news", label: "Menulis & Mengedit Berita" },
  { key: "manage_users", label: "Mengelola Akun Pengguna" },
  { key: "all", label: "Hak Penuh (Administrator)" },
];

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPermissions, setNewPermissions] = useState<string[]>(["read"]);
  const [submitting, setSubmitting] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/roles");
      const data = await res.json();
      if (res.ok) {
        setRoles(data.roles || []);
      } else {
        setErrorMsg(data.error || "Gagal memuat daftar role.");
      }
    } catch {
      setErrorMsg("Koneksi bermasalah saat memuat role.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleTogglePermission = (perm: string) => {
    if (newPermissions.includes(perm)) {
      setNewPermissions(newPermissions.filter((p) => p !== perm));
    } else {
      setNewPermissions([...newPermissions, perm]);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    setErrorMsg("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: newDesc,
          permissions: newPermissions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal membuat role baru.");
      } else {
        setSuccessMsg(`Role "${newName}" berhasil ditambahkan.`);
        setNewName("");
        setNewDesc("");
        setNewPermissions(["read"]);
        setShowAddForm(false);
        fetchRoles();
      }
    } catch {
      setErrorMsg("Terjadi kegagalan komunikasi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async (id: string, name: string) => {
    if (!confirm(`Hapus role "${name}"? Pengguna dengan role ini harus dipindahkan terlebih dahulu.`)) {
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/roles?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal menghapus role.");
      } else {
        setSuccessMsg(`Role "${name}" berhasil dihapus.`);
        fetchRoles();
      }
    } catch {
      setErrorMsg("Terjadi kegagalan komunikasi.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#d0c4be]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#352f2b]">
            Manajemen Hak Role &amp; Izin
          </h1>
          <p className="text-xs text-[#4d4540] mt-1">
            Konfigurasi tingkatan akses pengguna (staf kasir, roaster, barista, editor, admin).
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl bg-[#352f2b] text-[#FCF0DA] text-xs font-bold hover:bg-[#4c4541] transition-all flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? "Tutup Form" : "Tambah Role Baru"}</span>
        </button>
      </div>

      {/* Alerts */}
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

      {/* Add Role Drawer / Box */}
      {showAddForm && (
        <form
          onSubmit={handleCreateRole}
          className="bg-white p-6 rounded-2xl border border-[#AEAC78]/50 shadow-md space-y-4"
        >
          <h3 className="text-sm font-bold text-[#352f2b]">Tambah Role Kustom Baru</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#352f2b] mb-1">
                Nama Role (Huruf kecil, tanpa spasi) *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="contoh: barista_staf"
                className="w-full px-3.5 py-2 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 text-xs focus:ring-1 focus:ring-[#626034] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#352f2b] mb-1">
                Keterangan Singkat
              </label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="contoh: Staf barista penyeduh kopi"
                className="w-full px-3.5 py-2 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 text-xs focus:ring-1 focus:ring-[#626034] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#352f2b] mb-2">
              Pilih Hak Izin (Permissions)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {AVAILABLE_PERMISSIONS.map((perm) => (
                <label
                  key={perm.key}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-[#d0c4be]/40 bg-[#fff8f1]/50 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={newPermissions.includes(perm.key)}
                    onChange={() => handleTogglePermission(perm.key)}
                    className="rounded text-[#626034] focus:ring-[#626034]"
                  />
                  <span className="font-medium text-[#352f2b]">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#626034] text-white text-xs font-bold hover:bg-[#49491e] transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Simpan Role</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-[#d0c4be] text-xs font-bold text-[#7f7570] hover:bg-gray-50"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="col-span-2 p-12 text-center flex flex-col items-center justify-center gap-2 text-[#7f7570]">
            <Loader2 className="w-6 h-6 animate-spin text-[#626034]" />
            <span className="text-xs">Memuat daftar role...</span>
          </div>
        ) : (
          roles.map((r) => {
            const isSystem = String(r.is_system) === "true";
            let perms: string[] = [];
            try {
              perms = JSON.parse(r.permissions);
            } catch {
              perms = [r.permissions];
            }

            return (
              <div
                key={r.id}
                className="bg-white p-6 rounded-2xl border border-[#d0c4be]/40 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-[#352f2b]">{r.name}</h3>
                      {isSystem && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f9edd7] text-[#626034] text-[10px] font-bold">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Sistem Bawaan</span>
                        </span>
                      )}
                    </div>

                    {!isSystem && (
                      <button
                        onClick={() => handleDeleteRole(r.id, r.name)}
                        title="Hapus Role"
                        className="p-1.5 rounded-lg border border-[#ba1a1a]/30 text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-[#4d4540] mb-4">
                    {r.description || "Tidak ada deskripsi"}
                  </p>

                  <div>
                    <span className="text-[11px] font-bold text-[#7f7570] uppercase tracking-wider block mb-2">
                      Hak Akses Terdaftar:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {perms.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-md bg-[#fff8f1] border border-[#d0c4be]/40 text-[11px] font-semibold text-[#352f2b]"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#d0c4be]/20 text-[11px] text-[#7f7570]">
                  ID: <code className="font-mono text-[10px]">{r.id}</code>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
