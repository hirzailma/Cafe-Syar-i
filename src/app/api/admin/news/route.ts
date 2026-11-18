import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, News } from "@/lib/db";
import { saveFile, deleteFile } from "@/lib/storage";

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

  const newsList = await db.find<News>("News");
  // Urutkan dari yang terbaru
  newsList.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return NextResponse.json({ success: true, news: newsList });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak: Khusus Admin." }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const status = (formData.get("status") as "draft" | "published") || "published";
    const thumbnailFile = formData.get("thumbnail") as File | null;
    let thumbnailPath = (formData.get("thumbnail_path") as string) || "/images/coffee-beans.png";

    if (!title || !content) {
      return NextResponse.json(
        { error: "Judul dan konten berita wajib diisi." },
        { status: 400 }
      );
    }

    // Jika ada file upload baru
    if (thumbnailFile && typeof thumbnailFile === "object" && thumbnailFile.size > 0) {
      const uploadRes = await saveFile(thumbnailFile);
      if (!uploadRes.success) {
        return NextResponse.json({ error: uploadRes.error }, { status: 400 });
      }
      thumbnailPath = uploadRes.filePath!;
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);

    const newArticle = await db.create<News>("News", {
      title: title.trim(),
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      excerpt: excerpt ? excerpt.trim() : title.trim().slice(0, 120),
      content: content.trim(),
      thumbnail_path: thumbnailPath,
      status,
      author_id: admin.user.id,
    });

    return NextResponse.json({ success: true, news: newArticle });
  } catch (error) {
    console.error("Create news error:", error);
    return NextResponse.json({ error: "Gagal membuat berita baru." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Akses ditolak: Khusus Admin." }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const status = (formData.get("status") as "draft" | "published") || "published";
    const thumbnailFile = formData.get("thumbnail") as File | null;
    let thumbnailPath = formData.get("thumbnail_path") as string | null;

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: "ID, judul, dan konten wajib diisi." },
        { status: 400 }
      );
    }

    const existing = await db.findById<News>("News", id);
    if (!existing) {
      return NextResponse.json({ error: "Berita tidak ditemukan." }, { status: 404 });
    }

    const updatePayload: Partial<News> = {
      title: title.trim(),
      excerpt: excerpt ? excerpt.trim() : existing.excerpt,
      content: content.trim(),
      status,
    };

    if (thumbnailFile && typeof thumbnailFile === "object" && thumbnailFile.size > 0) {
      const uploadRes = await saveFile(thumbnailFile);
      if (!uploadRes.success) {
        return NextResponse.json({ error: uploadRes.error }, { status: 400 });
      }
      updatePayload.thumbnail_path = uploadRes.filePath!;
      // Hapus thumbnail lama jika berupa upload lokal
      if (existing.thumbnail_path && existing.thumbnail_path.startsWith("/uploads/")) {
        await deleteFile(existing.thumbnail_path);
      }
    } else if (thumbnailPath) {
      updatePayload.thumbnail_path = thumbnailPath;
    }

    const updated = await db.update<News>("News", id, updatePayload);
    return NextResponse.json({ success: true, news: updated });
  } catch (error) {
    console.error("Update news error:", error);
    return NextResponse.json({ error: "Gagal memperbarui berita." }, { status: 500 });
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
      return NextResponse.json({ error: "ID berita wajib disertakan." }, { status: 400 });
    }

    const existing = await db.findById<News>("News", id);
    if (existing && existing.thumbnail_path && existing.thumbnail_path.startsWith("/uploads/")) {
      await deleteFile(existing.thumbnail_path);
    }

    await db.delete("News", id);
    return NextResponse.json({ success: true, message: "Berita berhasil dihapus." });
  } catch (error) {
    console.error("Delete news error:", error);
    return NextResponse.json({ error: "Gagal menghapus berita." }, { status: 500 });
  }
}
