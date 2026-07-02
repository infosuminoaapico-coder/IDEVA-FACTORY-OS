export interface Customer {
  id: number;
  code: string;
  name: string;
  contact: string;
  phone?: string;
  email?: string;
  tax_id?: string;
  address?: string;
  status: string;
  created_at: string;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  type: string;
  version: string;
  status: string;
}

export interface RawMaterial {
  id: number;
  code: string;
  name: string;
  unit: string;
  stock_qty: number;
  min_stock: number;
  status: string;
}

export interface BomMaterial {
  material_name: string;
  quantity: number;
  unit: string;
  notes?: string | null;
}

export interface BomRecipe {
  id: number;
  product_id: number;
  version: string;
  status: string;
  notes?: string;
  materials: BomMaterial[];
  product_code?: string;
  product_name?: string;
  product_type?: string;
  production_count?: number;
  production_quantity?: number;
}

export interface ProductionOrder {
  id: number;
  code: string;
  customer_id: number;
  product_id: number;
  quantity: number;
  unit: string;
  status: string;
  due_date: string;
  staff?: string;
  date: string;
  customer_name?: string;
  product_name?: string;
  product_code?: string;
  created_at?: string;
}

export interface PackingOrder {
  id: number;
  code: string;
  production_order_id: number;
  item_name: string;
  quantity: number;
  unit: string;
  status: string;
}

export interface PurchaseItem {
  raw_material_id: number;
  item_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: number;
  code: string;
  supplier: string;
  order_date: string;
  status: string;
  total_amount: number;
  items: PurchaseItem[];
  material?: string; // for simple display/compatibility
  qty?: number;      // for simple display/compatibility
  price?: number;    // for simple display/compatibility
}

export interface Grn {
  id: number;
  code: string;
  purchase_order_id: number;
  raw_material_id: number;
  lot_number: string;
  expiry_date: string;
  received_qty: number;
  receiver: string;
  receive_date: string;
  status: string;
  purchase?: string;  // display
  material?: string;  // display
  qty?: number;       // display
  lot?: string;       // display
  expiry?: string;    // display
}

export interface Precheck {
  id: number;
  material: string;
  lot: string;
  expiry: string;
  inspector: string;
  date: string;
  result: string;
}

export interface InventoryPack {
  id: number;
  code: string;
  type: string;
  name: string;
  qty: number;
  unit: string;
  status: string;
}

export interface PurchasePack {
  id: number;
  code: string;
  supplier: string;
  item: string;
  qty: number;
  price: number;
  status: string;
}
