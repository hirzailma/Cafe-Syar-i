import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { MenuItem } from "@/types/order";
import { DEFAULT_MENU } from "@/lib/menu-data";

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
  const items = await db.find<MenuItem>("Menu");
  return NextResponse.json({ success: true, data: items.length > 0 ? items : DEFAULT_MENU });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { name, description, price, category, image_path, is_available } = body;
  if (!name || !price || !category) {
    return NextResponse.json({ error: "nama, harga, dan kategori wajib diisi" }, { status: 400 });
  }
  const item = await db.create<MenuItem>("Menu", {
    name,
    description: description || "",
    price: Number(price),
    category,
    image_path: image_path || "/images/coffee-beans.png",
    is_available: is_available !== false,
  });
  return NextResponse.json({ success: true, data: item });
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, ...patch } = body;
  if (!id) return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });
  const updated = await db.update<MenuItem>("Menu", id, patch);
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });
  await db.delete("Menu", id);
  return NextResponse.json({ success: true });
}
