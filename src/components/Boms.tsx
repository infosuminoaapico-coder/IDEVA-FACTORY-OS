import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Copy, 
  Eye, 
  X, 
  Save, 
  ClipboardList, 
  Database,
  Layers,
  Sparkles,
  Info
} from "lucide-react";
import { BomRecipe, Product, RawMaterial, ProductionOrder } from "../types";

interface BomsProps {
  bomRecipes: BomRecipe[];
  products: Product[];
  rawMaterials: RawMaterial[];
  productionOrders: ProductionOrder[];
  onSaveBom: (bom: any) => Promise<void>;
  onDeleteBom: (id: number) => Promise<void>;
}

export default function Boms({
  bomRecipes,
  products,
  rawMaterials,
  productionOrders,
  onSaveBom,
  onDeleteBom
}: BomsProps) {
  const [search, setSearch] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBom, setSelectedBom] = useState<BomRecipe | null>(null);
  const [editingBom, setEditingBom] = useState<BomRecipe | null>(null);

  // Form states
  const [productId, setProductId] = useState<number | "">("");
  const [version, setVersion] = useState("v1.0");
  const [status, setStatus] = useState("active");
  const [notes, setNotes] = useState("");
  const [materials, setMaterials] = useState<Array<{ material_name: string; quantity: number; unit: string; notes?: string }>>([
    { material_name: "", quantity: 0, unit: "ลิตร" }
  ]);

  // Handle Dynamic rows inside formulation
  const handleAddMaterialRow = () => {
    setMaterials([...materials, { material_name: "", quantity: 0, unit: "ลิตร" }]);
  };

  const handleRemoveMaterialRow = (index: number) => {
    const updated = [...materials];
    updated.splice(index, 1);
    setMaterials(updated);
  };

  const handleMaterialChange = (index: number, field: string, value: any) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    
    // Automatically match unit if selected raw material matches cache
    if (field === "material_name") {
      const matched = rawMaterials.find(r => r.name === value);
      if (matched) {
        updated[index].unit = matched.unit;
      }
    }
    setMaterials(updated);
  };

  // List of standard units
  const standardUnits = ["ลิตร", "กก.", "แกลลอน", "ชิ้น", "ซีซี", "มล.", "กรัม", "ขวด", "ถุง", "ลัง"];

  // Filter recipes based on search input
  const filtered = bomRecipes.filter(b => {
    const pCode = (b.product_code || "").toLowerCase();
    const pName = (b.product_name || "").toLowerCase();
    const bNotes = (b.notes || "").toLowerCase();
    const q = search.toLowerCase();
    return pCode.includes(q) || pName.includes(q) || bNotes.includes(q);
  });

  const handleViewDetails = (bom: BomRecipe) => {
    setSelectedBom(bom);
    setIsViewModalOpen(true);
  };

  const openEditModal = (bom: BomRecipe | null = null, clone = false) => {
    if (bom) {
      setEditingBom(clone ? null : bom);
      setProductId(bom.product_id);
      setVersion(clone ? "v1.0" : bom.version);
      setStatus(bom.status);
      setNotes(bom.notes || "");
      setMaterials(bom.materials.map(m => ({
        material_name: m.material_name,
        quantity: m.quantity,
        unit: m.unit,
        notes: m.notes || ""
      })));
    } else {
      setEditingBom(null);
      setProductId("");
      setVersion("v1.0");
      setStatus("active");
      setNotes("");
      setMaterials([{ material_name: "", quantity: 0, unit: "ลิตร" }]);
    }
    setIsEditModalOpen(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    // Filter out invalid items
    const validMaterials = materials.filter(m => m.material_name.trim() && m.quantity > 0);
    if (validMaterials.length === 0) {
      alert("กรุณาเพิ่มวัตถุดิบและปริมาณของส่วนผสมอย่างน้อย 1 รายการ!");
      return;
    }

    await onSaveBom({
      id: editingBom ? editingBom.id : 0,
      product_id: Number(productId),
      version,
      status,
      notes,
      materials: validMaterials
    });
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสูตรการผลิต (BOM) นี้?")) {
      await onDeleteBom(id);
    }
  };

  // Helper values calculated for a recipe
  const getProductProductionStats = (prodId: number) => {
    const orders = productionOrders.filter(po => po.product_id === prodId && po.status === "done");
    const count = orders.length;
    const qty = orders.reduce((sum, po) => sum + po.quantity, 0);
    return { count, qty };
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาตามรหัสสินค้า, ชื่อสินค้า หรือหมายเหตุสูตร..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
        <button
          onClick={() => openEditModal(null)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> สร้างสูตรการผลิตใหม่
        </button>
      </div>

      {/* Formulas Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse border border-slate-100">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase">
                <th className="p-2.5 border border-slate-200 text-center w-12">ลำดับ</th>
                <th className="p-2.5 border border-slate-200">รหัสสินค้า</th>
                <th className="p-2.5 border border-slate-200">ชื่อสินค้าที่ผลิต</th>
                <th className="p-2.5 border border-slate-200 text-center w-28">เวอร์ชันสูตร</th>
                <th className="p-2.5 border border-slate-200 text-right bg-blue-50/20 w-44">ผลิตไปแล้ว (Already Produced)</th>
                <th className="p-2.5 border border-slate-200 text-center w-28">สถานะ</th>
                <th className="p-2.5 border border-slate-200 text-center w-48">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, index) => {
                // Production stats
                const stats = getProductProductionStats(b.product_id);
                const hasProduced = stats.qty > 0;
                
                return (
                  <tr key={b.id} className="odd:bg-white even:bg-slate-50/60 hover:bg-blue-50/30 transition-colors">
                    <td className="p-2 border border-slate-200/60 text-center font-mono text-slate-400">{index + 1}</td>
                    <td className="p-2 border border-slate-200/60 font-bold font-mono text-slate-800">{b.product_code || "-"}</td>
                    <td className="p-2 border border-slate-200/60">
                      <div>
                        <span className="font-semibold text-slate-800">{b.product_name || "-"}</span>
                        {b.notes && (
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-xs">{b.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-2 border border-slate-200/60 text-center font-semibold font-mono text-slate-500">
                      <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                        {b.version}
                      </span>
                    </td>
                    <td className="p-2 border border-slate-200/60 text-right font-semibold bg-blue-50/10">
                      {hasProduced ? (
                        <div className="flex flex-col items-end">
                          <span className="text-blue-700 font-bold font-mono">
                            {stats.qty.toLocaleString()} {b.product_type === "Powder" ? "กก." : "ลิตร"}
                          </span>
                          <span className="text-[9px] text-slate-400 font-sans mt-0.5">
                            (จาก {stats.count} ใบสั่งผลิตเสร็จสิ้น)
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-normal text-[11px] font-sans">ยังไม่มีประวัติการผลิต</span>
                      )}
                    </td>
                    <td className="p-2 border border-slate-200/60 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        b.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : b.status === "test"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}>
                        {b.status === "active" ? "เปิดใช้งาน" : b.status === "test" ? "ทดสอบ" : "ปิดใช้งาน"}
                      </span>
                    </td>
                    <td className="p-2 border border-slate-200/60 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewDetails(b)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> ดูสูตร
                        </button>
                        <button
                          onClick={() => openEditModal(b, false)}
                          title="แก้ไขสูตร"
                          className="p-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-800 rounded-lg transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(b, true)}
                          title="Clone คัดลอกสูตร"
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg transition-all"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          title="ลบ"
                          className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-800 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    ไม่พบสูตรการผลิตที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REQ SPECIFIC: "ดูสูตร" (View Recipe Details) Modal */}
      {isViewModalOpen && selectedBom && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4.5 h-4.5 text-blue-600" />
                <div>
                  <h3 className="text-xs md:text-sm font-bold text-slate-800">รายละเอียดสูตรการผลิต (BOM)</h3>
                  <p className="text-[10px] text-slate-400">ID สูตร: BOM-{selectedBom.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Product Info Header */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-pulse" /> PRODUCT FORMULATION DETAILS
                </div>
                <h2 className="text-base font-bold text-slate-800">
                  {selectedBom.product_name}
                </h2>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono font-bold">
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md border border-slate-300">
                    CODE: {selectedBom.product_code}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
                    VERSION: {selectedBom.version}
                  </span>
                </div>
              </div>

              {/* REQ SPECIFIC: จำนวนที่ผลิตไปแล้วทั้งหมด (Total Manufactured stats card) */}
              {(() => {
                const stats = getProductProductionStats(selectedBom.product_id);
                return (
                  <div className="bg-blue-50/50 border border-blue-100 p-3.5 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-[11px] font-semibold text-blue-800">จำนวนที่ผลิตไปแล้วทั้งหมด</h4>
                      <p className="text-[9px] text-slate-400 font-sans">คำนวณจากใบสั่งผลิตที่สถานะ "เสร็จสิ้น" ในระบบ</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono text-blue-700">
                        {stats.qty > 0 ? `${stats.qty.toLocaleString()} ${selectedBom.product_type === "Powder" ? "กก." : "ลิตร"}` : "0"}
                      </div>
                      <div className="text-[9px] text-blue-500 font-sans font-medium mt-0.5">
                        (จากทั้งหมด {stats.count} ล็อตสั่งผลิต)
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* REQ SPECIFIC: รายการวัตถุดิบทั้งหมดพร้อมปริมาณและหน่วย */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-slate-500" /> รายการวัตถุดิบและส่วนผสมหลัก (Ingredients)
                  </h4>
                  <span className="text-[9px] text-slate-400">อัตราส่วนต่อ 1 ถังผสมมาตรฐาน</span>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500">
                        <th className="p-2 w-8 text-center">#</th>
                        <th className="p-2">ชื่อวัตถุดิบเคมีภัณฑ์</th>
                        <th className="p-2 text-right">ปริมาณส่วนผสม</th>
                        <th className="p-2 w-16 text-center">หน่วย</th>
                        <th className="p-2">หมายเหตุ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedBom.materials.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/40">
                          <td className="p-2 text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td className="p-2 font-semibold text-slate-800">{m.material_name}</td>
                          <td className="p-2 text-right font-bold font-mono text-blue-600">{m.quantity.toLocaleString()}</td>
                          <td className="p-2 text-center text-slate-500 font-medium">{m.unit}</td>
                          <td className="p-2 text-slate-400 text-[10px] truncate max-w-[100px]" title={m.notes || ""}>
                            {m.notes || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedBom.notes && (
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-1.5 font-sans">
                  <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span><strong>บันทึกสูตรเพิ่มเติม:</strong> {selectedBom.notes}</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulation Create/Edit/Clone Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
              <h3 className="text-xs md:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <ClipboardList className="w-4.5 h-4.5 text-blue-600" />
                {editingBom ? "แก้ไขสูตรการผลิต (BOM)" : "สร้างสูตรการผลิต (BOM) ใหม่"}
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="flex-1 overflow-y-auto flex flex-col">
              <div className="p-5 space-y-4 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">เลือกสินค้าผลิตภัณฑ์ <span className="text-red-500">*</span></label>
                    <select
                      value={productId}
                      onChange={(e) => setProductId(Number(e.target.value))}
                      required
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="">-- กรุณาเลือกสินค้า --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.code} - {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">เวอร์ชันสูตร</label>
                    <input
                      type="text"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="เช่น v1.0, v2.1"
                      required
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">สถานะ</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="active">เปิดใช้งาน (Active)</option>
                      <option value="test">สูตรทดลอง (Test)</option>
                      <option value="inactive">ไม่ใช้งาน (Inactive)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">หมายเหตุ / วิธีการผสม</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ระบุคำอธิบายย่อสำหรับการผสม เช่น สูตรสารหนืดเกรดพรีเมียม"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Ingredients formulation lines */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-slate-500" /> สัดส่วนส่วนผสมวัตถุดิบเคมี
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddMaterialRow}
                      className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      + เพิ่มวัตถุดิบย่อย
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {materials.map((m, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                        {/* Material dropdown selection */}
                        <div className="flex-1">
                          <select
                            value={m.material_name}
                            onChange={(e) => handleMaterialChange(idx, "material_name", e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:border-blue-500"
                          >
                            <option value="">-- เลือกสารดิบ --</option>
                            {rawMaterials.map(rm => (
                              <option key={rm.id} value={rm.name}>
                                {rm.code} - {rm.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quantity */}
                        <div className="w-24">
                          <input
                            type="number"
                            step="0.01"
                            value={m.quantity || ""}
                            onChange={(e) => handleMaterialChange(idx, "quantity", parseFloat(e.target.value) || 0)}
                            placeholder="จำนวน"
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-right font-mono focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* Unit selection */}
                        <div className="w-24">
                          <select
                            value={m.unit}
                            onChange={(e) => handleMaterialChange(idx, "unit", e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:border-blue-500"
                          >
                            {standardUnits.map((un, unIdx) => (
                              <option key={unIdx} value={un}>{un}</option>
                            ))}
                          </select>
                        </div>

                        {/* Delete row */}
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterialRow(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-md transition-all cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-all cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> บันทึกสูตร (BOM)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
