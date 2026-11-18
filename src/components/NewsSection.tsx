import Image from "next/image";
import Link from "next/link";
import { db, News } from "@/lib/db";
import { siteConfig } from "@/config/site";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";

export default async function NewsSection() {
  let articles: News[] = [];
  try {
    const list = await db.find<News>("News", { status: "published" });
    if (list && list.length > 0) {
      // Urutkan dari yang terbaru
      list.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      articles = list.slice(0, 3);
    }
  } catch (error) {
    console.error("Gagal memuat berita dari database:", error);
  }

  // Jika belum ada data dari database, gunakan data terpusat
  const displayArticles =
    articles.length > 0
      ? articles.map((a) => ({
          id: a.id,
          title: a.title,
          excerpt: a.excerpt || a.content.slice(0, 110) + "...",
          category: "Warta Kopi",
          date: new Date(a.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          thumbnail: a.thumbnail_path || "/images/coffee-beans.png",
          readTime: "3 menit baca",
        }))
      : siteConfig.articles;

  return (
    <section className="py-16 md:py-24 bg-[#f3e7d1]/50 border-t border-[#352f2b]/5" id="kabar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f9edd7] border border-[#d0c4be]/40 text-[11px] font-bold text-[#626034] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#AEAC78]" />
              <span>CATATAN &amp; CERITA TERBARU</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#352f2b] tracking-tight">
              Kabar Kopi &amp; Kegiatan
            </h2>
          </div>

          <Link
            href="#kabar"
            className="inline-flex items-center gap-2 text-[#626034] text-sm font-bold hover:text-[#352f2b] transition-colors"
          >
            <span>Semua Catatan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#d0c4be]/40 shadow-xs flex flex-col group hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="aspect-[16/10] overflow-hidden bg-[#2F2B28] relative">
                <Image
                  src={article.thumbnail}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3.5 left-3.5 bg-[#2F2B28]/85 text-[#FCF0DA] px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
                  {article.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 text-xs text-[#7f7570] mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#AEAC78]" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#352f2b] group-hover:text-[#626034] transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#4d4540] mt-2 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#d0c4be]/20">
                  <Link href={`/kabar/${article.id}`} className="text-[#626034] font-bold text-xs sm:text-sm inline-flex items items-center gap-1 group-hover:underline">
                    Baca Selengkapnya
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
