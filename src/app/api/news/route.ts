import { NextResponse } from "next/server";
import { db, News } from "@/lib/db";

export async function GET() {
  try {
    const list = await db.find<News>("News", { status: "published" });
    list.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return NextResponse.json({ success: true, news: list });
  } catch (error) {
    console.error("Fetch public news error:", error);
    return NextResponse.json({ error: "Gagal memuat berita." }, { status: 500 });
  }
}
