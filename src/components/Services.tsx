import { siteConfig } from "@/config/site";
import { Coffee, Package, Users, GraduationCap, ArrowUpRight } from "lucide-react";

export default function Services() {
  const iconMap: Record<string, React.ReactNode> = {
    "artisan-bar": <Coffee className="w-6 h-6" />,
    "roastery-b2b": <Package className="w-6 h-6" />,
    "meeting-space": <Users className="w-6 h-6" />,
    "brewing-workshop": <GraduationCap className="w-6 h-6" />,
  };

  return (
    <section className="py-16 md:py-24" id="layanan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 flex flex-col gap-3">
          <span className="text-xs font-bold text-[#AEAC78] tracking-widest uppercase">
            LAYANAN KAMI
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#352f2b] tracking-tight">
            Layanan Unggulan Cafe Syar&apos;i
          </h2>
          <p className="text-sm sm:text-base text-[#4d4540]">
            Dari seduhan cangkir meja, ruang santai penuh edukasi, hingga pasokan biji kopi harian berkualitas.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-6 rounded-2xl border border-[#d0c4be]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FCF0DA] flex items-center justify-center text-[#352f2b] group-hover:bg-[#F2C46A] group-hover:text-[#2F2B28] transition-colors duration-200 mb-5">
                  {iconMap[service.id] || <Coffee className="w-6 h-6" />}
                </div>

                <h3 className="text-lg font-bold text-[#352f2b] mb-2 group-hover:text-[#626034] transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#4d4540] leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-5 mt-6 border-t border-[#d0c4be]/30 flex items-center justify-between text-[#626034] text-xs font-bold">
                <span>{service.badge}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
