export type MenuCategory = 'all' | 'beans' | 'espresso' | 'non-coffee' | 'pastry';

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  category: Exclude<MenuCategory, 'all'>;
  categoryLabel: string;
  price: string; // formatted price, e.g., "Rp45.000"
  description: string;
  notes?: string; // tasting notes or special info
  badge?: string; // e.g., "Best Seller"
  isAvailable: boolean;
}

export const MENU_CATEGORIES: { value: MenuCategory; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'beans', label: 'Biji Kopi' },
  { value: 'espresso', label: 'Espresso & Milk' },
  { value: 'non-coffee', label: 'Non‑Coffee' },
  { value: 'pastry', label: 'Pastry' },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    slug: 'biji-kopi-arabika-gayo',
    name: 'Biji Kopi Arabika Gayo',
    category: 'beans',
    categoryLabel: 'Biji Kopi',
    price: 'Rp120.000',
    description: 'Biji kopi single‑origin Gayo, washed, cita rasa buah beri dan chocolate.',
    notes: 'Tasting notes: bright acidity, medium body, caramel finish.',
    badge: 'Best Seller',
    isAvailable: true,
  },
  {
    id: '2',
    slug: 'espresso-milk-cappuccino',
    name: 'Cappuccino',
    category: 'espresso',
    categoryLabel: 'Espresso & Milk',
    price: 'Rp45.000',
    description: 'Espresso shot dengan susu penuh busa, sentuhan kayu manis.',
    isAvailable: true,
  },
  {
    id: '3',
    slug: 'non-coffee-teh-herbal',
    name: 'Teh Herbal Mint',
    category: 'non-coffee',
    categoryLabel: 'Non‑Coffee',
    price: 'Rp30.000',
    description: 'Teh herbal segar dengan daun mint organik, cocok di siang hari.',
    notes: 'Tanpa kafein',
    isAvailable: true,
  },
  {
    id: '4',
    slug: 'pastry-croissant-chocolate',
    name: 'Croissant Cokelat',
    category: 'pastry',
    categoryLabel: 'Pastry',
    price: 'Rp35.000',
    description: 'Croissant mentega dengan isi cokelat hitam, lembut di dalam.',
    isAvailable: false,
  },
  {
    id: '5',
    slug: 'espresso-pull-espresso',
    name: 'Pull Espresso',
    category: 'espresso',
    categoryLabel: 'Espresso & Milk',
    price: 'Rp40.000',
    description: 'Espresso murni, 30ml, hasil crema tebal.',
    isAvailable: true,
  },
];
