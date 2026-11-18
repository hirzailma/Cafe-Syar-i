import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MenuItem } from "@/types/order";
import { DEFAULT_MENU } from "@/lib/menu-data";

export async function GET() {
  try {
    const items = await db.find<MenuItem>("Menu");
    const result = items.length > 0 ? items : DEFAULT_MENU;
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({ success: true, data: DEFAULT_MENU });
  }
}
