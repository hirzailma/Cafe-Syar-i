import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, Role } from "@/lib/db";

async function requireAdmin() {
  const current = await getCurrentUser();
  if (!current || current.role.name !== "admin") return null;
  return current;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak: Khusus Admin." }, { status: 403 });
  }

  const roles = await db.find<Role>("Roles");
  return NextResponse.json({ success: true, roles });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak: Khusus Admin." }, { status: 403 });
  }

  try {
    const { name, description, permissions } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Nama role wajib diisi." }, { status: 400 });
    }

    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");

    const existing = await db.findOne<Role>("Roles", { name: cleanName });
    if (existing) {
      return NextResponse.json({ error: "Nama role sudah ada." }, { status: 409 });
    }

    const newRole = await db.create<Role>("Roles", {
      name: cleanName,
      description: description || "",
      permissions: typeof permissions === "string" ? permissions : JSON.stringify(permissions || []),
      is_system: "false",
    });

    return NextResponse.json({ success: true, role: newRole });
  } catch (error) {
    console.error("Create role error:", error);
    return NextResponse.json({ error: "Gagal membuat role." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak: Khusus Admin." }, { status: 403 });
  }

  try {
    const { id, description, permissions } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID role wajib disertakan." }, { status: 400 });
    }

    const target = await db.findById<Role>("Roles", id);
    if (!target) {
      return NextResponse.json({ error: "Role tidak ditemukan." }, { status: 404 });
    }

    const updateData: Partial<Role> = {};
    if (description !== undefined) updateData.description = description;
    if (permissions !== undefined) {
      updateData.permissions = typeof permissions === "string" ? permissions : JSON.stringify(permissions);
    }

    const updated = await db.update<Role>("Roles", id, updateData);
    return NextResponse.json({ success: true, role: updated });
  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json({ error: "Gagal memperbarui role." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak: Khusus Admin." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID role wajib disertakan." }, { status: 400 });
    }

    const target = await db.findById<Role>("Roles", id);
    if (!target) {
      return NextResponse.json({ error: "Role tidak ditemukan." }, { status: 404 });
    }

    // Role sistem tidak boleh dihapus
    if (String(target.is_system) === "true") {
      return NextResponse.json(
        { error: "Role bawaan sistem tidak boleh dihapus." },
        { status: 400 }
      );
    }

    await db.delete("Roles", id);
    return NextResponse.json({ success: true, message: "Role berhasil dihapus." });
  } catch (error) {
    console.error("Delete role error:", error);
    return NextResponse.json({ error: "Gagal menghapus role." }, { status: 500 });
  }
}
