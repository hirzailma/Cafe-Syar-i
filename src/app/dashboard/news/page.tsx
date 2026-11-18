"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Newspaper,
  Plus,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Upload,
  Eye,
  Calendar,
  X,
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export default function NewsCrudPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Editor Modal / Box state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [thumbnailPath, setThumbnailPath] = useState("/images/coffee-beans.png");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Pratinjau modal
  const [previewArticle, setPreviewArticle] = useState<NewsItem | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/news");
      const data = await res.json();
      if (res.ok) {
        setNews(data.news || []);
      } else {
        setErrorMsg(data.error || "Gagal memuat berita.");
      }
    } catch {
      setErrorMsg("Koneksi bermasalah saat memuat berita.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openCreateModal = () => {
    setEditId(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setStatus("published");
    setThumbnailPath("/images/coffee-beans.png");
    setThumbnailFile(null);
    setPreviewUrl(null);
    setIsEditing(true);
  };

  const openEditModal = (item: NewsItem) => {
    setEditId(item.id);
    setTitle(item.title);
    setExcerpt(item.excerpt);
    setContent(item.content);
    setStatus(item.status);
    setThumbnailPath(item.thumbnail_path);
    setThumbnailFile(null);
    setPreviewUrl(item.thumbnail_path);
    setIsEditing(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setErrorMsg("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("status", status);

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      } else {
        formData.append("thumbnail_path", thumbnailPath);
      }

      let res;
      if (editId) {
        formData.append("id", editId);
        res = await fetch("/api/admin/news", {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch("/api/admin/news", {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal menyimpan artikel.");
      } else {
        setSuccessMsg(
          editId ? "Artikel berhasil diperbarui." : "Artikel baru berhasil diterbitkan."
        );
        setIsEditing(false);
        fetchNews();
      }
    } catch {
      setErrorMsg("Terjadi gangguan saat menyimpan artikel.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`Hapus artikel "${itemTitle}"? Foto thumbnail lokal juga akan dibersihkan.`)) {
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/news?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal menghapus berita.");
      } else {
        setSuccessMsg(`Artikel "${itemTitle}" berhasil dihapus.`);
        fetchNews();
      }
    } catch {
      setErrorMsg("Terjadi gangguan saat menghapus artikel.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#d0c4be]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#352f2b]">
            CRUD Berita &amp; Catatan Rasa
          </h1>
          <p className="text-xs text-[#4d4540] mt-1">
            Tambah artikel baru dengan upload thumbnail lokal. Berita berstatus &quot;published&quot; otomatis tampil di landing page.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#352f2b] text-[#FCF0DA] text-xs font-bold hover:bg-[#4c4541] transition-all flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Artikel Baru</span>
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

      {/* Form Editor Modal / Block */}
      {isEditing && (
        <div className="bg-white p-6 rounded-2xl border border-[#AEAC78]/60 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#d0c4be]/30 pb-3">
            <h3 className="text-sm font-bold text-[#352f2b]">
              {editId ? "Sunting Artikel Berita" : "Tulis Artikel Berita Baru"}
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="text-[#7f7570] hover:text-[#352f2b]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#352f2b] mb-1">
                    Judul Artikel *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Mengenal Profil Rasa Biji Kopi Gayo"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 text-xs focus:ring-1 focus:ring-[#626034] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#352f2b] mb-1">
                    Ringkasan Singkat (Excerpt)
                  </label>
                  <input
                    type="text"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Ringkasan 1-2 kalimat untuk kartu beranda..."
                    className="w-full px-3.5 py-2 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 text-xs focus:ring-1 focus:ring-[#626034] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#352f2b] mb-1">
                    Konten Lengkap *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tuliskan isi berita, edukasi kopi, atau catatan rasa lengkap..."
                    className="w-full px-3.5 py-2 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 text-xs focus:ring-1 focus:ring-[#626034] outline-none resize-y"
                  />
                </div>
              </div>

              {/* Sidebar Settings in Modal */}
              <div className="space-y-4 bg-[#fff8f1]/50 p-4 rounded-xl border border-[#d0c4be]/30">
                <div>
                  <label className="block text-xs font-bold text-[#352f2b] mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#d0c4be]/60 text-xs font-semibold focus:ring-1 focus:ring-[#626034] outline-none"
                  >
                    <option value="published">Published (Tayang di Web)</option>
                    <option value="draft">Draft (Arsip Internal)</option>
                  </select>
                </div>

                {/* Upload Thumbnail Media */}
                <div>
                  <label className="block text-xs font-bold text-[#352f2b] mb-1.5">
                    Upload Foto Thumbnail (Lokal)
                  </label>
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-[#AEAC78]/60 flex items-center justify-center group mb-2">
                    {previewUrl || thumbnailPath ? (
                      <Image
                        src={previewUrl || thumbnailPath}
                        alt="Preview thumbnail"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Upload className="w-6 h-6 text-[#7f7570]" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="text-[11px] text-[#4d4540] file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-[#352f2b] file:text-[#FCF0DA] hover:file:bg-[#4c4541] cursor-pointer"
                  />
                  <p className="text-[10px] text-[#7f7570] mt-1">
                    Maks. 5MB (JPG, PNG, WEBP). Tersimpan di folder <code>public/uploads/</code>.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#d0c4be]/20">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#352f2b] text-[#FCF0DA] text-xs font-bold hover:bg-[#4c4541] transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editId ? "Simpan Perubahan" : "Terbitkan Artikel"}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl border border-[#d0c4be] text-xs font-bold text-[#7f7570] hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* News List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 p-12 text-center flex flex-col items-center justify-center gap-2 text-[#7f7570]">
            <Loader2 className="w-6 h-6 animate-spin text-[#626034]" />
            <span className="text-xs">Memuat daftar artikel...</span>
          </div>
        ) : news.length === 0 ? (
          <div className="col-span-3 p-12 text-center text-[#7f7570] bg-white rounded-2xl border border-[#d0c4be]/40">
            <Newspaper className="w-10 h-10 mx-auto text-[#d0c4be] mb-2" />
            <p className="text-sm font-semibold text-[#352f2b]">Belum ada artikel yang dibuat.</p>
            <p className="text-xs mt-1">Klik tombol &quot;Buat Artikel Baru&quot; di atas untuk mulai menulis.</p>
          </div>
        ) : (
          news.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#d0c4be]/40 shadow-xs overflow-hidden flex flex-col justify-between group hover:-translate-y-0.5 transition-all"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#2F2B28]">
                  <Image
                    src={item.thumbnail_path || "/images/coffee-beans.png"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs ${
                      item.status === "published"
                        ? "bg-[#626034] text-white"
                        : "bg-[#7f7570] text-white"
                    }`}
                  >
                    {item.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Content info */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#7f7570] mb-1.5">
                    <Calendar className="w-3 h-3 text-[#AEAC78]" />
                    <span>
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#352f2b] line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#4d4540] mt-2 line-clamp-3 leading-relaxed">
                    {item.excerpt || item.content}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-5 py-3 border-t border-[#d0c4be]/20 bg-[#fff8f1]/30 flex items-center justify-between text-xs">
                <button
                  onClick={() => setPreviewArticle(item)}
                  className="inline-flex items-center gap-1 font-semibold text-[#626034] hover:text-[#352f2b]"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Pratinjau</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    title="Sunting Artikel"
                    className="p-1.5 rounded-lg border border-[#d0c4be]/40 text-[#352f2b] hover:bg-white transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    title="Hapus Artikel"
                    className="p-1.5 rounded-lg border border-[#ba1a1a]/30 text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Live Preview Modal */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#d0c4be]/30 pb-3">
              <span className="text-xs font-bold text-[#AEAC78] uppercase">
                Pratinjau Artikel
              </span>
              <button
                onClick={() => setPreviewArticle(null)}
                className="text-[#7f7570] hover:text-[#352f2b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={previewArticle.thumbnail_path}
                alt={previewArticle.title}
                fill
                className="object-cover"
              />
            </div>

            <h2 className="text-xl font-bold text-[#352f2b]">{previewArticle.title}</h2>
            <div className="text-xs text-[#7f7570]">
              Status: <strong>{previewArticle.status}</strong> • Diperbarui:{" "}
              {new Date(previewArticle.updated_at).toLocaleDateString("id-ID")}
            </div>
            <p className="text-xs sm:text-sm text-[#4d4540] leading-relaxed whitespace-pre-line">
              {previewArticle.content}
            </p>

            <div className="pt-3 border-t border-[#d0c4be]/20 text-right">
              <button
                onClick={() => setPreviewArticle(null)}
                className="px-4 py-2 rounded-xl bg-[#352f2b] text-[#FCF0DA] text-xs font-bold"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
