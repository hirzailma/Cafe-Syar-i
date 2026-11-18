export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "minuman" | "makanan" | "paket";
  image_path: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface TableSlot {
  id: string;
  label: string;
  capacity: number;
  is_available: boolean;
}

export interface OrderItem {
  menu_id: string;
  menu_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  table_slot_id?: string;
  table_slot_label?: string;
  order_date: string;
  visit_time: string;
  visit_date: string;
  items: OrderItem[];
  total_amount: number;
  payment_method: "qris" | "cash";
  payment_proof_path?: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
  notes?: string;
  created_at: string;
  updated_at: string;
}
