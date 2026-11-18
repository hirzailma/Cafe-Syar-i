"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <section className="py-16 md:py-24" id="kontak">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Contact Info & Form */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <span className="text-xs font-bold text-[#AEAC78] tracking-widest uppercase">
                LOKASI &amp; RESERVASI
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#352f2b] tracking-tight mt-1">
                Kunjungi Kami &amp; Silaturahmi
              </h2>
              <p className="text-sm sm:text-base text-[#4d4540] mt-2 leading-relaxed">
                Pintu kami senantiasa terbuka untuk menyambut kehadiran Anda dan keluarga di kawasan Banjaran, Kota Kediri.
              </p>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#d0c4be]/40 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-[#FCF0DA] flex items-center justify-center text-[#626034] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#352f2b]">Alamat</h4>
                  <p className="text-xs text-[#4d4540] mt-0.5 leading-relaxed">
                    {siteConfig.contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#d0c4be]/40 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-[#FCF0DA] flex items-center justify-center text-[#626034] shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#352f2b]">WhatsApp / Telp</h4>
                  <p className="text-xs text-[#4d4540] mt-0.5">
                    {siteConfig.contact.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#d0c4be]/40 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-[#FCF0DA] flex items-center justify-center text-[#626034] shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#352f2b]">Email</h4>
                  <p className="text-xs text-[#4d4540] mt-0.5">
                    {siteConfig.contact.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#d0c4be]/40 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-[#FCF0DA] flex items-center justify-center text-[#626034] shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#352f2b]">Jam Operasional</h4>
                  <p className="text-xs text-[#4d4540] mt-0.5">
                    {siteConfig.contact.openingHours.regular}
                  </p>
                  <p className="text-[11px] text-[#AEAC78] font-medium mt-0.5">
                    {siteConfig.contact.openingHours.fridayBreak}
                  </p>
                </div>
              </div>
            </div>

            {/* Simple Contact / Reservation Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-[#d0c4be]/40 shadow-xs flex flex-col gap-4"
            >
              <h3 className="text-lg font-bold text-[#352f2b]">
                Kirim Pertanyaan atau Reservasi Meja
              </h3>

              {submitted ? (
                <div className="p-4 rounded-xl bg-[#e8e5ad]/40 border border-[#626034]/30 flex items-center gap-3 text-[#1d1d00]">
                  <CheckCircle2 className="w-5 h-5 text-[#626034] shrink-0" />
                  <p className="text-xs sm:text-sm">
                    Alhamdulillah, pesan Anda telah terkirim! Tim kami akan segera menghubungi via WhatsApp.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-[#352f2b] mb-1.5">
                        Nama Lengkap *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contoh: Ahmad Fadilah"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 focus:border-[#626034] focus:ring-1 focus:ring-[#626034] text-xs sm:text-sm outline-none text-[#352f2b] placeholder:text-[#7f7570]"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-[#352f2b] mb-1.5">
                        Nomor WhatsApp *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+62 812-xxxx-xxxx"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 focus:border-[#626034] focus:ring-1 focus:ring-[#626034] text-xs sm:text-sm outline-none text-[#352f2b] placeholder:text-[#7f7570]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-[#352f2b] mb-1.5">
                      Alamat Email (Opsional)
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 focus:border-[#626034] focus:ring-1 focus:ring-[#626034] text-xs sm:text-sm outline-none text-[#352f2b] placeholder:text-[#7f7570]"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-[#352f2b] mb-1.5">
                      Pesan atau Kebutuhan Reservasi
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tuliskan tanggal kedatangan, perkiraan jumlah rombongan, atau agenda kajian..."
                      className="w-full px-4 py-2.5 rounded-lg bg-[#fff8f1] border border-[#d0c4be]/60 focus:border-[#626034] focus:ring-1 focus:ring-[#626034] text-xs sm:text-sm outline-none resize-none text-[#352f2b] placeholder:text-[#7f7570]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto self-start px-7 py-3 rounded-xl bg-[#352f2b] text-[#FCF0DA] text-xs sm:text-sm font-semibold hover:bg-[#4c4541] transition-all flex items-center justify-center gap-2 mt-1 shadow-xs"
                  >
                    <span>Kirim Pesan</span>
                    <Send className="w-4 h-4" />
                  </button>
                </>
              )}
            </form>
          </div>

          {/* Right Column: Google Maps Embed Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full min-h-[480px] rounded-2xl overflow-hidden border border-[#d0c4be]/40 shadow-xs bg-white flex flex-col justify-between">
              {/* Header card */}
              <div className="p-4 sm:p-5 border-b border-[#d0c4be]/30 bg-[#f9edd7]/50 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#626034] uppercase tracking-wider">
                    LOKASI RESMI
                  </span>
                  <h3 className="text-base font-bold text-[#352f2b]">Cafe Syar&apos;i Kediri</h3>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-white border border-[#d0c4be]/40 text-xs font-semibold text-[#626034] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#626034] animate-pulse"></span>
                  <span>Banjaran, Kediri</span>
                </div>
              </div>

              {/* Map Iframe Embed */}
              <div className="relative w-full flex-1 min-h-[340px] bg-[#f9edd7]">
                <iframe
                  title="Peta Lokasi Cafe Syar'i Banjaran Kediri"
                  src={siteConfig.contact.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>

              {/* Bottom CTA */}
              <div className="p-4 bg-white border-t border-[#d0c4be]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-[#4d4540]">
                  Gg. I No.28, Banjaran, Kec. Kota, Kediri
                </div>
                <Link
                  href={siteConfig.contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#352f2b] text-[#FCF0DA] hover:bg-[#4c4541] text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Google Maps</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
