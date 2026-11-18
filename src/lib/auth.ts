import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db, User, Role } from "./db";

export const SESSION_COOKIE_NAME = "cafesyari_session";
const SECRET_KEY = process.env.AUTH_SECRET || "cafe_syari_secret_jwt_key_secure_2026_kediri";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  roleId: string;
  exp?: number;
}

function base64UrlEncode(data: Uint8Array | ArrayBuffer): string {
  const bytes = new Uint8Array(data);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

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

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const enc = new TextEncoder();
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 hari
  const fullPayload = { ...payload, exp };

  const encodedHeader = base64UrlEncode(enc.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(enc.encode(JSON.stringify(fullPayload)));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(dataToSign));
  const encodedSignature = base64UrlEncode(signature);

  return `${dataToSign}.${encodedSignature}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const enc = new TextEncoder();
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;

    const key = await getHmacKey();
    const signatureBytes = base64UrlDecode(encodedSignature);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      enc.encode(dataToVerify)
    );

    if (!isValid) return null;

    const dec = new TextDecoder();
    const payloadStr = dec.decode(base64UrlDecode(encodedPayload));
    const payload: SessionPayload = JSON.parse(payloadStr);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return await bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plain, hash);
}

/**
 * Mengambil data sesi pengguna yang sedang login saat ini di server
 */
export async function getCurrentUser(): Promise<{ user: User; role: Role } | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.userId) return null;

    const user = await db.findById<User>("Users", payload.userId);
    if (!user || user.status !== "active") return null;

    const role = await db.findById<Role>("Roles", user.role_id);
    if (!role) return null;

    return { user, role };
  } catch {
    return null;
  }
}
