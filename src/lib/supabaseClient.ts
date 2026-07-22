import { createClient } from "@supabase/supabase-js";

// Exact Supabase credentials from the project's config
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "https://zizlhxikswejwvoftshk.supabase.co";
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_KEY || (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppemxoeGlrc3dland2b2Z0c2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNzQ4NDMsImV4cCI6MjA5NjY1MDg0M30.lw7RsYg6Icz7HhT7cbjJsKrOv-pzKLV01D5WR03Ffg0";

const cleanUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "");
export const supabase = createClient(cleanUrl, supabaseKey);

// Local Fallback Mock Database in case Supabase tables are empty or unreachable
export const fallbackDB: Record<string, any[]> = {
  suppliers: [
    {
      id: 1,
      code: "SUP-001",
      name: "บริษัท โกลบอลเคมีคอล ซัพพลาย จำกัด",
      contact: "คุณสมพงษ์ สารเคมี",
      phone: "02-123-4567",
      email: "sales@globalchem.co.th",
      address: "88/12 ถนนบางนา-ตราด กม.10 บางพลี สมุทรปราการ",
      status: "active"
    },
    {
      id: 2,
      code: "SUP-002",
      name: "บริษัท ไทยอินกรีเดียนท์ จำกัด",
      contact: "คุณวรรณา ซัพพลาย",
      phone: "02-987-6543",
      email: "info@thaiingredients.com",
      address: "101/5 ซอยสุขุมวิท 71 พระโขนง กรุงเทพฯ",
      status: "active"
    },
    {
      id: 3,
      code: "SUP-003",
      name: "บริษัท นิปปอน เคมิเคิล (ประเทศไทย) จำกัด",
      contact: "Mr. Kenji Sato",
      phone: "02-555-8899",
      email: "order@nipponchem.co.th",
      address: "45/8 นิคมอุตสาหกรรมอมตะซิตี้ ชลบุรี",
      status: "active"
    }
  ],
  customers: [
    {
      id: 1,
      code: "C69-001",
      name: "บริษัท เอสซีจี เคมิคอลส์ จำกัด (มหาชน)",
      contact: "คุณวิทวัส สมบูรณ์",
      phone: "02-586-4444",
      email: "contact@scgchemicals.com",
      tax_id: "0107555000123",
      address: "1 ถนนปูนซิเมนต์ไทย แขวงบางซื่อ เขตบางซื่อ กรุงเทพฯ 10800",
      status: "active",
      created_at: "2026-05-15 09:30:00"
    },
    {
      id: 2,
      code: "C69-002",
      name: "บริษัท สยามเคมีคอล กรุ๊ป จำกัด",
      contact: "คุณสมศรี รักดี",
      phone: "089-876-5432",
      email: "info@siamchem.co.th",
      tax_id: "0105559000456",
      address: "88 หมู่ 5 นิคมอุตสาหกรรมบางปู ต.บางปูใหม่ อ.เมือง จ.สมุทรปราการ 10280",
      status: "active",
      created_at: "2026-05-20 10:15:00"
    },
    {
      id: 3,
      code: "C69-003",
      name: "ห้างหุ้นส่วนจำกัด อุตสาหกรรมเคมีไทย",
      contact: "คุณวิชัย เลิศล้ำ",
      phone: "02-444-5555",
      email: "thaichem_ind@gmail.com",
      tax_id: "0103548000789",
      address: "456 ถนนเพชรเกษม แขวงบางหว้า เขตภาษีเจริญ กรุงเทพฯ 10160",
      status: "active",
      created_at: "2026-06-01 14:00:00"
    }
  ],
  products: [
    { id: 1, code: "P-001", name: "น้ำยาเคลือบแก้วพรีเมียม A", type: "Liquid", version: "v1.0", status: "active" },
    { id: 2, code: "P-002", name: "สารฆ่าเชื้อประสิทธิภาพสูง B", type: "Liquid", version: "v2.1", status: "active" },
    { id: 3, code: "P-003", name: "ผงซักล้างอุตสาหกรรมสูตรเข้มข้น C", type: "Powder", version: "v1.0", status: "active" }
  ],
  raw_materials: [
    { id: 1, code: "RM-001", name: "Ethanol 96%", unit: "L.", stock_qty: 120, min_stock: 50, unit_price: 65, supplier_id: 1, supplier_name: "บริษัท โกลบอลเคมีคอล ซัพพลาย จำกัด", status: "active", image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop" },
    { id: 2, code: "RM-002", name: "Glycerin USP", unit: "L.", stock_qty: 45, min_stock: 30, unit_price: 90, supplier_id: 1, supplier_name: "บริษัท โกลบอลเคมีคอล ซัพพลาย จำกัด", status: "active", image_url: "https://images.unsplash.com/photo-1608248597280-92fb13e64f77?w=300&auto=format&fit=crop" },
    { id: 3, code: "RM-003", name: "Sodium Hydroxide (NaOH)", unit: "KG.", stock_qty: 15, min_stock: 20, unit_price: 55, supplier_id: 2, supplier_name: "บริษัท ไทยอินกรีเดียนท์ จำกัด", status: "active", image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&auto=format&fit=crop" },
    { id: 4, code: "RM-004", name: "Hydrogen Peroxide 35%", unit: "L.", stock_qty: 85, min_stock: 40, unit_price: 110, supplier_id: 3, supplier_name: "บริษัท นิปปอน เคมิเคิล (ประเทศไทย) จำกัด", status: "active", image_url: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=300&auto=format&fit=crop" },
    { id: 5, code: "RM-005", name: "Citric Acid Anhydrous", unit: "KG.", stock_qty: 32, min_stock: 25, unit_price: 70, supplier_id: 2, supplier_name: "บริษัท ไทยอินกรีเดียนท์ จำกัด", status: "active", image_url: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop" }
  ],
  bom_recipes: [
    {
      id: 1,
      product_id: 1,
      version: "v1.0",
      status: "active",
      notes: "สูตรเคลือบแก้วมาตรฐานโรงงาน",
      materials: [
        { material_name: "Ethanol 96%", quantity: 100, unit: "ลิตร", notes: "ส่วนผสมหลัก" },
        { material_name: "Glycerin USP", quantity: 10, unit: "ลิตร", notes: "เพิ่มความหนืด" },
        { material_name: "Citric Acid", quantity: 2, unit: "กก.", notes: "ปรับค่าความเป็นกรดด่าง" }
      ]
    },
    {
      id: 2,
      product_id: 2,
      version: "v2.1",
      status: "active",
      notes: "สูตรสารฆ่าเชื้อประสิทธิภาพสูง",
      materials: [
        { material_name: "Ethanol 96%", quantity: 150, unit: "ลิตร", notes: "ส่วนประกอบหลัก" },
        { material_name: "Hydrogen Peroxide 35%", quantity: 20, unit: "ลิตร", notes: "ฆ่าสปอร์และเชื้อไวรัส" },
        { material_name: "Glycerin USP", quantity: 5, unit: "ลิตร", notes: "รักษาความชุ่มชื้น" }
      ]
    },
    {
      id: 3,
      product_id: 3,
      version: "v1.0",
      status: "active",
      notes: "ผงซักล้างสูตรด่างเข้มข้น",
      materials: [
        { material_name: "Sodium Hydroxide (NaOH)", quantity: 50, unit: "กก.", notes: "สารทำปฏิกิริยาด่าง" },
        { material_name: "Citric Acid", quantity: 15, unit: "กก.", notes: "สารปรับปรุงสภาพน้ำ" }
      ]
    }
  ],
  production_orders: [
    {
      id: 1,
      code: "PO-2026-0056",
      customer_id: 1,
      product_id: 1,
      quantity: 500,
      unit: "ลิตร",
      status: "done",
      due_date: "2026-06-25",
      staff: "สมชาย ใจดี",
      date: "2026-06-20",
      created_at: "2026-06-20 09:00:00"
    },
    {
      id: 2,
      code: "PO-2026-0055",
      customer_id: 2,
      product_id: 2,
      quantity: 200,
      unit: "ลิตร",
      status: "running",
      due_date: "2026-07-02",
      staff: "ดร.สุภา",
      date: "2026-06-28",
      created_at: "2026-06-28 10:30:00"
    },
    {
      id: 3,
      code: "PO-2026-0054",
      customer_id: 3,
      product_id: 3,
      quantity: 1000,
      unit: "กก.",
      status: "pending",
      due_date: "2026-07-10",
      staff: "สมชาติ ใจมั่น",
      date: "2026-06-29",
      created_at: "2026-06-29 13:45:00"
    }
  ],
  packing_orders: [
    {
      id: 1,
      code: "PK-2026-0021",
      production_order_id: 1,
      item_name: "น้ำยาเคลือบแก้วพรีเมียม A",
      quantity: 500,
      unit: "ขวด",
      status: "done"
    },
    {
      id: 2,
      code: "PK-2026-0020",
      production_order_id: 2,
      item_name: "สารฆ่าเชื้อประสิทธิภาพสูง B",
      quantity: 200,
      unit: "ขวด",
      status: "running"
    },
    {
      id: 3,
      code: "PK-2026-0019",
      production_order_id: 3,
      item_name: "ผงซักล้างอุตสาหกรรมสูตรเข้มข้น C",
      quantity: 1000,
      unit: "ถุง",
      status: "pending"
    }
  ],
  purchase_orders: [
    {
      id: 1,
      code: "PRM-2026-0023",
      supplier: "บริษัท โกลบอลเคมีคอล ซัพพลาย จำกัด",
      order_date: "2026-06-18",
      status: "pending",
      total_amount: 15400,
      items: [
        { raw_material_id: 1, item_name: "Ethanol 96%", quantity: 200, unit: "ลิตร", unit_price: 60, subtotal: 12000 },
        { raw_material_id: 2, item_name: "Glycerin USP", quantity: 40, unit: "ลิตร", unit_price: 85, subtotal: 3400 }
      ]
    },
    {
      id: 2,
      code: "PRM-2026-0022",
      supplier: "บริษัท ไทยอินกรีเดียนท์ จำกัด",
      order_date: "2026-06-15",
      status: "received",
      total_amount: 8800,
      items: [
        { raw_material_id: 3, item_name: "Sodium Hydroxide (NaOH)", quantity: 100, unit: "กก.", unit_price: 55, subtotal: 5500 },
        { raw_material_id: 5, item_name: "Citric Acid", quantity: 50, unit: "กก.", unit_price: 66, subtotal: 3300 }
      ]
    }
  ],
  grns: [
    {
      id: 1,
      code: "GRN-2026-0018",
      purchase_order_id: 2,
      raw_material_id: 3,
      lot_number: "L260615-001",
      expiry_date: "2028-06-15",
      received_qty: 100,
      receiver: "สมศักดิ์ คลังสินค้า",
      receive_date: "2026-06-15",
      status: "received"
    },
    {
      id: 2,
      code: "GRN-2026-0017",
      purchase_order_id: 2,
      raw_material_id: 5,
      lot_number: "L260615-002",
      expiry_date: "2028-06-15",
      received_qty: 50,
      receiver: "สมศักดิ์ คลังสินค้า",
      receive_date: "2026-06-15",
      status: "received"
    }
  ],
  prechecks: [
    {
      id: 1,
      material: "Ethanol 96%",
      lot: "L240901",
      expiry: "2026-09-01",
      inspector: "ดร.สุภา",
      date: "2026-06-20",
      result: "pass"
    },
    {
      id: 2,
      material: "Sodium Hydroxide (NaOH)",
      lot: "L240920",
      expiry: "2026-09-20",
      inspector: "ดร.สุภา",
      date: "2026-06-21",
      result: "fail"
    },
    {
      id: 3,
      material: "Glycerin USP",
      lot: "L240820",
      expiry: "2026-07-20",
      inspector: "นายประพันธ์",
      date: "2026-06-25",
      result: "pending"
    }
  ],
  inventory_pack: [
    { id: 1, code: "PK-001", type: "ขวด", name: "ขวด HDPE ขนาด 1 ลิตร", qty: 2450, unit: "ชิ้น", status: "active" },
    { id: 2, code: "PK-002", type: "ฝา", name: "ฝาสกรูพลาสติก สีขาว", qty: 4800, unit: "ชิ้น", status: "active" },
    { id: 3, code: "PK-003", type: "ฉลาก", name: "ฉลากน้ำยาเคลือบแก้ว P-001", qty: 1500, unit: "ชิ้น", status: "active" },
    { id: 4, code: "PK-004", type: "ฉลาก", name: "ฉลากสารฆ่าเชื้อ P-002", qty: 850, unit: "ชิ้น", status: "active" }
  ]
};

// Initialize in-memory storage fallback mimicking Supabase
const memoryDB: Record<string, any[]> = JSON.parse(
  localStorage.getItem("factory_memory_db") || JSON.stringify(fallbackDB)
);

const saveMemory = () => {
  localStorage.setItem("factory_memory_db", JSON.stringify(memoryDB));
};

export async function clientGetList(entity: string): Promise<any[]> {
  const table = entity;
  const hasFailedBefore = localStorage.getItem(`supabase_failed_${entity}`) === "true";
  if (hasFailedBefore) {
    console.warn(`Supabase has previously failed for ${entity}. Using local memory DB instead.`);
    return memoryDB[entity] || [];
  }
  try {
    const { data, error } = await supabase.from(table).select("*").order("id", { ascending: false });
    if (error) throw error;

    let finalData = data || [];
    let usedMockFallback = false;
    if (finalData.length === 0) {
      finalData = memoryDB[entity] || [];
      usedMockFallback = true;
    }

    if (entity === "bom_recipes" && finalData) {
      if (usedMockFallback) return finalData;
      const enrichedRows = [];
      for (const row of finalData) {
        const item = { ...row };
        try {
          const { data: items, error: err2 } = await supabase.from("bom_items").select("*").eq("bom_id", item.id);
          if (!err2 && items) {
            item.materials = items.map((itm: any) => ({
              raw_material_id: itm.raw_material_id,
              material_name: itm.material_name,
              quantity: parseFloat(itm.quantity),
              unit: itm.unit,
              notes: itm.notes || ""
            }));
          } else {
            item.materials = [];
          }
        } catch (e) {
          item.materials = [];
        }
        enrichedRows.push(item);
      }
      return enrichedRows;
    }

    if (entity === "purchase_orders" && finalData) {
      if (usedMockFallback) return finalData;
      const enrichedRows = [];
      for (const row of finalData) {
        const item = { ...row };
        try {
          const { data: items, error: err2 } = await supabase.from("purchase_order_items").select("*").eq("purchase_order_id", item.id);
          if (!err2 && items) {
            item.items = items.map((itm: any) => ({
              raw_material_id: itm.raw_material_id,
              item_name: itm.item_name,
              quantity: parseFloat(itm.quantity),
              unit: itm.unit,
              unit_price: parseFloat(itm.unit_price),
              subtotal: parseFloat(itm.subtotal)
            }));
          } else {
            item.items = [];
          }
        } catch (e) {
          item.items = [];
        }
        enrichedRows.push(item);
      }
      return enrichedRows;
    }

    return finalData;
  } catch (err) {
    console.warn(`Supabase client query failed for ${entity}, falling back to local memory:`, err);
    localStorage.setItem(`supabase_failed_${entity}`, "true");
    return memoryDB[entity] || [];
  }
}

export async function clientSave(entity: string, id: number, data: any): Promise<number> {
  const table = entity;
  const cleanData = { ...data };
  delete cleanData.id;

  // Extract relations
  let materialsToSave: any[] | null = null;
  let itemsToSave: any[] | null = null;

  if (entity === "bom_recipes") {
    if ("materials" in cleanData) {
      materialsToSave = Array.isArray(cleanData.materials) ? cleanData.materials : [];
      delete cleanData.materials;
    }
  }
  if (entity === "purchase_orders") {
    if ("items" in cleanData) {
      itemsToSave = Array.isArray(cleanData.items) ? cleanData.items : [];
      delete cleanData.items;
    }
  }

  try {
    let savedId = id;
    if (id > 0) {
      const { error } = await supabase.from(table).update(cleanData).eq("id", id);
      if (error) throw error;
    } else {
      const { data: inserted, error } = await supabase.from(table).insert(cleanData).select("id").single();
      if (error) throw error;
      savedId = inserted.id;
    }

    // Handle child table saves
    if (entity === "bom_recipes" && materialsToSave !== null) {
      await supabase.from("bom_items").delete().eq("bom_id", savedId);
      for (const mat of materialsToSave) {
        await supabase.from("bom_items").insert({
          bom_id: savedId,
          raw_material_id: mat.raw_material_id || null,
          material_name: mat.material_name,
          quantity: mat.quantity || 0,
          unit: mat.unit || 'กก.',
          notes: mat.notes || null
        });
      }
    }

    if (entity === "purchase_orders" && itemsToSave !== null) {
      await supabase.from("purchase_order_items").delete().eq("purchase_order_id", savedId);
      for (const itm of itemsToSave) {
        await supabase.from("purchase_order_items").insert({
          purchase_order_id: savedId,
          raw_material_id: itm.raw_material_id || null,
          item_name: itm.item_name,
          quantity: itm.quantity || 0,
          unit: itm.unit || 'กก.',
          unit_price: itm.unit_price || 0,
          subtotal: itm.subtotal || 0
        });
      }
    }

    // Automatically update stock on GRN save (real-time, client-side)
    if (entity === "grns" && id === 0) {
      const rawMaterialId = parseInt(cleanData.raw_material_id || 0);
      const receivedQty = parseFloat(cleanData.received_qty || 0);
      if (rawMaterialId && receivedQty) {
        try {
          const { data: mat, error: matErr } = await supabase.from("raw_materials").select("stock_qty").eq("id", rawMaterialId).single();
          if (!matErr && mat) {
            const newStock = parseFloat(mat.stock_qty || 0) + receivedQty;
            await supabase.from("raw_materials").update({ stock_qty: newStock }).eq("id", rawMaterialId);
          }
        } catch (e) {
          console.error("Error updating stock on GRN save:", e);
        }
        
        // Also update local memory fallback
        const matIdx = memoryDB.raw_materials.findIndex((m: any) => m.id === rawMaterialId);
        if (matIdx >= 0) {
          memoryDB.raw_materials[matIdx].stock_qty = parseFloat(memoryDB.raw_materials[matIdx].stock_qty || 0) + receivedQty;
          saveMemory();
        }
      }
    }

    // Keep local memory fallback database synchronized with Supabase
    if ((memoryDB as any)[entity]) {
      const idx = (memoryDB as any)[entity].findIndex((item: any) => item.id === savedId);
      const dataWithId = { ...cleanData, id: savedId };
      if (entity === "bom_recipes" && materialsToSave !== null) {
        dataWithId.materials = materialsToSave;
      }
      if (entity === "purchase_orders" && itemsToSave !== null) {
        dataWithId.items = itemsToSave;
      }
      if (idx >= 0) {
        (memoryDB as any)[entity][idx] = { ...(memoryDB as any)[entity][idx], ...dataWithId };
      } else {
        if (entity === "customers") {
          (memoryDB as any)[entity].unshift(dataWithId);
        } else {
          (memoryDB as any)[entity].push(dataWithId);
        }
      }
      saveMemory();
    }

    return savedId;
  } catch (err) {
    console.warn(`Supabase client save failed for ${entity}, performing local state save instead:`, err);
    localStorage.setItem(`supabase_failed_${entity}`, "true");
    
    // Fallback to local memory DB
    if (entity === "bom_recipes" && materialsToSave !== null) {
      cleanData.materials = materialsToSave;
    }
    if (entity === "purchase_orders" && itemsToSave !== null) {
      cleanData.items = itemsToSave;
    }

    if (id > 0) {
      const idx = (memoryDB as any)[entity].findIndex((item: any) => item.id === id);
      if (idx >= 0) {
        (memoryDB as any)[entity][idx] = { ...(memoryDB as any)[entity][idx], ...cleanData };
      }
    } else {
      const maxId = (memoryDB as any)[entity].reduce((max: number, item: any) => item.id > max ? item.id : max, 0);
      const newId = maxId + 1;
      const newItem = { id: newId, ...cleanData };
      if (entity === "customers") {
        (memoryDB as any)[entity].unshift(newItem);
      } else {
        (memoryDB as any)[entity].push(newItem);
      }
      saveMemory();
      return newId;
    }
    saveMemory();
    return id;
  }
}

export async function clientDelete(entity: string, id: number): Promise<boolean> {
  const table = entity;
  try {
    if (entity === "bom_recipes") {
      await supabase.from("bom_items").delete().eq("bom_id", id);
    }
    if (entity === "purchase_orders") {
      await supabase.from("purchase_order_items").delete().eq("purchase_order_id", id);
    }
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
    if ((memoryDB as any)[entity]) {
      (memoryDB as any)[entity] = (memoryDB as any)[entity].filter((item: any) => item.id !== id);
      saveMemory();
    }
    return true;
  } catch (err) {
    console.warn(`Supabase client delete failed for ${entity}, deleting from local memory instead:`, err);
    localStorage.setItem(`supabase_failed_${entity}`, "true");
    if ((memoryDB as any)[entity]) {
      (memoryDB as any)[entity] = (memoryDB as any)[entity].filter((item: any) => item.id !== id);
      saveMemory();
    }
    return true;
  }
}
