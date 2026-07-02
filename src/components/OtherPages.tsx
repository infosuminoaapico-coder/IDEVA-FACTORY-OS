import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Boxes, 
  Calendar, 
  ArrowRight, 
  X, 
  Save, 
  FileText, 
  Truck, 
  Package, 
  ShoppingCart, 
  ShieldAlert,
  Download,
  Activity,
  UserCheck,
  Coins,
  TrendingUp,
  Printer,
  Filter,
  BarChart3,
  Layers,
  Users,
  Warehouse
} from "lucide-react";
import { 
  Precheck, 
  ProductionOrder, 
  Product, 
  Customer, 
  PackingOrder, 
  PurchaseOrder, 
  RawMaterial, 
  Grn, 
  InventoryPack 
} from "../types";

// ============================================================================
// PRECHECK PAGE
// ============================================================================
interface PrecheckPageProps {
  prechecks: Precheck[];
  onAddPrecheck: (precheck: any) => Promise<void>;
}
export function PrecheckPage({ prechecks, onAddPrecheck }: PrecheckPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [material, setMaterial] = useState("");
  const [lot, setLot] = useState("");
  const [expiry, setExpiry] = useState("");
  const [inspector, setInspector] = useState("ดร.สุภา");
  const [result, setResult] = useState("pass");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!material.trim() || !lot.trim()) return;
    await onAddPrecheck({ material, lot, expiry, inspector, result });
    setIsModalOpen(false);
    setMaterial("");
    setLot("");
    setExpiry("");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-emerald-600" /> รายการตรวจวิเคราะห์ก่อนผลิต (COA / QC)
        </h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> บันทึกใบวิเคราะห์สาร
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                <th className="p-3">วันที่ตรวจ</th>
                <th className="p-3">ชื่อสารเคมี</th>
                <th className="p-3">Lot Number</th>
                <th className="p-3">วันหมดอายุ</th>
                <th className="p-3">ผู้บันทึกตรวจ</th>
                <th className="p-3">ผลวิเคราะห์ (QC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prechecks.map((p) => (
                <tr key={p.id}>
                  <td className="p-3 text-slate-400">{p.date}</td>
                  <td className="p-3 font-semibold text-slate-800">{p.material}</td>
                  <td className="p-3 font-mono font-medium">{p.lot}</td>
                  <td className="p-3 text-slate-500">{p.expiry || "-"}</td>
                  <td className="p-3 font-medium text-slate-700">{p.inspector}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      p.result === "pass"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : p.result === "fail"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {p.result === "pass" ? "🟢 ผ่านเกณฑ์" : p.result === "fail" ? "🔴 ไม่ผ่านเกณฑ์" : "🟡 รอตรวจสอบ"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800">บันทึกผลตรวจสอบทางเคมี (Pre-QC)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ชื่อเคมีภัณฑ์</label>
                <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} required placeholder="เช่น Ethanol 96%, NaOH" className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Lot Number</label>
                  <input type="text" value={lot} onChange={(e) => setLot(e.target.value)} required placeholder="L260701" className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">วันหมดอายุสาร</label>
                  <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">เจ้าหน้าที่ตรวจ</label>
                  <input type="text" value={inspector} onChange={(e) => setInspector(e.target.value)} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ผลการทดสอบ QC</label>
                  <select value={result} onChange={(e) => setResult(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white">
                    <option value="pass">🟢 ผ่านเกณฑ์มาตรฐาน (Pass)</option>
                    <option value="pending">🟡 กักรอประเมินผล (Pending)</option>
                    <option value="fail">🔴 ตกเกณฑ์/ไม่อนุมัติ (Fail)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 bg-white border rounded-lg text-xs">ยกเลิก</button>
                <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">บันทึกตรวจสาร</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PRODUCTION ORDERS PAGE
// ============================================================================
interface ProductionPageProps {
  productionOrders: ProductionOrder[];
  products: Product[];
  customers: Customer[];
  onSaveProduction: (po: any) => Promise<void>;
  onDeleteProduction: (id: number) => Promise<void>;
}
export function ProductionPage({ 
  productionOrders, 
  products, 
  customers, 
  onSaveProduction, 
  onDeleteProduction 
}: ProductionPageProps) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const [code, setCode] = useState("");
  const [customerId, setCustomerId] = useState<number | "">("");
  const [productId, setProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("ลิตร");
  const [staff, setStaff] = useState("สมชาย ใจดี");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");

  const filtered = productionOrders.filter(po => {
    const q = search.toLowerCase();
    const matchesSearch = po.code.toLowerCase().includes(q) ||
      (po.product_name || "").toLowerCase().includes(q) ||
      (po.customer_name || "").toLowerCase().includes(q) ||
      (po.staff || "").toLowerCase().includes(q);
    
    const matchesStatus = statusFilter === "all" || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openFormModal = () => {
    const num = productionOrders.length + 1;
    setCode(`PO-2026-${String(num).padStart(4, "0")}`);
    setCustomerId("");
    setProductId("");
    setQuantity(500);
    setUnit("ลิตร");
    setStaff("สมชาย ใจดี");
    setStatus("pending");
    setDueDate(new Date(Date.now() + 5*24*60*60*1000).toISOString().slice(0, 10));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !productId || !quantity) return;
    await onSaveProduction({
      id: 0,
      code,
      customer_id: Number(customerId),
      product_id: Number(productId),
      quantity,
      unit,
      status,
      due_date: dueDate,
      staff,
      date: new Date().toISOString().slice(0, 10)
    });
    setIsModalOpen(false);
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "done":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">ผลิตเสร็จ</span>;
      case "running":
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">กำลังผลิต</span>;
      case "pending":
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">รอผลิต</span>;
      default:
        return <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-bold">ยกเลิก</span>;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {["all", "pending", "running", "done", "cancelled"].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                statusFilter === st 
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {st === "all" ? "ทั้งหมด" : st === "pending" ? "รอผลิต" : st === "running" ? "กำลังผลิต" : st === "done" ? "ผลิตเสร็จ" : "ยกเลิก"}
            </button>
          ))}
        </div>
        <button
          onClick={openFormModal}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> สร้างใบสั่งผลิต
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่, ชื่อลูกค้า, หรือชื่อสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                <th className="p-3">เลขที่</th>
                <th className="p-3">วันที่เริ่ม</th>
                <th className="p-3">ลูกค้า / แบรนด์</th>
                <th className="p-3">สินค้าที่สั่งผลิต</th>
                <th className="p-3">จำนวนผลิต</th>
                <th className="p-3">ผู้รับผิดชอบ</th>
                <th className="p-3">วันกำหนดส่ง</th>
                <th className="p-3">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(po => (
                <tr key={po.id}>
                  <td className="p-3 font-bold font-mono text-blue-600">{po.code}</td>
                  <td className="p-3 text-slate-400">{po.date}</td>
                  <td className="p-3 font-semibold text-slate-800">{po.customer_name || "ไม่ได้ระบุ"}</td>
                  <td className="p-3 text-slate-700 font-medium">{po.product_name || "ไม่ได้ระบุ"}</td>
                  <td className="p-3 font-semibold font-mono">{po.quantity.toLocaleString()} {po.unit}</td>
                  <td className="p-3 font-medium text-slate-600">{po.staff}</td>
                  <td className="p-3 text-indigo-600 font-medium">{po.due_date}</td>
                  <td className="p-3">{getStatusBadge(po.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800">ออกใบสั่งประกอบการผลิต (Production Work Order)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">เลขที่ใบสั่ง</label>
                  <input type="text" value={code} readonly className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold bg-slate-50" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ผู้รับผิดชอบคุมถังผสม</label>
                  <input type="text" value={staff} onChange={(e) => setStaff(e.target.value)} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">เลือกแบรนด์ลูกค้า</label>
                  <select value={customerId} onChange={(e) => setCustomerId(Number(e.target.value))} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white">
                    <option value="">-- กรุณาเลือกลูกค้า --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">เลือกผลิตภัณฑ์</label>
                  <select value={productId} onChange={(e) => setProductId(Number(e.target.value))} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white">
                    <option value="">-- เลือกรหัสสินค้า --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">จำนวนสั่งผลิต</label>
                  <input type="number" value={quantity || ""} onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-right" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">หน่วยตวง</label>
                  <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">กำหนดเสร็จส่ง</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 bg-white border rounded-lg text-xs">ยกเลิก</button>
                <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">เปิดใบสั่งผลิต</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PACKING PAGE
// ============================================================================
interface PackingPageProps {
  packingOrders: PackingOrder[];
  onAddPacking: (pk: any) => Promise<void>;
}
export function PackingPage({ packingOrders, onAddPacking }: PackingPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [poCode, setPoCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("ขวด");
  const [status, setStatus] = useState("pending");

  const openFormModal = () => {
    setCode(`PK-2026-${String(packingOrders.length + 1).padStart(4, "0")}`);
    setItemName("");
    setPoCode("PO-2026-0055");
    setQuantity(500);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !quantity) return;
    await onAddPacking({
      code,
      production_order_id: 1, // linked
      item_name: itemName,
      quantity,
      unit,
      status
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Boxes className="w-4 h-4 text-indigo-600" /> ตารางสั่งบรรจุขวดและหีบห่อ (Packaging Lines)
        </h3>
        <button onClick={openFormModal} className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> ออกใบสั่งบรรจุ
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                <th className="p-3">รหัสใบสั่งบรรจุ</th>
                <th className="p-3">เลขอ้างอิงใบผลิต</th>
                <th className="p-3">ชื่อสินค้า/ขวดบรรจุ</th>
                <th className="p-3 text-right">จำนวนผลิตบรรจุ</th>
                <th className="p-3 text-center">หน่วย</th>
                <th className="p-3">สถานะไลน์บรรจุ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {packingOrders.map(p => (
                <tr key={p.id}>
                  <td className="p-3 font-bold font-mono text-slate-800">{p.code}</td>
                  <td className="p-3 font-mono text-slate-500">PO-2026-005{p.production_order_id + 3}</td>
                  <td className="p-3 font-semibold text-slate-800">{p.item_name}</td>
                  <td className="p-3 text-right font-bold font-mono text-blue-600">{p.quantity.toLocaleString()}</td>
                  <td className="p-3 text-center text-slate-500">{p.unit}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === "done" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : p.status === "running"
                          ? "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse"
                          : "bg-slate-50 text-slate-600 border border-slate-200"
                    }`}>
                      {p.status === "done" ? "เสร็จสิ้น" : p.status === "running" ? "กำลังบรรจุ" : "รอดำเนินการ"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800">ออกใบสั่งทำงานไลนบรรจุภัณฑ์</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">รหัสใบสั่ง</label>
                  <input type="text" value={code} readonly className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">อ้างอิงใบสั่งผลิต (PO)</label>
                  <input type="text" value={poCode} onChange={(e) => setPoCode(e.target.value)} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ชื่อสินค้า/รูปแบบภาชนะบรรจุ</label>
                <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required placeholder="เช่น ขวด HDPE ขนาด 1 ลิตร ตราแบรนด์ A" className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">จำนวนบรรจุ</label>
                  <input type="number" value={quantity || ""} onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-right" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">หน่วยนับ</label>
                  <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">สถานะ</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white">
                  <option value="pending">รอดำเนินการ (Pending)</option>
                  <option value="running">กำลังทำงานบรรจุขวด (Running)</option>
                  <option value="done">บรรจุครบเสร็จสิ้น (Done)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 bg-white border rounded-lg text-xs">ยกเลิก</button>
                <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">เปิดใบงานบรรจุ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PURCHASE PAGE (ORDERS)
// ============================================================================
interface PurchasePageProps {
  purchaseOrders: PurchaseOrder[];
  rawMaterials: RawMaterial[];
  onAddPurchase: (po: any) => Promise<void>;
}
export function PurchasePage({ purchaseOrders, rawMaterials, onAddPurchase }: PurchasePageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [supplier, setSupplier] = useState("");
  const [materialId, setMaterialId] = useState<number | "">("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  const openFormModal = () => {
    setCode(`PRM-2026-${String(purchaseOrders.length + 22).padStart(4, "0")}`);
    setSupplier("");
    setMaterialId("");
    setQuantity(100);
    setPrice(50);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier.trim() || !materialId || !quantity) return;
    const selectedMat = rawMaterials.find(rm => rm.id === Number(materialId));
    
    await onAddPurchase({
      code,
      supplier,
      order_date: new Date().toISOString().slice(0, 10),
      status: "pending",
      total_amount: quantity * price,
      items: [
        {
          raw_material_id: Number(materialId),
          item_name: selectedMat ? selectedMat.name : "",
          quantity,
          unit: selectedMat ? selectedMat.unit : "ลิตร",
          unit_price: price,
          subtotal: quantity * price
        }
      ]
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <ShoppingCart className="w-4 h-4 text-indigo-600" /> รายการสั่งซื้อเคมีภัณฑ์และส่วนผสม
        </h3>
        <button onClick={openFormModal} className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> บันทึกใบสั่งซื้อใหม่
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                <th className="p-3">เลขที่ใบสั่งซื้อ</th>
                <th className="p-3">ผู้จำหน่าย (Supplier)</th>
                <th className="p-3">วัตถุดิบเคมีที่ซื้อ</th>
                <th className="p-3 text-right">จำนวนซื้อ</th>
                <th className="p-3 text-right">ยอดเงินรวม</th>
                <th className="p-3">วันที่เปิดใบซื้อ</th>
                <th className="p-3">สถานะตรวจรับเข้าคลัง</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {purchaseOrders.map(p => {
                const item = p.items?.[0] || { item_name: "เคมีภัณฑ์ย่อย", quantity: p.qty || 0, unit: "หน่วย", subtotal: p.total_amount || 0 };
                return (
                  <tr key={p.id}>
                    <td className="p-3 font-bold font-mono text-slate-800">{p.code}</td>
                    <td className="p-3 font-semibold text-slate-800">{p.supplier}</td>
                    <td className="p-3 text-slate-600 font-medium">{item.item_name}</td>
                    <td className="p-3 text-right font-semibold font-mono">{item.quantity.toLocaleString()} {item.unit}</td>
                    <td className="p-3 text-right font-bold font-mono text-indigo-600">฿{p.total_amount.toLocaleString()}</td>
                    <td className="p-3 text-slate-400">{p.order_date}</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === "received"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : p.status === "transit"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                      }`}>
                        {p.status === "received" ? "รับสินค้าเข้าสต็อกแล้ว" : p.status === "transit" ? "อยู่ระหว่างจัดส่ง" : "รอกลุ่มรับของ (GRN)"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in duration-100">
            <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800">สร้างใบส่งสั่งซื้อสารตั้งต้น (PO Chemicals)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">เลข PO จัดซื้อ</label>
                  <input type="text" value={code} readonly className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 font-mono font-bold text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">บริษัทผู้ขาย (Supplier)</label>
                  <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} required placeholder="ระบุบริษัทเคมีภัณฑ์" className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">วัตถุดิบสารเคมีที่ต้องการสั่งซื้อ</label>
                <select value={materialId} onChange={(e) => setMaterialId(Number(e.target.value))} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white">
                  <option value="">-- กรุณาเลือกสารเคมี --</option>
                  {rawMaterials.map(rm => (
                    <option key={rm.id} value={rm.id}>{rm.code} - {rm.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">จำนวนสั่งซื้อ</label>
                  <input type="number" value={quantity || ""} onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-right" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ราคาซื้อต่อหน่วย (บาท)</label>
                  <input type="number" value={price || ""} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-right" />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 bg-white border rounded-lg text-xs">ยกเลิก</button>
                <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">เปิดใบจัดซื้อเคมี</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GOODS RECEIVE NOTE (GRN) PAGE
// ============================================================================
interface GrnsPageProps {
  grns: Grn[];
  rawMaterials: RawMaterial[];
  purchaseOrders: PurchaseOrder[];
  onAddGrn: (grn: any) => Promise<void>;
}
export function GrnsPage({ grns, rawMaterials, purchaseOrders, onAddGrn }: GrnsPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [purchaseOrderId, setPurchaseOrderId] = useState<number | "">("");
  const [materialId, setMaterialId] = useState<number | "">("");
  const [receivedQty, setReceivedQty] = useState(0);
  const [lotNumber, setLotNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [receiver, setReceiver] = useState("สมศักดิ์ คลังสินค้า");

  const openFormModal = () => {
    setCode(`GRN-2026-${String(grns.length + 19).padStart(4, "0")}`);
    setPurchaseOrderId("");
    setMaterialId("");
    setReceivedQty(100);
    setLotNumber(`L${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-001`);
    setExpiryDate(new Date(Date.now() + 365*2*24*60*60*1000).toISOString().slice(0, 10));
    setIsModalOpen(true);
  };

  const handlePurchaseOrderChange = (poId: number) => {
    setPurchaseOrderId(poId);
    const matchedPo = purchaseOrders.find(po => po.id === poId);
    if (matchedPo && matchedPo.items && matchedPo.items.length > 0) {
      const firstItem = matchedPo.items[0];
      setMaterialId(firstItem.raw_material_id);
      setReceivedQty(firstItem.quantity);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseOrderId || !materialId || !receivedQty || !lotNumber.trim()) return;
    
    await onAddGrn({
      code,
      purchase_order_id: Number(purchaseOrderId),
      raw_material_id: Number(materialId),
      lot_number: lotNumber,
      expiry_date: expiryDate,
      received_qty: receivedQty,
      receiver,
      receive_date: new Date().toISOString().slice(0, 10)
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center gap-3">
        <div className="p-2 bg-emerald-500 rounded-lg text-white">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <strong className="text-emerald-800">ระบบสร้างล๊อตผลิตคลังอัตโนมัติ (Automated Inventory GRN Lot Generator)</strong>
          <p className="text-emerald-600 font-sans mt-0.5">เมื่อบันทึกการรับเข้า (GRN) สต็อกคงคลังในวัตถุดิบเคมีจะเพิ่มขึ้น และล๊อตผลิตจะถูกบันทึกเพื่อตรวจสอบความย้อนกลับของสาร (Traceability)</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-emerald-600" /> บันทึกรับเคมีภัณฑ์เข้าคลัง (Goods Receive Note)
        </h3>
        <button onClick={openFormModal} className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> บันทึกใบรับเข้า (GRN)
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                <th className="p-3">เลขที่ GRN</th>
                <th className="p-3">อ้างอิงใบสั่งซื้อ PO</th>
                <th className="p-3">ชื่อวัตถุดิบเคมี</th>
                <th className="p-3 text-right">จำนวนรับเข้า</th>
                <th className="p-3">Lot Number รับเข้า</th>
                <th className="p-3">วันหมดอายุล๊อต</th>
                <th className="p-3">ผู้เซ็นต์รับเข้า</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {grns.map(g => {
                const mat = rawMaterials.find(rm => rm.id === g.raw_material_id);
                const po = purchaseOrders.find(p => p.id === g.purchase_order_id);
                return (
                  <tr key={g.id}>
                    <td className="p-3 font-bold font-mono text-emerald-600">{g.code}</td>
                    <td className="p-3 font-mono text-slate-500">{po ? po.code : `PRM-2026-002${g.purchase_order_id}`}</td>
                    <td className="p-3 font-semibold text-slate-800">{mat ? mat.name : "เคมีภัณฑ์ย่อย"}</td>
                    <td className="p-3 text-right font-bold font-mono text-blue-600">{g.received_qty.toLocaleString()} {mat ? mat.unit : "ลิตร"}</td>
                    <td className="p-3 font-mono text-slate-700 font-semibold">{g.lot_number}</td>
                    <td className="p-3 text-red-600 font-medium">{g.expiry_date}</td>
                    <td className="p-3 font-medium text-slate-600">{g.receiver}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in duration-100">
            <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800">บันทึกตรวจรับของเข้าคลังวัตถุดิบ (GRN Entry)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">เลขใบรับ GRN</label>
                  <input type="text" value={code} readonly className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 font-mono font-bold text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">อ้างอิงใบ PO สั่งจัดซื้อ</label>
                  <select value={purchaseOrderId} onChange={(e) => handlePurchaseOrderChange(Number(e.target.value))} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white font-mono font-bold">
                    <option value="">-- เลือกใบ PO --</option>
                    {purchaseOrders.map(po => (
                      <option key={po.id} value={po.id}>{po.code} - {po.supplier}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">เคมีภัณฑ์ที่ส่งมอบ</label>
                  <select value={materialId} onChange={(e) => setMaterialId(Number(e.target.value))} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white">
                    <option value="">-- เลือกรายการเคมี --</option>
                    {rawMaterials.map(rm => (
                      <option key={rm.id} value={rm.id}>{rm.code} - {rm.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">จำนวนที่รับจริง</label>
                  <input type="number" value={receivedQty || ""} onChange={(e) => setReceivedQty(parseFloat(e.target.value) || 0)} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-right" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">กำหนด Lot Number</label>
                  <input type="text" value={lotNumber} onChange={(e) => setLotNumber(e.target.value)} required placeholder="L260701-001" className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">วันหมดอายุของเคมี</label>
                  <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ผู้เซ็นต์ตรวจรับสินค้า</label>
                <input type="text" value={receiver} onChange={(e) => setReceiver(e.target.value)} required className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 bg-white border rounded-lg text-xs">ยกเลิก</button>
                <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">บันทึกรับของเข้าระบบ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// INVENTORY STORAGE PAGE
// ============================================================================
interface InventoryPageProps {
  rawMaterials: RawMaterial[];
  inventoryPacks: InventoryPack[];
  productionOrders: ProductionOrder[];
}
export function InventoryPage({ rawMaterials, inventoryPacks, productionOrders }: InventoryPageProps) {
  const [activeTab, setActiveTab] = useState("raw");

  // Calculate Finished Goods stocks based on completed Production orders
  const finishedGoods = productionOrders
    .filter(po => po.status === "done")
    .reduce((acc: any[], po) => {
      const existing = acc.find(item => item.product_id === po.product_id);
      if (existing) {
        existing.qty += po.quantity;
      } else {
        acc.push({
          id: po.product_id,
          product_id: po.product_id,
          code: po.product_code || `FG-${String(po.product_id).padStart(3, "0")}`,
          name: po.product_name,
          qty: po.quantity,
          unit: po.unit,
          lot: `LOT-${po.code.split("-").pop()}`
        });
      }
      return acc;
    }, []);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Tab controls */}
      <div className="flex border-b border-slate-200">
        {[
          { id: "raw", label: "วัตถุดิบเคมีดิบ" },
          { id: "pack", label: "บรรจุภัณฑ์ (HDPE/ฉลาก)" },
          { id: "fg", label: "ผลิตภัณฑ์สำเร็จรูป (Finished Goods)" }
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => setActiveTab(tb.id)}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 -mb-[2px] cursor-pointer ${
              activeTab === tb.id
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {activeTab === "raw" && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                  <th className="p-3">รหัสเคมีดิบ</th>
                  <th className="p-3">ชื่อสารสกัดเคมี</th>
                  <th className="p-3 text-right">จำนวนคงคลัง</th>
                  <th className="p-3 text-center">หน่วยนับ</th>
                  <th className="p-3 text-right">จำนวนขั้นต่ำปลอดภัย</th>
                  <th className="p-3 text-center">ระดับสถานะสต็อก</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {rawMaterials.map(rm => {
                  const isLow = rm.stock_qty <= rm.min_stock;
                  return (
                    <tr key={rm.id}>
                      <td className="p-3 font-bold font-mono text-slate-800">{rm.code}</td>
                      <td className="p-3 font-semibold text-slate-800">{rm.name}</td>
                      <td className="p-3 text-right font-bold font-mono">{rm.stock_qty.toLocaleString()}</td>
                      <td className="p-3 text-center text-slate-500">{rm.unit}</td>
                      <td className="p-3 text-right font-mono text-slate-400">{rm.min_stock}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isLow 
                            ? "bg-red-50 text-red-700 border border-red-200 animate-pulse" 
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {isLow ? "🔴 ต่ำกว่าเกณฑ์เตือนภัย" : "🟢 ระดับสต็อกปลอดภัย"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "pack" && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                  <th className="p-3">รหัสพัสดุ</th>
                  <th className="p-3">หมวดหมู่</th>
                  <th className="p-3">ชื่อบรรจุภัณฑ์/หีบห่อ</th>
                  <th className="p-3 text-right">คงคลังคงเหลือ</th>
                  <th className="p-3 text-center">หน่วยนับ</th>
                  <th className="p-3 text-center">ระดับสถานะสต็อก</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {inventoryPacks.map(ip => (
                  <tr key={ip.id}>
                    <td className="p-3 font-bold font-mono text-slate-800">{ip.code}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-bold font-sans">{ip.type}</span></td>
                    <td className="p-3 font-semibold text-slate-800">{ip.name}</td>
                    <td className="p-3 text-right font-bold font-mono">{ip.qty.toLocaleString()}</td>
                    <td className="p-3 text-center text-slate-500">{ip.unit}</td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">🟢 มีสินค้าพร้อมใช้</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "fg" && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                  <th className="p-3">รหัสสินค้าสำเร็จรูป</th>
                  <th className="p-3">ชื่อผลิตภัณฑ์สำเร็จรูป</th>
                  <th className="p-3 text-right">จำนวนคลังสินค้า</th>
                  <th className="p-3 text-center">หน่วยนับ</th>
                  <th className="p-3 text-center">ล๊อตที่ผลิตเสร็จ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {finishedGoods.map(fg => (
                  <tr key={fg.id}>
                    <td className="p-3 font-bold font-mono text-slate-800">{fg.code}</td>
                    <td className="p-3 font-semibold text-slate-800">{fg.name}</td>
                    <td className="p-3 text-right font-bold font-mono text-blue-600">{fg.qty.toLocaleString()}</td>
                    <td className="p-3 text-center text-slate-500">{fg.unit}</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-700 font-mono text-[10px] font-bold">{fg.lot}</span></td>
                  </tr>
                ))}
                {finishedGoods.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      ยังไม่มีผลิตภัณฑ์สำเร็จรูปส่งเข้ามาคลังสินค้าสำเร็จรูป
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// REPORTS PAGE
// ============================================================================
interface ReportPageProps {
  productionOrders: ProductionOrder[];
  purchaseOrders: PurchaseOrder[];
  rawMaterials: RawMaterial[];
  products: Product[];
  customers: Customer[];
  grns: Grn[];
  packingOrders: PackingOrder[];
  prechecks: Precheck[];
}

export function ReportPage({
  productionOrders = [],
  purchaseOrders = [],
  rawMaterials = [],
  products = [],
  customers = [],
  grns = [],
  packingOrders = [],
  prechecks = []
}: ReportPageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "production" | "purchase">("overview");
  const [dateRange, setDateRange] = useState<"all" | "this_month" | "last_30">("all");

  // Helper to check if record falls within date range
  const filterByDateRange = (dateStr: string | undefined) => {
    if (!dateStr) return true;
    if (dateRange === "all") return true;

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return true;

    const now = new Date();
    if (dateRange === "this_month") {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
    if (dateRange === "last_30") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return d >= thirtyDaysAgo;
    }
    return true;
  };

  // Filtered datasets
  const filteredProdOrders = productionOrders.filter(o => filterByDateRange(o.date || o.created_at));
  const filteredPurchOrders = purchaseOrders.filter(o => filterByDateRange(o.order_date));
  const filteredGrns = grns.filter(o => filterByDateRange(o.receive_date));
  const filteredPrechecks = prechecks.filter(o => filterByDateRange(o.date));

  // --- Calculations for Overview Report ---
  const totalProductionCount = filteredProdOrders.length;
  const totalProductionQty = filteredProdOrders.reduce((sum, o) => sum + (Number(o.quantity) || 0), 0);
  const totalPurchaseSpending = filteredPurchOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  
  // QC Precheck pass rate
  const passedPrechecksCount = filteredPrechecks.filter(p => p.result === "pass").length;
  const qcPassRate = filteredPrechecks.length > 0 
    ? Math.round((passedPrechecksCount / filteredPrechecks.length) * 100) 
    : 100;

  // Stock status count
  const lowStockCount = rawMaterials.filter(m => m.stock_qty <= m.min_stock).length;

  // --- Production Report aggregation ---
  const prodStatusCount = filteredProdOrders.reduce((acc, o) => {
    const status = o.status || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Production Volume by Product
  const prodByProduct = filteredProdOrders.reduce((acc, o) => {
    const name = o.product_name || o.product_code || "ไม่ระบุสินค้า";
    acc[name] = (acc[name] || 0) + (Number(o.quantity) || 0);
    return acc;
  }, {} as Record<string, number>);

  const prodByProductList = Object.entries(prodByProduct)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty);

  const maxProdQty = prodByProductList.length > 0 ? Math.max(...prodByProductList.map(item => item.qty)) : 1;

  // Production Volume by Customer
  const prodByCustomer = filteredProdOrders.reduce((acc, o) => {
    const name = o.customer_name || "ทั่วไป / ไม่มีแบรนด์";
    acc[name] = (acc[name] || 0) + (Number(o.quantity) || 0);
    return acc;
  }, {} as Record<string, number>);

  const prodByCustomerList = Object.entries(prodByCustomer)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5); // top 5 customers

  // --- Purchase Report aggregation ---
  const purchStatusCount = filteredPurchOrders.reduce((acc, o) => {
    const status = o.status || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Spending by Supplier
  const spendingBySupplier = filteredPurchOrders.reduce((acc, o) => {
    const supplier = o.supplier || "ไม่ระบุผู้จำหน่าย";
    acc[supplier] = (acc[supplier] || 0) + (Number(o.total_amount) || 0);
    return acc;
  }, {} as Record<string, number>);

  const supplierSpendingList = Object.entries(spendingBySupplier)
    .map(([name, val]) => ({ name, val }))
    .sort((a, b) => b.val - a.val);

  const maxSupplierSpending = supplierSpendingList.length > 0 ? Math.max(...supplierSpendingList.map(item => item.val)) : 1;

  // Top purchased raw materials
  const purchasedMaterials = filteredPurchOrders.reduce((acc, o) => {
    if (Array.isArray(o.items)) {
      o.items.forEach(item => {
        const name = item.item_name || "ไม่ทราบชื่อวัตถุดิบ";
        acc[name] = (acc[name] || 0) + (Number(item.subtotal) || (Number(item.quantity) * Number(item.unit_price)) || 0);
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const purchasedMaterialsList = Object.entries(purchasedMaterials)
    .map(([name, cost]) => ({ name, cost }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  // CSV Exporters
  const exportProductionCSV = () => {
    const headers = [
      "รหัสใบสั่งผลิต",
      "ลูกค้า/แบรนด์",
      "ผลิตภัณฑ์",
      "จำนวนผลิต",
      "หน่วยนับ",
      "สถานะ",
      "วันที่สั่งผลิต",
      "กำหนดเสร็จ"
    ];
    const data = filteredProdOrders.map(o => [
      o.code,
      o.customer_name || "-",
      o.product_name || o.product_code || "-",
      o.quantity,
      o.unit || "ชิ้น",
      o.status === "completed" ? "เสร็จสมบูรณ์" : o.status === "in_progress" ? "กำลังผลิต" : "รอดำเนินการ",
      o.date || "-",
      o.due_date || "-"
    ]);
    exportToCSV(data, headers, `รายงานคำสั่งผลิต_กรอง_${dateRange}`);
  };

  const exportPurchaseCSV = () => {
    const headers = [
      "รหัสใบสั่งซื้อ",
      "ผู้จัดจำหน่าย (Supplier)",
      "มูลค่าจัดซื้อ (บาท)",
      "สถานะ",
      "วันที่จัดซื้อ"
    ];
    const data = filteredPurchOrders.map(o => [
      o.code,
      o.supplier,
      o.total_amount,
      o.status === "received" ? "รับของแล้ว" : o.status === "completed" ? "เสร็จสิ้น" : "รอรับของ/ค้างส่ง",
      o.order_date || "-"
    ]);
    exportToCSV(data, headers, `รายงานการจัดซื้อวัตถุดิบ_กรอง_${dateRange}`);
  };

  const exportStockCSV = () => {
    const headers = [
      "รหัสวัตถุดิบ",
      "ชื่อวัตถุดิบเคมีภัณฑ์",
      "ปริมาณคงเหลือ",
      "ระดับปลอดภัยขั้นต่ำ",
      "หน่วยนับ",
      "สถานะสต็อก"
    ];
    const data = rawMaterials.map(m => [
      m.code,
      m.name,
      m.stock_qty,
      m.min_stock,
      m.unit,
      m.stock_qty <= m.min_stock ? "ต่ำกว่าเกณฑ์ขั้นต่ำ (วิกฤต)" : "ปกติ"
    ]);
    exportToCSV(data, headers, `รายงานสถานะสต็อกวัตถุดิบ`);
  };

  const exportToCSV = (data: any[], headers: string[], fileName: string) => {
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...data.map(row => row.map((val: any) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Date Selector */}
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight font-sans">📊 ระบบรายงานและสถิติวิเคราะห์</h2>
          <p className="text-xs text-slate-500 mt-0.5">วิเคราะห์สถิติสรุปยอดการประกอบการผลิตและรายงานการจัดซื้อวัตถุดิบเรียลไทม์</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter Tabs */}
          <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setDateRange("all")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${dateRange === "all" ? "bg-white text-blue-600 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"}`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setDateRange("this_month")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${dateRange === "this_month" ? "bg-white text-blue-600 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"}`}
            >
              เดือนนี้
            </button>
            <button
              onClick={() => setDateRange("last_30")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${dateRange === "last_30" ? "bg-white text-blue-600 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"}`}
            >
              30 วันที่ผ่านมา
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all print:hidden"
            title="พิมพ์รายงาน"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">พิมพ์</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Selection */}
      <div className="flex border-b border-slate-200 bg-white px-4 pt-2 rounded-t-2xl border-t border-x border-slate-200 shadow-sm print:hidden">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${activeTab === "overview" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          <Layers className="w-4 h-4" /> รายงานสรุปภาพรวม
        </button>
        <button
          onClick={() => setActiveTab("production")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${activeTab === "production" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          <FileText className="w-4 h-4" /> รายงานการผลิต (Production)
        </button>
        <button
          onClick={() => setActiveTab("purchase")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${activeTab === "purchase" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          <ShoppingCart className="w-4 h-4" /> รายงานการซื้อ (Purchasing)
        </button>
      </div>

      {/* OVERVIEW REPORT TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ใบสั่งผลิตรวม</span>
                <span className="text-xl font-extrabold text-slate-800 font-mono block mt-0.5">{totalProductionCount.toLocaleString()} ใบ</span>
                <span className="text-[10px] text-slate-500 block">ปริมาณ: {totalProductionQty.toLocaleString()} กก.</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">งบประมาณจัดซื้อวัตถุดิบ</span>
                <span className="text-xl font-extrabold text-emerald-600 font-mono block mt-0.5">฿{totalPurchaseSpending.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block">จากคำสั่งซื้อ {filteredPurchOrders.length} รายการ</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">อัตราตรวจวิเคราะห์ผ่าน (QC)</span>
                <span className="text-xl font-extrabold text-indigo-600 font-mono block mt-0.5">{qcPassRate}%</span>
                <span className="text-[10px] text-slate-500 block">วิเคราะห์ {filteredPrechecks.length} รายการเคมี</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${lowStockCount > 0 ? "bg-red-50 text-red-600 animate-pulse" : "bg-slate-50 text-slate-50"}`}>
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">สารเคมีสต็อกต่ำกว่าเกณฑ์</span>
                <span className={`text-xl font-extrabold block mt-0.5 font-mono ${lowStockCount > 0 ? "text-red-600 font-bold" : "text-slate-800"}`}>
                  {lowStockCount} สาร
                </span>
                <span className="text-[10px] text-slate-500 block">จากสารเคมีทั้งหมด {rawMaterials.length} ชนิด</span>
              </div>
            </div>
          </div>

          {/* Quick Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Production Orders Status Distribution Chart */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-blue-600" /> สัดส่วนสถานะใบสั่งประกอบการผลิต
                </h3>
                <span className="text-[10px] font-bold text-slate-400">ข้อมูลที่กรอง</span>
              </div>
              
              <div className="space-y-3.5 pt-2">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>เสร็จสมบูรณ์ (Completed)</span>
                    <span className="font-mono font-bold text-emerald-600">{(prodStatusCount.completed || 0)} / {totalProductionCount} ใบ</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${totalProductionCount > 0 ? ((prodStatusCount.completed || 0) / totalProductionCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>กำลังประกอบการผลิต (In Progress)</span>
                    <span className="font-mono font-bold text-blue-600">{(prodStatusCount.in_progress || 0)} / {totalProductionCount} ใบ</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${totalProductionCount > 0 ? ((prodStatusCount.in_progress || 0) / totalProductionCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>รอดำเนินการ (Pending)</span>
                    <span className="font-mono font-bold text-amber-600">{(prodStatusCount.pending || 0)} / {totalProductionCount} ใบ</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${totalProductionCount > 0 ? ((prodStatusCount.pending || 0) / totalProductionCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Purchasing Distribution By Status */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4 text-emerald-600" /> สถานะใบสั่งจัดซื้อเคมีภัณฑ์
                </h3>
                <span className="text-[10px] font-bold text-slate-400">ข้อมูลที่กรอง</span>
              </div>

              <div className="space-y-3.5 pt-2">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>รับสินค้าเข้าคลังสำเร็จแล้ว (Received / Completed)</span>
                    <span className="font-mono font-bold text-emerald-600">{(purchStatusCount.received || purchStatusCount.completed || 0)} / {filteredPurchOrders.length} ใบ</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${filteredPurchOrders.length > 0 ? (((purchStatusCount.received || 0) + (purchStatusCount.completed || 0)) / filteredPurchOrders.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>รอดำเนินการ / ค้างส่ง (Pending)</span>
                    <span className="font-mono font-bold text-amber-600">{(purchStatusCount.pending || purchStatusCount.issued || 0)} / {filteredPurchOrders.length} ใบ</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${filteredPurchOrders.length > 0 ? (((purchStatusCount.pending || 0) + (purchStatusCount.issued || 0)) / filteredPurchOrders.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                <Truck className="w-4 h-4 text-blue-500 shrink-0" />
                <span>การคัดกรองใบรับสินค้าเข้าคลัง (GRN) ช่วยยันยอดรับวัตถุดิบเคมีภัณฑ์เข้าสู่สต็อกจริงอย่างปลอดภัย</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Stock Export Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">ส่งออกข้อมูลคลังจัดเก็บและแจ้งเตือนวิกฤต</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">ดาวน์โหลดข้อมูลสต็อกวัตถุดิบและเคมีภัณฑ์ทั้งหมด เพื่อนำส่งที่ประชุมวางแผนฝ่ายจัดซื้อ</p>
              </div>
            </div>
            
            <button
              onClick={exportStockCSV}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all print:hidden"
            >
              <Download className="w-4 h-4" /> ส่งออกรายงานสต็อก (CSV)
            </button>
          </div>
        </div>
      )}

      {/* PRODUCTION REPORT TAB */}
      {activeTab === "production" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Production volume by Product */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-blue-600" /> ยอดการผลิตแยกตามแบรนด์ผลิตภัณฑ์สำเร็จรูป
                  </h3>
                  <p className="text-[10px] text-slate-400">สรุปตามน้ำหนักสุทธิผลิตรวมสำเร็จสะสม</p>
                </div>
                <button
                  onClick={exportProductionCSV}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> ส่งออกคำสั่งผลิต (CSV)
                </button>
              </div>

              {prodByProductList.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  ยังไม่มีสถิติยอดคำสั่งผลิตในช่วงเวลานี้
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {prodByProductList.map((item, idx) => {
                    const percentage = Math.round((item.qty / maxProdQty) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span className="truncate max-w-[80%]">{item.name}</span>
                          <span className="font-mono font-bold text-slate-900">{item.qty.toLocaleString()} กก.</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 w-8 text-right">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Production volume by Customer */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-700" /> สัดส่วนสถิติผลิตแยกตามกลุ่มลูกค้า 5 ลำดับแรก
              </h3>
              
              <div className="divide-y divide-slate-100 pt-1">
                {prodByCustomerList.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    ไม่มีสถิติกำไรกลุ่มลูกค้าในขณะนี้
                  </div>
                ) : (
                  prodByCustomerList.map((cust, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 border text-slate-600 font-mono text-[10px] font-extrabold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[130px]">{cust.name}</span>
                      </div>
                      <span className="text-xs font-bold font-mono text-slate-900">{cust.qty.toLocaleString()} กก.</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bottom Table List */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-800">รายการใบสั่งผลิตและข้อมูลคำสั่งกรอง</h3>
              <span className="text-[10px] bg-slate-100 border text-slate-500 px-2 py-0.5 rounded-full font-bold">
                จำนวนที่พบ {filteredProdOrders.length} ใบสั่งผลิต
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                    <th className="p-3">รหัสใบสั่ง</th>
                    <th className="p-3">ลูกค้า / แบรนด์</th>
                    <th className="p-3">ผลิตภัณฑ์</th>
                    <th className="p-3 text-right">จำนวนที่ผลิต</th>
                    <th className="p-3 text-center">หน่วย</th>
                    <th className="p-3 text-center">วันที่ผลิต</th>
                    <th className="p-3 text-center">กำหนดส่ง</th>
                    <th className="p-3 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProdOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-blue-600">{o.code}</td>
                      <td className="p-3 font-semibold text-slate-800">{o.customer_name || "ทั่วไป"}</td>
                      <td className="p-3 text-slate-700">{o.product_name || o.product_code || "-"}</td>
                      <td className="p-3 text-right font-bold font-mono text-slate-900">{o.quantity.toLocaleString()}</td>
                      <td className="p-3 text-center text-slate-400">{o.unit}</td>
                      <td className="p-3 text-center text-slate-500">{o.date || "-"}</td>
                      <td className="p-3 text-center text-slate-500">{o.due_date || "-"}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          o.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : o.status === "in_progress"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {o.status === "completed" ? "สำเร็จ" : o.status === "in_progress" ? "กำลังผลิต" : "รอดำเนินการ"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredProdOrders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        ไม่พบข้อมูลใบสั่งผลิตตามกำหนดเวลาที่กรองในคลังระบบ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PURCHASE REPORT TAB */}
      {activeTab === "purchase" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Purchase volume by supplier */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-emerald-600" /> ยอดจัดซื้อสะสมแบ่งตามซัพพลายเออร์หลัก
                  </h3>
                  <p className="text-[10px] text-slate-400">สรุปตามยอดมูลค่าสั่งรวม (สกุลเงินบาท)</p>
                </div>
                <button
                  onClick={exportPurchaseCSV}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> ส่งออกจัดซื้อ (CSV)
                </button>
              </div>

              {supplierSpendingList.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  ยังไม่มีประวัติจัดจัดซื้อวัตถุดิบในช่วงเวลาดังกล่าว
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {supplierSpendingList.map((item, idx) => {
                    const percentage = Math.round((item.val / maxSupplierSpending) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span className="truncate max-w-[80%]">{item.name}</span>
                          <span className="font-mono font-bold text-emerald-600">฿{item.val.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 w-8 text-right">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top purchased raw material chemical item breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-indigo-600" /> สัดส่วนงบจัดซื้อแยกตามเคมีภัณฑ์หลัก (Top 5)
              </h3>

              <div className="divide-y divide-slate-100 pt-1">
                {purchasedMaterialsList.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    ไม่มีสถิติคำสั่งจัดซื้อวัตถุดิบในช่วงเวลานี้
                  </div>
                ) : (
                  purchasedMaterialsList.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-50 border text-slate-500 font-mono text-[10px] font-extrabold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[130px]">{item.name}</span>
                      </div>
                      <span className="text-xs font-bold font-mono text-slate-800">฿{item.cost.toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bottom Table List for Purchase */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-800">รายงานข้อมูลใบสั่งจัดจัดซื้อวัตถุดิบละเอียด</h3>
              <span className="text-[10px] bg-slate-100 border text-slate-500 px-2 py-0.5 rounded-full font-bold">
                จำนวนจัดซื้อ {filteredPurchOrders.length} รายการ
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                    <th className="p-3">รหัสใบสั่งซื้อ</th>
                    <th className="p-3">ผู้จัดจำหน่าย (Supplier)</th>
                    <th className="p-3 text-center">วันที่ออกใบ</th>
                    <th className="p-3 text-right">จำนวนวัตถุดิบ (ชนิด)</th>
                    <th className="p-3 text-right">ยอดรวมมูลค่า (บาท)</th>
                    <th className="p-3 text-center">สถานะจัดส่ง</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPurchOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-blue-600">{o.code}</td>
                      <td className="p-3 font-semibold text-slate-800">{o.supplier}</td>
                      <td className="p-3 text-center text-slate-500">{o.order_date || "-"}</td>
                      <td className="p-3 text-right font-mono text-slate-700">{Array.isArray(o.items) ? o.items.length : 0} รายการ</td>
                      <td className="p-3 text-right font-bold font-mono text-emerald-600">฿{Number(o.total_amount).toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          o.status === "received" || o.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {o.status === "received" || o.status === "completed" ? "รับเข้าแล้ว" : "รอดำเนินการ"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredPurchOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        ไม่พบรายการข้อมูลใบจัดซื้อตามกำหนดเวลาคัดกรองนี้
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
