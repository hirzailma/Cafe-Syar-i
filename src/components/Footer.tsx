import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ShieldCheck, MessageCircle, Instagram, Youtube, Video } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2F2B28] text-[#FCF0DA] pt-16 pb-12 border-t border-[#2F2B28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Logo & Tagline (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 overflow-hidden rounded-2xl shadow-sm shrink-0">
                <Image
                  src={siteConfig.logo}
                  alt={`Logo ${siteConfig.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold text-[#FCF0DA] tracking-tight">
                {siteConfig.name}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#d0c4be] max-w-sm leading-relaxed">
              Artisan Coffee &amp; Halal Roastery berdedikasi menyajikan keberkahan dalam setiap tetes kopi nusantara dan ruang kebersamaan yang santun di Kota Kediri.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <Link
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Cafe Syar'i"
                className="w-9 h-9 rounded-full bg-[#4c4541] flex items-center justify-center text-[#FCF0DA] hover:bg-[#F2C46A] hover:text-[#2F2B28] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </Link>
              <Link
                href={siteConfig.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Cafe Syar'i"
                className="w-9 h-9 rounded-full bg-[#4c4541] flex items-center justify-center text-[#FCF0DA] hover:bg-[#F2C46A] hover:text-[#2F2B28] transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </Link>
              <Link
                href={siteConfig.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Cafe Syar'i"
                className="w-9 h-9 rounded-full bg-[#4c4541] flex items-center justify-center text-[#FCF0DA] hover:bg-[#F2C46A] hover:text-[#2F2B28] transition-colors"
              >
                <Video className="w-4 h-4" />
              </Link>
              <Link
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Cafe Syar'i"
                className="w-9 h-9 rounded-full bg-[#4c4541] flex items-center justify-center text-[#FCF0DA] hover:bg-[#F2C46A] hover:text-[#2F2B28] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Nav (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-[#F2C46A] uppercase tracking-wider">
              Navigasi
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#d0c4be]">
              <li>
                <Link href="#beranda" className="hover:text-[#F2C46A] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="#tentang" className="hover:text-[#F2C46A] transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="#layanan" className="hover:text-[#F2C46A] transition-colors">
                  Layanan
                </Link>
              </li>
              <li>
                <Link href="#kabar" className="hover:text-[#F2C46A] transition-colors">
                  Kabar Kopi
                </Link>
              </li>
              <li>
                <Link href="#kontak" className="hover:text-[#F2C46A] transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Standards (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-[#F2C46A] uppercase tracking-wider">
              Etika &amp; Kepatuhan
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#d0c4be]">
              <li>
                <span className="hover:text-[#F2C46A] cursor-pointer transition-colors">
                  Standar Halal &amp; Thayyib
                </span>
              </li>
              <li>
                <span className="hover:text-[#F2C46A] cursor-pointer transition-colors">
                  Panduan Biji Kopi Nusantara
                </span>
              </li>
              <li>
                <span className="hover:text-[#F2C46A] cursor-pointer transition-colors">
                  Etika Muamalah Transparan
                </span>
              </li>
              <li>
                <span className="hover:text-[#F2C46A] cursor-pointer transition-colors">
                  Kebijakan Privasi
                </span>
              </li>
            </ul>
          </div>

          {/* Halal Guarantee Card (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-[#F2C46A] uppercase tracking-wider">
              Jaminan
            </h4>
            <div className="p-3.5 rounded-xl bg-[#4c4541]/50 border border-[#d0c4be]/20 text-[#d0c4be] flex flex-col gap-2">
              <ShieldCheck className="w-7 h-7 text-[#F2C46A]" />
              <span className="text-xs text-[#FCF0DA] font-bold">100% Jaminan Halal</span>
              <span className="text-[11px] text-[#d0c4be]/80 leading-snug">
                Proses sangrai &amp; racikan bebas alkohol &amp; syubhat.
              </span>
            </div>
          </div>
        </div>

        {/* Copyright Bottom */}
        <div className="pt-8 border-t border-[#4c4541]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#d0c4be]/80 gap-3">
          <p>© {new Date().getFullYear()} Cafe Syar&apos;i Kediri. Seluruh hak cipta dilindungi.</p>
          <p className="text-[11px] text-[#AEAC78]">Artisan Halal Roastery &amp; Kedai Kopi Islami.</p>
        </div>
      </div>
    </footer>
  );
}
