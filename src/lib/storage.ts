import fs from "fs/promises";
import path from "path";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface SaveFileResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

/**
 * Menyimpan file yang diupload ke direktori lokal public/uploads/
 * Catatan: Di Vercel production, storage ini bersifat ephemeral.
 * Modul ini dapat dialihkan ke Vercel Blob / Cloudinary di Step 4.
 */
export async function saveFile(file: File): Promise<SaveFileResult> {
  try {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Format file tidak didukung. Harap gunakan format JPG, PNG, atau WEBP.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Ukuran file terlalu besar. Maksimum ukuran adalah 5MB.",
      };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Buat nama file yang aman dan unik
    const ext = path.extname(file.name) || ".jpg";
    const cleanBase = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const uniqueName = `${Date.now()}-${cleanBase}${ext}`;
    const fullPath = path.join(uploadsDir, uniqueName);

    await fs.writeFile(fullPath, buffer);

    return {
      success: true,
      filePath: `/uploads/${uniqueName}`,
    };
  } catch (error) {
    console.error("Gagal menyimpan file:", error);
    return {
      success: false,
      error: "Gagal menyimpan file media ke server.",
    };
  }
}

/**
 * Menghapus file lokal dari public/uploads/
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    if (!filePath.startsWith("/uploads/")) return false;
    const fileName = path.basename(filePath);
    const targetPath = path.join(process.cwd(), "public", "uploads", fileName);
    await fs.unlink(targetPath);
    return true;
  } catch {
    return false;
  }
}
