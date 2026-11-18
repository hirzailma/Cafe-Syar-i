import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRight, ShieldCheck, Coffee, HeartHandshake, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-6 pb-14 md:pt-12 md:pb-20 overflow-hidden" id="beranda">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Copy (Desktop 6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f9edd7] border border-[#d0c4be]/50">
              <span className="w-2 h-2 rounded-full bg-[#AEAC78] animate-pulse"></span>
              <span className="text-xs font-semibold text-[#626034] tracking-wide">
                Purity, Serenity & Artisan Craft
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#352f2b] tracking-tight leading-tight">
              Kelezatan Kopi Artisan dalam Ketenangan Syar&apos;i
            </h1>

            <p className="text-base sm:text-lg text-[#4d4540] max-w-xl leading-relaxed">
              Menyajikan biji kopi nusantara pilihan yang di-roast sempurna dan sajian kuliner thayyib di kawasan Banjaran, Kota Kediri. Suasana hangat, tenang, ramah keluarga, serta mendukung kegiatan edukasi dan kajian ringan.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2">
              <Link
                href="/pesan"
                className="px-6 py-3.5 rounded-xl bg-[#AEAC78] text-white font-bold text-sm hover:bg-[#626034] transition-all text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Pesan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#layanan"
                className="px-6 py-3.5 rounded-xl bg-[#352f2b] text-[#FCF0DA] font-semibold text-sm hover:bg-[#4c4541] transition-all text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Lihat Layanan & Menu</span>
              </Link>
              <Link
                href="#tentang"
                className="px-6 py-3.5 rounded-xl border border-[#AEAC78] text-[#626034] hover:bg-[#AEAC78]/15 font-semibold text-sm transition-all text-center"
              >
                Jelajahi Cerita Kami
              </Link>
            </div>
          </div>

          {/* Hero Image Canvas (Desktop 6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#352f2b]/10 bg-white aspect-[4/3] sm:aspect-[16/11]">
              <Image
                src="/images/hero-cafe.png"
                alt="Interior estetis dan tenang di Cafe Syar'i Kediri"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2F2B28]/40 via-transparent to-transparent"></div>

              {/* Floating Halal Badge */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-[#d0c4be]/40 flex items-center gap-3 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-[#FCF0DA] flex items-center justify-center text-[#F2C46A] shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#626034]" />
                </div>
                <div>
                  <p className="text-xs text-[#4d4540] font-medium">Teruji &amp; Terjamin</p>
                  <p className="text-sm font-bold text-[#352f2b]">100% Halal &amp; Thayyib Standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats / Trust Bar Banner */}
        <div className="mt-12 md:mt-16 pt-8 border-t border-[#352f2b]/10 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/70 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-[#d0c4be]/40 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f9edd7] flex items-center justify-center text-[#626034] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#352f2b]">100% Halal & Thayyib</h4>
              <p className="text-xs text-[#4d4540] mt-0.5">Dari biji hijau hingga proses seduhan higienis</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f9edd7] flex items-center justify-center text-[#626034] shrink-0">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#352f2b]">Single Origin Nusantara</h4>
              <p className="text-xs text-[#4d4540] mt-0.5">Biji kopi terbaik langsung dari petani etis</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f9edd7] flex items-center justify-center text-[#626034] shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#352f2b]">Musholla & Ramah Keluarga</h4>
              <p className="text-xs text-[#4d4540] mt-0.5">Tempat ibadah bersih, sejuk, tenang & edukatif</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
