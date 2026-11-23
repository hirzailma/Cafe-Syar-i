import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem, MenuCategory } from '@/data/menu';

export const dynamic = 'force-dynamic'; // always fresh data (static for now)

export default function MenuPage() {
  const [category, setCategory] = useState<MenuCategory>('all');
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    const term = search.toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category;
      const matchesSearch =
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        (item.notes?.toLowerCase().includes(term) ?? false);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <section className="min-h-screen bg-[#FFF8F1] text-[#352f2b] py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#AEAC78] hover:text-[#626034]">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold">Katalog Menu</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MenuCategory)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AEAC78]"
          >
            {MENU_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Cari menu…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2 md:mt-0 border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#AEAC78]"
          />
        </div>

        {/* Menu Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <h2 className="text-xl font-semibold text-[#352f2b]">{item.name}</h2>
              <p className="text-sm text-[#7f7570]">
                {item.categoryLabel} • {item.price}
              </p>
              <p className="mt-2 text-[#352f2b]">{item.description}</p>
              {item.notes && (
                <p className="mt-1 text-xs italic text-[#7f7570]">{item.notes}</p>
              )}
              {item.badge && (
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-[#AEAC78] text-white rounded">
                  {item.badge}
                </span>
              )}
              <div className="mt-4 flex items-center gap-2">
                <a
                  href={`https://wa.me/6281992373219?text=${encodeURIComponent(`Halo, saya ingin memesan ${item.name} (${item.price}) dari Cafe Syar'i.`)}`}
                  target="_blank"
                  rel="noopener"
                  className="px-3 py-1 bg-[#AEAC78] text-white rounded hover:bg-[#626034] text-sm"
                >
                  Pesan via WhatsApp
                </a>
                {!item.isAvailable && (
                  <span className="px-2 py-1 bg-gray-300 text-gray-600 rounded text-xs">Tidak tersedia</span>
                )}
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <p className="col-span-full text-center text-[#7f7570]">Tidak ada menu yang cocok.</p>
          )}
        </div>
      </div>
    </section>
  );
}
