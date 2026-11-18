import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, getCurrentUser } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Berhasil keluar." });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}

export async function GET() {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: current.user.id,
      name: current.user.name,
      email: current.user.email,
      role: current.role.name,
      roleId: current.role.id,
    },
  });
}
