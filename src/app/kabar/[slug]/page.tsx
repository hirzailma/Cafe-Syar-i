import Image from "next/image";
import Link from "next/link";
import { db, News } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic"; // ensure fresh fetch on each request

export default async function ArticleDetail({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  let article: News | null = null;

  try {
    // Try to find by slug (or id if slug not stored)
    const list = await db.find<News>("News", { slug });
    if (list && list.length > 0) {
      article = list[0];
    }
  } catch (e) {
    console.error("Error fetching article by slug:", e);
  }

  // Fallback: try to fetch by id if slug field not present
  if (!article) {
    try {
      const list = await db.find<News>("News", { id: slug });
      if (list && list.length > 0) article = list[0];
    } catch (e) {
      console.error(e);
    }
  }

  // ---- NEW FALLBACK LOGIC ----
  // If still not found, look into static fallback articles defined in siteConfig.
  // Support matching by numeric id, string id, or slug.
  if (!article) {
    const slugStr = String(slug);
    const fallback = siteConfig.articles.find(
      (a) =>
        a.id === slugStr ||
        a.slug === slugStr ||
        a.id === Number(slugStr).toString()
    );
    if (fallback) {
      article = {
        id: fallback.id,
        title: fallback.title,
        content: fallback.excerpt,
        thumbnail_path: fallback.thumbnail,
        created_at: fallback.date
          ? new Date(fallback.date).toISOString()
          : new Date().toISOString(),
      } as any;
    }
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F1] text-[#352f2b] p-4">
        <h2 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h2>
        <Link
          href="/"
          className="px-4 py-2 bg-[#AEAC78] text-white rounded hover:bg-[#626034]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const date = new Date(article.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <section className="min-h-screen bg-[#FFF8F1] text-[#352f2b] py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#AEAC78] hover:text-[#626034]"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        {/* Split header: image + meta/title */}
        <div className="flex flex-col md:flex-row md:gap-8 items-start">
          {article.thumbnail_path && (
            <Image
              src={article.thumbnail_path}
              alt={article.title}
              width={600}
              height={400}
              className="w-full md:w-1/2 h-auto rounded-lg object-cover mb-4 md:mb-0"
            />
          )}

          <div className="flex-1">
            <div className="flex items-center gap-4 text-sm text-[#7f7570] mb-2">
              <span>{date}</span>
              <span>•</span>
              <span>{"3 menit baca"}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#352f2b] mb-4">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Optional excerpt as a highlighted quote */}
        {article.excerpt && (
          <blockquote className="border-l-4 border-[#AEAC78] pl-4 italic text-[#352f2b] bg-[#FFF8F1]">
            {article.excerpt}
          </blockquote>
        )}

        {/* Content */}
        <article
          className="prose prose-sm md:prose lg:prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </section>
  );
}