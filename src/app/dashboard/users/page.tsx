"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Shield,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  status: "active" | "inactive";
  created_at: string;
}

interface RoleItem {
  id: string;
  name: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
        setRoles(data.roles || []);
      } else {
        setErrorMsg(data.error || "Gagal memuat pengguna.");
      }
    } catch {
      setErrorMsg("Koneksi bermasalah saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    setProcessingId(userId);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role_id: newRoleId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal mengubah role pengguna.");
      } else {
        setSuccessMsg("Role pengguna berhasil diperbarui.");
        fetchUsers();
      }
    } catch {
      setErrorMsg("Terjadi kegagalan komunikasi.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setProcessingId(userId);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal mengubah status pengguna.");
      } else {
        setSuccessMsg(`Status pengguna berhasil diubah menjadi ${newStatus}.`);
        fetchUsers();
      }
    } catch {
      setErrorMsg("Terjadi kegagalan komunikasi.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun "${userName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setProcessingId(userId);

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal menghapus pengguna.");
      } else {
        setSuccessMsg(`Pengguna "${userName}" berhasil dihapus.`);
        fetchUsers();
      }
    } catch {
      setErrorMsg("Terjadi kegagalan komunikasi.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#d0c4be]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#352f2b]">
            Manajemen Pengguna &amp; Akun
          </h1>
          <p className="text-xs text-[#4d4540] mt-1">
            Kelola daftar pengguna terdaftar, tetapkan role, dan pantau status akun.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7f7570]" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#fff8f1] border border-[#d0c4be]/60 text-xs focus:ring-1 focus:ring-[#626034] focus:border-[#626034] outline-none"
          />
        </div>
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

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-[#d0c4be]/40 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-2 text-[#7f7570]">
            <Loader2 className="w-6 h-6 animate-spin text-[#626034]" />
            <span className="text-xs">Memuat data pengguna...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-[#7f7570]">
            <Users className="w-10 h-10 mx-auto text-[#d0c4be] mb-2" />
            <p className="text-sm font-semibold text-[#352f2b]">Tidak ada pengguna ditemukan.</p>
            <p className="text-xs mt-1">Coba kata kunci pencarian yang lain.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f9edd7]/60 text-[#352f2b] font-bold border-b border-[#d0c4be]/30 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Nama &amp; Email</th>
                  <th className="px-5 py-3.5">Hak Role</th>
                  <th className="px-5 py-3.5">Status Akun</th>
                  <th className="px-5 py-3.5">Terdaftar</th>
                  <th className="px-5 py-3.5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d0c4be]/20">
                {filteredUsers.map((u) => {
                  const isProcessing = processingId === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-[#fff8f1]/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#352f2b]">{u.name}</div>
                        <div className="text-[11px] text-[#7f7570] font-mono mt-0.5">
                          {u.email}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          disabled={isProcessing}
                          value={u.role_id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/50 text-xs text-[#352f2b] font-semibold focus:ring-1 focus:ring-[#626034] outline-none"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.status === "active"
                              ? "bg-[#e8e5ad]/60 text-[#626034]"
                              : "bg-[#ffdad6]/60 text-[#93000a]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === "active" ? "bg-[#626034]" : "bg-[#ba1a1a]"
                            }`}
                          ></span>
                          <span>{u.status === "active" ? "Aktif" : "Nonaktif"}</span>
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[#7f7570] text-[11px]">
                        {new Date(u.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-5 py-4 text-right space-x-1.5">
                        {/* Toggle Status Button */}
                        <button
                          disabled={isProcessing}
                          onClick={() => handleStatusToggle(u.id, u.status)}
                          title={u.status === "active" ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            u.status === "active"
                              ? "border-[#d0c4be]/50 text-[#7f7570] hover:text-[#93000a] hover:bg-[#ffdad6]/40"
                              : "border-[#AEAC78]/50 text-[#626034] hover:bg-[#e8e5ad]/40"
                          }`}
                        >
                          {u.status === "active" ? (
                            <UserX className="w-3.5 h-3.5" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          disabled={isProcessing}
                          onClick={() => handleDelete(u.id, u.name)}
                          title="Hapus Pengguna"
                          className="p-1.5 rounded-lg border border-[#ba1a1a]/30 text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
