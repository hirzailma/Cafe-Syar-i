import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, User, Role } from "@/lib/db";

async function requireAdmin() {
  const current = await getCurrentUser();
  if (!current || current.role.name !== "admin") {
    return null;
  }
  return current;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak: Khusus Admin." }, { status: 403 });
  }

  const [users, roles] = await Promise.all([
    db.find<User>("Users"),
    db.find<Role>("Roles"),
  ]);

  const roleMap = new Map(roles.map((r) => [r.id, r]));

  const sanitized = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role_id: u.role_id,
    role_name: roleMap.get(u.role_id)?.name || "user",
    status: u.status,
    created_at: u.created_at,
    updated_at: u.updated_at,
  }));

  return NextResponse.json({ success: true, users: sanitized, roles });
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak: Khusus Admin." }, { status: 403 });
  }

  try {
    const { id, role_id, status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID pengguna wajib disertakan." }, { status: 400 });
    }

    const targetUser = await db.findById<User>("Users", id);
    if (!targetUser) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    // Aturan wajib: Admin tidak bisa menonaktifkan dirinya sendiri
    if (id === admin.user.id && status === "inactive") {
      return NextResponse.json(
        { error: "Anda tidak dapat menonaktifkan akun admin Anda sendiri." },
        { status: 400 }
      );
    }

    // Cek admin terakhir sebelum menurunkan role
    if (role_id && role_id !== targetUser.role_id) {
      const adminRole = await db.findOne<Role>("Roles", { name: "admin" });
      if (adminRole && targetUser.role_id === adminRole.id) {
        const allUsers = await db.find<User>("Users");
        const activeAdmins = allUsers.filter(
          (u) => u.role_id === adminRole.id && u.status === "active"
        );
        if (activeAdmins.length <= 1) {
          return NextResponse.json(
            { error: "Tidak dapat mengubah role satu-satunya admin aktif sistem." },
            { status: 400 }
          );
        }
      }
    }

    const updateData: Partial<User> = {};
    if (role_id) updateData.role_id = role_id;
    if (status) updateData.status = status;

    const updated = await db.update<User>("Users", id, updateData);
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Gagal memperbarui pengguna." }, { status: 500 });
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
      return NextResponse.json({ error: "ID pengguna wajib disertakan." }, { status: 400 });
    }

    // Aturan wajib: Admin tidak bisa menghapus dirinya sendiri
    if (id === admin.user.id) {
      return NextResponse.json(
        { error: "Anda tidak dapat menghapus akun admin Anda sendiri." },
        { status: 400 }
      );
    }

    const targetUser = await db.findById<User>("Users", id);
    if (!targetUser) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const adminRole = await db.findOne<Role>("Roles", { name: "admin" });
    if (adminRole && targetUser.role_id === adminRole.id) {
      const allUsers = await db.find<User>("Users");
      const activeAdmins = allUsers.filter(
        (u) => u.role_id === adminRole.id && u.status === "active"
      );
      if (activeAdmins.length <= 1) {
        return NextResponse.json(
          { error: "Tidak dapat menghapus admin terakhir pada sistem." },
          { status: 400 }
        );
      }
    }

    await db.delete("Users", id);
    return NextResponse.json({ success: true, message: "Pengguna berhasil dihapus." });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Gagal menghapus pengguna." }, { status: 500 });
  }
}
