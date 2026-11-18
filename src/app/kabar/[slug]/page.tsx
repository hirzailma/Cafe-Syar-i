import Image from "next/image";
import Link from "next/link";
import { db, News } from "@/lib/db";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic"; // ensure fresh fetch on each request

export default async function ArticleDetail({ params }: { params: { slug: string } }) {
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

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F1] p-4">
        <h2 className="text-2xl font-bold text-[#352f2b] mb-4">Artikel tidak ditemukan</h2>
        <Link href="/" className="px-4 py-2 bg-[#AEAC78] text-white rounded hover:bg-[#626034]">
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
    <section className="min-h-screen bg-[#FFF8F1] text-[#352f2b] py-8 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#AEAC78] hover:text-[#626034]">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        {/* Main image */}
        {article.thumbnail_path && (
          <Image
            src={article.thumbnail_path}
            alt={article.title}
            width={1200}
            height={600}
            className="w-full h-auto rounded-lg object-cover"
          />
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-[#7f7570]">
          <span>{date}</span>
          <span>•</span>
          <span>{"3 menit baca"}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#352f2b]">
          {article.title}
        </h1>

        {/* Content */}
        <article className="prose prose-sm md:prose lg:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </section>
  );
}
