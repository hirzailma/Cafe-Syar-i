"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, RefreshCw } from "lucide-react";
import { Order } from "@/types/order";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "Menunggu",      color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Dikonfirmasi",  color: "bg-blue-100 text-blue-800"    },
  preparing: { label: "Diproses",      color: "bg-orange-100 text-orange-800" },
  ready:     { label: "Siap Diambil",  color: "bg-teal-100 text-teal-800"    },
  completed: { label: "Selesai",       color: "bg-green-100 text-green-800"  },
  cancelled: { label: "Dibatalkan",    color: "bg-red-100 text-red-800"      },
};

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data.data || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await fetchOrders();
    setUpdating(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#352f2b]">Riwayat Pesanan</h1>
          <p className="text-sm text-[#4d4540] mt-1">
            Kelola dan perbarui status pesanan pelanggan.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#AEAC78]/30 text-[#4d4540] text-sm font-semibold hover:bg-[#FCF0DA] transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-center py-16 text-[#4d4540]">Memuat pesanan...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#AEAC78]/20">
          <Package className="w-10 h-10 text-[#AEAC78] mx-auto mb-3" />
          <p className="text-[#4d4540] font-medium">Belum ada pesanan masuk.</p>
          <p className="text-sm text-[#4d4540]/60 mt-1">
            Pesanan dari halaman /pesan akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#AEAC78]/20 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold text-[#352f2b]">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-[#4d4540]">
                    {order.customer_phone} · Kunjungan: {order.visit_date}{" "}
                    {order.visit_time} WIB
                  </p>
                  <p className="text-xs text-[#4d4540] mt-0.5">
                    {order.table_slot_label || "Tanpa reservasi meja"} · Bayar:{" "}
                    {order.payment_method === "qris" ? "QRIS" : "Cash"}
                  </p>
                  <p className="text-xs text-[#4d4540]/50 mt-0.5">
                    Dipesan: {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      STATUS_LABELS[order.status]?.color ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {STATUS_LABELS[order.status]?.label || order.status}
                  </span>
                  <select
                    value={order.status}
                    disabled={updating === order.id}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-xs border border-[#AEAC78]/30 rounded-lg px-2 py-1.5 text-[#352f2b] bg-white focus:outline-none focus:border-[#352f2b]"
                  >
                    {Object.entries(STATUS_LABELS).map(([val, { label }]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-[#AEAC78]/10 pt-3 space-y-1">
                {(order.items || []).map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm text-[#4d4540]"
                  >
                    <span>
                      {item.menu_name}{" "}
                      <span className="text-[#AEAC78]">x{item.quantity}</span>
                    </span>
                    <span>{formatRp(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#AEAC78]/10 pt-2 mt-2 flex justify-between font-bold text-[#352f2b] text-sm">
                <span>Total</span>
                <span className="text-[#626034]">
                  {formatRp(order.total_amount)}
                </span>
              </div>
              {order.notes && (
                <p className="text-xs text-[#4d4540] mt-2 italic bg-[#FCF0DA]/60 px-3 py-1.5 rounded-lg">
                  📝 {order.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
