import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Order } from "@/types/order";

async function requireAdmin() {
  const current = await getCurrentUser();
  if (!current || current.role.name !== "admin") return null;
  return current;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await db.find<Order>("Orders");
  const sorted = [...orders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return NextResponse.json({ success: true, data: sorted });
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, status } = body;
  if (!id || !status)
    return NextResponse.json({ error: "id dan status wajib" }, { status: 400 });
  const updated = await db.update<Order>("Orders", id, { status });
  return NextResponse.json({ success: true, data: updated });
}
