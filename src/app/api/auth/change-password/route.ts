import { NextResponse } from "next/server";
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth";
import { db, User } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "Sesi tidak sah. Harap login kembali." }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Kata sandi saat ini dan kata sandi baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi baru minimal 6 karakter." },
        { status: 400 }
      );
    }

    const isMatch = await verifyPassword(currentPassword, current.user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Kata sandi saat ini tidak cocok." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await db.update<User>("Users", current.user.id, {
      password_hash: newHash,
    });

    return NextResponse.json({
      success: true,
      message: "Kata sandi berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Gagal mengubah kata sandi." },
      { status: 500 }
    );
  }
}
