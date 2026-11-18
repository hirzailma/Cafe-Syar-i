import fs from "fs/promises";
import path from "path";
import os from "os";
import { DEFAULT_MENU } from "./menu-data";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: string | boolean;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "draft" | "published";
  author_id: string;
  created_at: string;
  updated_at: string;
}

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const APPS_SCRIPT_SECRET = process.env.APPS_SCRIPT_SECRET;

// Di lingkungan serverless seperti Vercel, direktori process.cwd() bersifat READ-ONLY.
// Gunakan os.tmpdir() saat production agar penulisan file tidak error.
const DB_DIR =
  process.env.NODE_ENV === "production"
    ? os.tmpdir()
    : path.join(process.cwd(), "data");
const LOCAL_DB_PATH = path.join(DB_DIR, "local_db.json");

// In-memory data store sebagai cadangan tercepat dan aman di serverless
let memoryData: any = null;

// Data bawaan untuk inisiasi fallback
const DEFAULT_ROLES: Role[] = [
  {
    id: "role_admin_system",
    name: "admin",
    description: "Administrator dengan akses penuh ke sistem dan dashboard",
    permissions: JSON.stringify(["all"]),
    is_system: "true",
    created_at: new Date().toISOString(),
  },
  {
    id: "role_user_system",
    name: "user",
    description: "Pengguna terdaftar dengan hak akses reguler",
    permissions: JSON.stringify(["read", "order"]),
    is_system: "true",
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_USERS: User[] = [
  {
    id: "usr_admin_default",
    name: "Super Admin Cafe Syari",
    email: "admin@gmail.com",
    // Bcrypt hash dari '123456'
    password_hash: "$2b$10$xtMPgNwzmDst8ugBkyBuhulYZj1F5SnjLeLotaovkJG3zZQypGHqW",
    role_id: "role_admin_system",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_NEWS: News[] = [
  {
    id: "news_1",
    title: "Mengenal Karakter Single Origin Gayo: Washed vs Natural",
    slug: "mengenal-karakter-single-origin-gayo-washed-vs-natural",
    excerpt:
      "Pelajari perbedaan cita rasa keasaman lembut dan sweetness legit pada proses pasca panen kopi nusantara.",
    content:
      "Proses pasca panen memainkan peran krusial dalam membentuk profil rasa kopi Aceh Gayo. Proses Washed menghasilkan cangkir yang bersih dengan keasaman cerah dan aroma floral. Sedangkan proses Natural memberikan rasa manis pekat seperti buah matang (fruity notes) dan body yang tebal. Di Cafe Syar'i Kediri, kami mengkurasi kedua varian ini dengan standar kebersihan thayyib.",
    thumbnail_path: "/images/coffee-beans.png",
    status: "published",
    author_id: "usr_admin_default",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "news_2",
    title: "Keseruan Workshop Manual Brew Komunitas Akhir Pekan",
    slug: "keseruan-workshop-manual-brew-komunitas-banjaran",
    excerpt:
      "Dokumentasi sesi berbagi teknik seduh pour-over bersama barista dan penikmat kopi di kawasan Banjaran Kediri.",
    content:
      "Akhir pekan lalu, puluhan rekan komunitas berkumpul di Cafe Syar'i Banjaran untuk mendalami rasio seduhan, temperatur air, dan ukuran gilingan biji kopi lokal. Suasana hangat dan ramah keluarga membuat para peserta betah berdiskusi santai sembari menikmati seduhan kopi halal.",
    thumbnail_path: "/images/about-barista.png",
    status: "published",
    author_id: "usr_admin_default",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "news_3",
    title: "Konsep Kafe Ramah Keluarga & Ruang Edukasi yang Berkah",
    slug: "konsep-kafe-syari-ramah-keluarga-dan-kajian-ringan",
    excerpt:
      "Bagaimana Cafe Syar'i merancang ruang santun bebas asap rokok yang nyaman untuk keluarga dan anak muda berkarya.",
    content:
      "Menghadirkan kenyamanan bagi seluruh anggota keluarga adalah misi utama kami. Dengan area indoor non-smoking ber-AC, musholla yang bersih, serta spot baca buku, Cafe Syar'i menjadi tempat ideal untuk silaturahmi, belajar kelompok, maupun kajian ringan tanpa hingar-bingar kebisingan.",
    thumbnail_path: "/images/hero-cafe.png",
    status: "published",
    author_id: "usr_admin_default",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

async function getLocalData(): Promise<any> {
  if (memoryData) return memoryData;

  try {
    const raw = await fs.readFile(LOCAL_DB_PATH, "utf-8");
    memoryData = JSON.parse(raw);
    return memoryData;
  } catch {
    const initial = {
      Roles: DEFAULT_ROLES,
      Users: DEFAULT_USERS,
      News: DEFAULT_NEWS,
      Menu: DEFAULT_MENU,
      Orders: [],
    };
    memoryData = initial;
    try {
      await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
      await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
    } catch {
      // Abaikan jika fs read-only di serverless, data tetap aman di memoryData
    }
    return initial;
  }
}

async function saveLocalData(data: any) {
  memoryData = data;
  try {
    await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
    await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Abaikan kegagalan penulisan disk di serverless
  }
}

/**
 * Operasi Database Terpadu (Google Apps Script / Local Fallback)
 */
export const db = {
  async find<T>(table: string, query?: Record<string, any>): Promise<T[]> {
    if (APPS_SCRIPT_URL) {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "find",
            table,
            query,
            secret: APPS_SCRIPT_SECRET,
          }),
        });
        const json = await res.json();
        if (json.success) return json.data || [];
      } catch (err) {
        console.error("Gagal menghubungi Google Apps Script, beralih ke cache/fallback:", err);
      }
    }

    // Local Fallback
    const local = await getLocalData();
    const rows = (local as any)[table] || [];
    if (!query || Object.keys(query).length === 0) return rows;

    return rows.filter((row: any) => {
      for (const key of Object.keys(query)) {
        if (String(row[key]) !== String(query[key])) return false;
      }
      return true;
    });
  },

  async findOne<T>(table: string, query: Record<string, any>): Promise<T | null> {
    const items = await this.find<T>(table, query);
    return items.length > 0 ? items[0] : null;
  },

  async findById<T>(table: string, id: string): Promise<T | null> {
    if (APPS_SCRIPT_URL) {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "findById",
            table,
            id,
            secret: APPS_SCRIPT_SECRET,
          }),
        });
        const json = await res.json();
        if (json.success) return json.data;
      } catch (err) {
        console.error("Gagal menghubungi Google Apps Script:", err);
      }
    }

    const items = await this.find<T>(table);
    const found = items.find((item: any) => item.id === id);
    return found || null;
  },

  async create<T>(table: string, data: any): Promise<T> {
    const id = data.id || `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const record = { ...data, id, created_at: now, updated_at: now };

    if (APPS_SCRIPT_URL) {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
            table,
            data: record,
            secret: APPS_SCRIPT_SECRET,
          }),
        });
        const json = await res.json();
        if (json.success) return json.data;
      } catch (err) {
        console.error("Gagal menulis ke Google Apps Script:", err);
      }
    }

    const local = await getLocalData();
    if (!(local as any)[table]) (local as any)[table] = [];
    (local as any)[table].push(record);
    await saveLocalData(local);
    return record as T;
  },

  async update<T>(table: string, id: string, data: any): Promise<T | null> {
    const now = new Date().toISOString();
    const patch = { ...data, updated_at: now };

    if (APPS_SCRIPT_URL) {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            table,
            id,
            data: patch,
            secret: APPS_SCRIPT_SECRET,
          }),
        });
        const json = await res.json();
        if (json.success) return json.data;
      } catch (err) {
        console.error("Gagal update ke Google Apps Script:", err);
      }
    }

    const local = await getLocalData();
    const rows = (local as any)[table] || [];
    const index = rows.findIndex((r: any) => r.id === id);
    if (index === -1) return null;

    rows[index] = { ...rows[index], ...patch };
    await saveLocalData(local);
    return rows[index] as T;
  },

  async delete(table: string, id: string): Promise<boolean> {
    if (APPS_SCRIPT_URL) {
      try {
        const res = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "delete",
            table,
            id,
            secret: APPS_SCRIPT_SECRET,
          }),
        });
        const json = await res.json();
        if (json.success) return true;
      } catch (err) {
        console.error("Gagal delete ke Google Apps Script:", err);
      }
    }

    const local = await getLocalData();
    const rows = (local as any)[table] || [];
    const filtered = rows.filter((r: any) => r.id !== id);
    if (filtered.length === rows.length) return false;

    (local as any)[table] = filtered;
    await saveLocalData(local);
    return true;
  },
};
