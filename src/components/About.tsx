import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Leaf, ShieldCheck, Award, Heart } from "lucide-react";

export default function About() {
  return (
    <section className="py-16 md:py-24 bg-[#fef2dc]/60 border-y border-[#352f2b]/5" id="tentang">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Barista Image */}
          <div className="lg:col-span-5 order-2 lg:order-1 relative">
            <div className="rounded-2xl overflow-hidden shadow-md border border-[#d0c4be]/40 bg-white aspect-[4/5] relative">
              <Image
                src="/images/about-barista.webp"
                alt="Barista Cafe Syar'i sedang menyeduh manual brew pour-over"
                fill
                className="object-cover"
              />
            </div>

            {/* Artisan Accent Card */}
            <div className="mt-4 p-4 rounded-xl bg-[#e8e5ad]/40 border border-[#626034]/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#626034] text-white flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-[#49491e] font-medium leading-relaxed">
                Mengutamakan prinsip <span className="font-bold text-[#626034]">thayyib</span> (halal, higienis, dan berkah) dalam setiap gram bubuk kopi yang diseduh.
              </p>
            </div>
          </div>

          {/* Right Column: Story & Key Strengths */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#AEAC78] tracking-widest uppercase">
                TENTANG KAMI
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#352f2b] tracking-tight">
                Menghubungkan Cita Rasa Kopi Nusantara dengan Nilai Kebaikan
              </h2>
            </div>

            <p className="text-base text-[#4d4540] leading-relaxed">
              {siteConfig.description}
            </p>

            <p className="text-sm text-[#4d4540]/90 leading-relaxed -mt-2">
              Berangkat dari kecintaan mendalam pada aroma kopi Indonesia dan etika muamalah yang santun, Cafe Syar&apos;i hadir bukan hanya sebagai tempat ngopi, melainkan juga wadah silaturahmi yang menyejukkan hati dan menumbuhkan semangat belajar bersama di Kota Kediri.
            </p>

            {/* 3 Key Strengths Cards */}
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#d0c4be]/30 shadow-xs transition-transform duration-200 hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-lg bg-[#f9edd7] flex items-center justify-center shrink-0 text-[#626034]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#352f2b]">Biji Kopi Halal &amp; Thayyib</h3>
                  <p className="text-xs sm:text-sm text-[#4d4540] mt-0.5 leading-relaxed">
                    Bersumber dari perkebunan pilihan dengan proses pemanggangan terverifikasi halal tanpa kontaminasi zat syubhat.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#d0c4be]/30 shadow-xs transition-transform duration-200 hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-lg bg-[#f9edd7] flex items-center justify-center shrink-0 text-[#626034]">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#352f2b]">Ruang Tenang, Ramah Keluarga &amp; Syar&apos;i</h3>
                  <p className="text-xs sm:text-sm text-[#4d4540] mt-0.5 leading-relaxed">
                    Area bebas rokok yang adem, musholla representatif, alunan yang menenangkan, serta tempat yang bersahabat bagi keluarga dan kegiatan kajian.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#d0c4be]/30 shadow-xs transition-transform duration-200 hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-lg bg-[#f9edd7] flex items-center justify-center shrink-0 text-[#626034]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#352f2b]">Barista Berpengalaman &amp; Beretika</h3>
                  <p className="text-xs sm:text-sm text-[#4d4540] mt-0.5 leading-relaxed">
                    Diseduh presisi oleh barista terampil yang mengutamakan keramahan, transparansi bahan, dan konsistensi cita rasa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
