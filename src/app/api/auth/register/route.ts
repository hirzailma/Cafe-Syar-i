import { NextResponse } from "next/server";
import { db, User, Role } from "@/lib/db";
import { hashPassword, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi minimal 6 karakter." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Cek apakah email sudah terdaftar
    const existing = await db.findOne<User>("Users", { email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { error: "Alamat email ini sudah terdaftar. Silakan gunakan email lain atau masuk." },
        { status: 409 }
      );
    }

    // Cari role 'user'
    let userRole = await db.findOne<Role>("Roles", { name: "user" });
    if (!userRole) {
      userRole = await db.create<Role>("Roles", {
        name: "user",
        description: "Pengguna terdaftar",
        permissions: JSON.stringify(["read", "order"]),
        is_system: "true",
      });
    }

    // Hash kata sandi
    const password_hash = await hashPassword(password);

    // Buat pengguna baru
    const newUser = await db.create<User>("Users", {
      name: name.trim(),
      email: cleanEmail,
      password_hash,
      role_id: userRole.id,
      status: "active",
    });

    // Buat token sesi
    const token = await createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: "user",
      roleId: userRole.id,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: "user",
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat mendaftar akun." },
      { status: 500 }
    );
  }
}
