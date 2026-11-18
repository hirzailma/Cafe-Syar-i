import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "cafesyari_session";
const SECRET_KEY = process.env.AUTH_SECRET || "cafe_syari_secret_jwt_key_secure_2026_kediri";

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function verifyEdgeToken(token: string): Promise<any | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, sigB64] = parts;
    const enc = new TextEncoder();
    const dataToVerify = `${headerB64}.${payloadB64}`;

    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(SECRET_KEY),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = base64UrlDecode(sigB64);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      enc.encode(dataToVerify)
    );

    if (!valid) return null;

    const dec = new TextDecoder();
    const payload = JSON.parse(dec.decode(base64UrlDecode(payloadB64)));

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminApiRoute = pathname.startsWith("/api/admin");

  if (!isDashboardRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    if (isAdminApiRoute) {
      return NextResponse.json(
        { error: "Akses ditolak: Anda belum masuk." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyEdgeToken(token);

  if (!payload) {
    if (isAdminApiRoute) {
      return NextResponse.json(
        { error: "Sesi Anda telah berakhir. Silakan masuk kembali." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "Sesi login tidak sah atau telah berakhir.");
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  // Cek apakah role adalah admin
  if (payload.role !== "admin") {
    if (isAdminApiRoute) {
      return NextResponse.json(
        { error: "Akses ditolak: Anda tidak memiliki hak akses Administrator." },
        { status: 403 }
      );
    }
    const unauthorizedUrl = new URL("/login", req.url);
    unauthorizedUrl.searchParams.set(
      "error",
      "Akun Anda tidak memiliki hak akses administrator untuk membuka dashboard."
    );
    return NextResponse.redirect(unauthorizedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
