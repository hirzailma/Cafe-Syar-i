"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { MenuItem, OrderItem } from "@/types/order";
import { TABLE_SLOTS } from "@/lib/menu-data";

function formatRp(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function PesanPage() {
  const [step, setStep] = useState(1);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    table_slot_id: "",
    table_slot_label: "",
    visit_date: "",
    visit_time: "",
    payment_method: "qris" as "qris" | "cash",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("semua");

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((d) => {
        setMenuItems(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["semua", "minuman", "makanan", "paket"];

  const filteredMenu =
    activeCategory === "semua"
      ? menuItems
      : menuItems.filter((m) => m.category === activeCategory);

  const addToCart = (id: string) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const removeFromCart = (id: string) =>
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });

  const cartItems: OrderItem[] = Object.entries(cart)
    .map(([menuId, qty]) => {
      const m = menuItems.find((x) => x.id === menuId);
      if (!m) return null;
      return {
        menu_id: m.id,
        menu_name: m.name,
        quantity: qty,
        unit_price: m.price,
        subtotal: m.price * qty,
      };
    })
    .filter(Boolean) as OrderItem[];

  const totalAmount = cartItems.reduce((s, i) => s + i.subtotal, 0);
  const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "table_slot_id") {
      const slot = TABLE_SLOTS.find((t) => t.id === value);
      setForm((prev) => ({
        ...prev,
        table_slot_id: value,
        table_slot_label: slot?.label || "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const buildWAMessage = () => {
    const lines = [
      `Assalamualaikum Cafe Syar'i 🌙`,
      ``,
      `📋 *Pesanan Baru*`,
      `Nama: ${form.customer_name}`,
      `No. HP: ${form.customer_phone}`,
      `Tanggal: ${form.visit_date} pukul ${form.visit_time} WIB`,
      `Meja: ${form.table_slot_label || "Tanpa reservasi meja"}`,
      ``,
      `🛒 *Detail Pesanan:*`,
      ...cartItems.map(
        (i) => `- ${i.menu_name} x${i.quantity} = ${formatRp(i.subtotal)}`
      ),
      ``,
      `💰 *Total: ${formatRp(totalAmount)}*`,
      `Pembayaran: ${form.payment_method === "qris" ? "QRIS" : "Cash di Kasir"}`,
      form.notes ? `\nCatatan: ${form.notes}` : ``,
      ``,
      `No. Pesanan: ${orderId}`,
      ``,
      `Mohon konfirmasinya. Jazakumullah khairan 🙏`,
    ];
    return encodeURIComponent(lines.join("\n"));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: cartItems,
          total_amount: totalAmount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderId(data.data.id);
        setSubmitted(true);
      }
    } catch {}
    setSubmitting(false);
  };

  const handleSendWA = () => {
    const phone = "6281992373219";
    window.open(`https://wa.me/${phone}?text=${buildWAMessage()}`, "_blank");
  };

  // --- SUKSES ---
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fff8f1] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-lg p-10 border border-[#AEAC78]/20">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#352f2b] mb-2">
            Pesanan Diterima!
          </h1>
          <p className="text-[#4d4540] mb-1 text-sm">No. Pesanan:</p>
          <p className="font-mono text-[#626034] font-bold text-sm mb-6 bg-[#FCF0DA] px-4 py-2 rounded-xl inline-block">
            {orderId}
          </p>
          <p className="text-[#4d4540] text-sm mb-8">
            Silakan kirim konfirmasi pesanan ke WhatsApp kami agar tim Cafe
            Syar&apos;i dapat segera mempersiapkan pesananmu.
          </p>
          <button
            onClick={handleSendWA}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-colors mb-3"
          >
            <MessageCircle className="w-5 h-5" />
            Kirim ke WhatsApp
          </button>
          <Link
            href="/"
            className="block text-center text-sm text-[#626034] hover:underline mt-2"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f1]">
      {/* Header */}
      <div className="bg-[#352f2b] text-[#FCF0DA] px-6 py-5 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm hover:text-[#AEAC78] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <h1 className="font-bold text-lg tracking-tight">Pesan Sekarang</h1>
          {step === 1 ? (
            <div className="flex items-center gap-1.5 bg-[#AEAC78]/20 px-3 py-1.5 rounded-full">
              <ShoppingCart className="w-4 h-4" />
              <span className="font-bold text-sm">{cartCount}</span>
            </div>
          ) : (
            <div className="w-16" />
          )}
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-[#352f2b]/5 border-b border-[#352f2b]/10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-3">
          {["Pilih Menu", "Detail Kunjungan", "Konfirmasi"].map((label, i) => {
            const s = i + 1;
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    step > s
                      ? "bg-[#626034] text-white"
                      : step === s
                      ? "bg-[#352f2b] text-[#FCF0DA]"
                      : "bg-[#AEAC78]/30 text-[#4d4540]"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    step === s
                      ? "text-[#352f2b] font-semibold"
                      : "text-[#4d4540]/60"
                  }`}
                >
                  {label}
                </span>
                {i < 2 && (
                  <div className="h-px w-6 sm:w-10 bg-[#AEAC78]/30 mx-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-32">
        {/* ===== STEP 1: Pilih Menu ===== */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-[#352f2b] mb-1">
              Pilih Menu
            </h2>
            <p className="text-sm text-[#4d4540] mb-5">
              Tambahkan item yang ingin kamu pesan.
            </p>

            {/* Category Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize shrink-0 transition-colors border ${
                    activeCategory === cat
                      ? "bg-[#352f2b] text-[#FCF0DA] border-[#352f2b]"
                      : "bg-white text-[#4d4540] border-[#AEAC78]/40 hover:border-[#352f2b]/40"
                  }`}
                >
                  {cat === "semua"
                    ? "Semua"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-16 text-[#4d4540]">
                Memuat menu...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {filteredMenu.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border p-4 flex gap-4 transition-all ${
                      !item.is_available
                        ? "opacity-50 pointer-events-none border-[#AEAC78]/10"
                        : "border-[#AEAC78]/20 hover:border-[#AEAC78]/60 hover:shadow-sm"
                    }`}
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#FCF0DA]">
                      <Image
                        src={item.image_path}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#352f2b] text-sm leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#4d4540]/70 mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="font-bold text-[#626034] mt-1.5 text-sm">
                        {formatRp(item.price)}
                      </p>
                      {cart[item.id] ? (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-7 h-7 rounded-full bg-[#352f2b] text-white flex items-center justify-center hover:bg-[#626034] transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-[#352f2b] text-sm w-5 text-center">
                            {cart[item.id]}
                          </span>
                          <button
                            onClick={() => addToCart(item.id)}
                            className="w-7 h-7 rounded-full bg-[#352f2b] text-white flex items-center justify-center hover:bg-[#626034] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item.id)}
                          className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FCF0DA] text-[#352f2b] text-xs font-semibold hover:bg-[#AEAC78]/20 transition-colors border border-[#AEAC78]/30"
                        >
                          <Plus className="w-3.5 h-3.5" /> Tambah
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cart Bar */}
            {cartCount > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-[#352f2b] text-[#FCF0DA] p-4 shadow-2xl z-20">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#AEAC78]">
                      {cartCount} item dipilih
                    </p>
                    <p className="font-bold text-lg">{formatRp(totalAmount)}</p>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 bg-[#AEAC78] hover:bg-[#626034] text-white font-bold px-6 py-3 rounded-2xl transition-colors"
                  >
                    Lanjut <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== STEP 2: Detail Kunjungan ===== */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-[#352f2b] mb-1">
              Detail Kunjungan
            </h2>
            <p className="text-sm text-[#4d4540] mb-6">
              Isi data dirimu dan kapan akan datang.
            </p>
            <div className="bg-white rounded-2xl border border-[#AEAC78]/20 p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#352f2b] mb-1.5 uppercase tracking-wide">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEAC78]" />
                  <input
                    name="customer_name"
                    value={form.customer_name}
                    onChange={handleFormChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#AEAC78]/30 focus:border-[#352f2b] focus:outline-none text-[#352f2b] text-sm"
                    placeholder="Nama kamu"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#352f2b] mb-1.5 uppercase tracking-wide">
                  Nomor WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEAC78]" />
                  <input
                    name="customer_phone"
                    value={form.customer_phone}
                    onChange={handleFormChange}
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#AEAC78]/30 focus:border-[#352f2b] focus:outline-none text-[#352f2b] text-sm"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#352f2b] mb-1.5 uppercase tracking-wide">
                    Tanggal Kunjungan *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEAC78]" />
                    <input
                      name="visit_date"
                      value={form.visit_date}
                      onChange={handleFormChange}
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-[#AEAC78]/30 focus:border-[#352f2b] focus:outline-none text-[#352f2b] text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#352f2b] mb-1.5 uppercase tracking-wide">
                    Jam Kedatangan *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEAC78]" />
                    <input
                      name="visit_time"
                      value={form.visit_time}
                      onChange={handleFormChange}
                      type="time"
                      min="07:30"
                      max="21:30"
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-[#AEAC78]/30 focus:border-[#352f2b] focus:outline-none text-[#352f2b] text-sm"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#352f2b] mb-1.5 uppercase tracking-wide">
                  Pilih Meja (Opsional)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEAC78]" />
                  <select
                    name="table_slot_id"
                    value={form.table_slot_id}
                    onChange={handleFormChange}
                    className="w-full pl-10 pr-8 py-3 rounded-xl border border-[#AEAC78]/30 focus:border-[#352f2b] focus:outline-none text-[#352f2b] text-sm appearance-none bg-white"
                  >
                    <option value="">Tanpa reservasi meja</option>
                    {TABLE_SLOTS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label} (maks. {t.capacity} orang)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEAC78] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#352f2b] mb-1.5 uppercase tracking-wide">
                  Metode Pembayaran *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["qris", "cash"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() =>
                        setForm((p) => ({ ...p, payment_method: method }))
                      }
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                        form.payment_method === method
                          ? "border-[#352f2b] bg-[#352f2b] text-[#FCF0DA]"
                          : "border-[#AEAC78]/30 text-[#4d4540] hover:border-[#352f2b]/40"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      {method === "qris" ? "QRIS" : "Bayar di Kasir"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#352f2b] mb-1.5 uppercase tracking-wide">
                  Catatan (Opsional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[#AEAC78]/30 focus:border-[#352f2b] focus:outline-none text-[#352f2b] text-sm resize-none"
                  placeholder="Alergi, permintaan khusus, dll."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#352f2b] text-[#352f2b] font-semibold text-sm hover:bg-[#352f2b]/5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>
              <button
                onClick={() => {
                  if (
                    !form.customer_name ||
                    !form.customer_phone ||
                    !form.visit_date ||
                    !form.visit_time
                  ) {
                    alert(
                      "Harap isi nama, nomor HP, tanggal, dan jam kunjungan."
                    );
                    return;
                  }
                  setStep(3);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#352f2b] text-[#FCF0DA] font-bold py-3 rounded-2xl hover:bg-[#4c4541] transition-colors"
              >
                Konfirmasi Pesanan <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 3: Konfirmasi & Bayar ===== */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-[#352f2b] mb-1">
              Konfirmasi Pesanan
            </h2>
            <p className="text-sm text-[#4d4540] mb-6">
              Periksa kembali pesananmu sebelum dikonfirmasi.
            </p>

            <div className="space-y-4">
              {/* Item summary */}
              <div className="bg-white rounded-2xl border border-[#AEAC78]/20 p-5">
                <h3 className="font-semibold text-[#352f2b] mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#AEAC78]" /> Item
                  Pesanan
                </h3>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div
                      key={item.menu_id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-[#4d4540]">
                        {item.menu_name}{" "}
                        <span className="text-[#AEAC78] font-semibold">
                          x{item.quantity}
                        </span>
                      </span>
                      <span className="font-semibold text-[#352f2b]">
                        {formatRp(item.subtotal)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-[#AEAC78]/20 pt-2 flex justify-between font-bold text-[#352f2b]">
                    <span>Total</span>
                    <span className="text-[#626034]">
                      {formatRp(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info kunjungan */}
              <div className="bg-white rounded-2xl border border-[#AEAC78]/20 p-5">
                <h3 className="font-semibold text-[#352f2b] mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#AEAC78]" /> Info Kunjungan
                </h3>
                <div className="space-y-1.5 text-sm text-[#4d4540]">
                  <div className="flex justify-between">
                    <span>Nama</span>
                    <span className="font-medium text-[#352f2b]">
                      {form.customer_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>WhatsApp</span>
                    <span className="font-medium text-[#352f2b]">
                      {form.customer_phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal</span>
                    <span className="font-medium text-[#352f2b]">
                      {form.visit_date}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jam</span>
                    <span className="font-medium text-[#352f2b]">
                      {form.visit_time} WIB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meja</span>
                    <span className="font-medium text-[#352f2b]">
                      {form.table_slot_label || "Tanpa reservasi"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pembayaran</span>
                    <span className="font-medium text-[#352f2b]">
                      {form.payment_method === "qris" ? "QRIS" : "Cash di Kasir"}
                    </span>
                  </div>
                  {form.notes && (
                    <div className="flex justify-between">
                      <span>Catatan</span>
                      <span className="font-medium text-[#352f2b] text-right max-w-[55%]">
                        {form.notes}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* QRIS Placeholder */}
              {form.payment_method === "qris" && (
                <div className="bg-white rounded-2xl border border-[#AEAC78]/20 p-5 text-center">
                  <h3 className="font-semibold text-[#352f2b] mb-3">
                    Scan QRIS untuk Pembayaran
                  </h3>
                  <div className="w-48 h-48 mx-auto bg-[#FCF0DA] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-[#AEAC78]/40 mb-3">
                    <CreditCard className="w-12 h-12 text-[#AEAC78] mb-2" />
                    <p className="text-xs text-[#4d4540] font-medium">
                      QRIS Cafe Syar&apos;i
                    </p>
                    <p className="text-xs text-[#AEAC78] mt-1">
                      (Gambar akan ditambahkan)
                    </p>
                  </div>
                  <p className="text-xs text-[#4d4540]">
                    Bayar sesuai total, lalu konfirmasi ke WhatsApp kami.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#352f2b] text-[#352f2b] font-semibold text-sm hover:bg-[#352f2b]/5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-[#352f2b] text-[#FCF0DA] font-bold py-3 rounded-2xl hover:bg-[#4c4541] transition-colors disabled:opacity-60"
              >
                {submitting ? (
                  "Memproses..."
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> Konfirmasi & Lanjut ke
                    WhatsApp
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
