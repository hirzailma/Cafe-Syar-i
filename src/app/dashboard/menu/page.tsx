"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Save } from "lucide-react";
import { MenuItem } from "@/types/order";

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "minuman" as MenuItem["category"],
  image_path: "/images/coffee-beans.png",
  is_available: true,
};

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/menu");
      const data = await res.json();
      setItems(data.data || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setEditId(null);
    setModal("add");
  };

  const openEdit = (item: MenuItem) => {
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      image_path: item.image_path,
      is_available: item.is_available,
    });
    setEditId(item.id);
    setModal("edit");
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      alert("Nama, harga, dan kategori wajib diisi");
      return;
    }
    setSaving(true);
    const payload = { ...form, price: Number(form.price) };
    if (modal === "add") {
      await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, ...payload }),
      });
    }
    await fetchMenu();
    setSaving(false);
    setModal(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus menu ini?")) return;
    setDeleting(id);
    await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" });
    await fetchMenu();
    setDeleting(null);
  };

  const toggleAvailable = async (item: MenuItem) => {
    await fetch("/api/admin/menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, is_available: !item.is_available }),
    });
    fetchMenu();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#352f2b]">Manajemen Menu</h1>
          <p className="text-sm text-[#4d4540] mt-1">
            Tambah, edit, atau nonaktifkan item menu.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#352f2b] text-[#FCF0DA] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#4c4541] transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Menu
        </button>
      </div>

      {loading ? (
        <p className="text-center py-16 text-[#4d4540]">Memuat menu...</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-4 flex items-center gap-4 transition-all ${
                item.is_available
                  ? "border-[#AEAC78]/20"
                  : "border-[#AEAC78]/10 opacity-60"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[#352f2b] text-sm">
                    {item.name}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#FCF0DA] text-[#626034] font-medium capitalize">
                    {item.category}
                  </span>
                  {!item.is_available && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">
                      Tidak Tersedia
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#4d4540]/70 mt-0.5 line-clamp-1">
                  {item.description}
                </p>
                <p className="font-bold text-[#626034] mt-1 text-sm">
                  {formatRp(item.price)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleAvailable(item)}
                  title={item.is_available ? "Nonaktifkan" : "Aktifkan"}
                  className="p-1.5 rounded-lg hover:bg-[#FCF0DA] transition-colors"
                >
                  {item.is_available ? (
                    <ToggleRight className="w-5 h-5 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-[#AEAC78]" />
                  )}
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 rounded-lg hover:bg-[#FCF0DA] text-[#AEAC78] transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah/Edit */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#352f2b]">
                {modal === "add" ? "Tambah Menu Baru" : "Edit Menu"}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="p-1 rounded-lg hover:bg-[#FCF0DA] text-[#4d4540]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#352f2b] mb-1 uppercase tracking-wide">
                  Nama Menu *
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[#AEAC78]/30 focus:border-[#352f2b] focus:outline-none text-sm text-[#352f2b]"
                  placeholder="Nama menu"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#352f2b] mb-1 uppercase tracking-wide">
                  Deskripsi
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#AEAC78]/30 focus:border-[#352f2b] focus:outline-none text-sm text-[#352f2b] resize-none"
                  placeholder="Deskripsi singkat menu"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#352f2b] mb-1 uppercase tracking-wide">
                    Harga (Rp) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#AEAC78]/30 focus:border-[#352f2b] focus:outline-none text-sm text-[#352f2b]"
                    placeholder="20000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#352f2b] mb-1 uppercase tracking-wide">
                    Kategori *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        category: e.target.value as MenuItem["category"],
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#AEAC78]/30 focus:border-[#352f2b] focus:outline-none text-sm text-[#352f2b] bg-white"
                  >
                    <option value="minuman">Minuman</option>
                    <option value="makanan">Makanan</option>
                    <option value="paket">Paket</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_avail"
                  checked={form.is_available}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, is_available: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[#352f2b]"
                />
                <label
                  htmlFor="is_avail"
                  className="text-sm text-[#352f2b] font-medium"
                >
                  Tersedia / Aktif
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModal(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#AEAC78]/30 text-[#4d4540] font-semibold text-sm hover:bg-[#FCF0DA] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-[#352f2b] text-[#FCF0DA] font-bold py-2.5 rounded-xl hover:bg-[#4c4541] transition-colors disabled:opacity-60 text-sm"
              >
                <Save className="w-4 h-4" />
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
