import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Order } from "@/types/order";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_phone,
      customer_email,
      table_slot_id,
      table_slot_label,
      visit_date,
      visit_time,
      items,
      total_amount,
      payment_method,
      notes,
    } = body;

    if (!customer_name || !customer_phone || !visit_date || !visit_time || !items?.length) {
      return NextResponse.json({ error: "Data pesanan tidak lengkap" }, { status: 400 });
    }

    const order = await db.create<Order>("Orders", {
      customer_name,
      customer_phone,
      customer_email: customer_email || "",
      table_slot_id: table_slot_id || "",
      table_slot_label: table_slot_label || "Tanpa reservasi meja",
      order_date: new Date().toISOString(),
      visit_date,
      visit_time,
      items,
      total_amount: Number(total_amount),
      payment_method: payment_method || "qris",
      status: "pending",
      notes: notes || "",
    });

    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json({ error: "Gagal menyimpan pesanan" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Gunakan ID pesanan untuk tracking." });
}
