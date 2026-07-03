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
  Info,
  ChevronDown
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
  const [productSearch, setProductSearch] = useState("");
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [openDropdownIdx, setOpenDropdownIdx] = useState<number | null>(null);
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

  // Helper function to auto-increment version (e.g., v1.0 -> v1.1, V2.1 -> V2.2)
  const incrementVersion = (currentVersion: string): string => {
    if (!currentVersion) return "v1.0";
    const trimmed = currentVersion.trim();
    
    // Try matching classic v1.0, V1.0, v2.12, version 1.3
    const match = trimmed.match(/^([vV]?|version\s*|Version\s*)(\d+)\.(\d+)(.*)$/);
    if (match) {
      const prefix = match[1] || "v";
      const major = parseInt(match[2], 10);
      const minor = parseInt(match[3], 10) + 1;
      const suffix = match[4] || "";
      return `${prefix}${major}.${minor}${suffix}`;
    }
    
    // Try matching a simple single number e.g. "1", "v2"
    const singleMatch = trimmed.match(/^([vV]?|version\s*|Version\s*)(\d+)(.*)$/);
    if (singleMatch) {
      const prefix = singleMatch[1] || "v";
      const num = parseInt(singleMatch[2], 10) + 1;
      const suffix = singleMatch[3] || "";
      return `${prefix}${num}.0${suffix}`;
    }

    // Fallback
    return trimmed + ".1";
  };

  const openEditModal = (bom: BomRecipe | null = null, clone = false) => {
    if (bom) {
      setEditingBom(clone ? null : bom);
      setProductId(bom.product_id);
      const matchedProd = products.find(p => p.id === bom.product_id);
      setProductSearch(matchedProd ? `${matchedProd.code} - ${matchedProd.name}` : "");
      
      // Auto-increment version if editing, otherwise reset to v1.0 if cloning
      const nextVer = clone ? "v1.0" : incrementVersion(bom.version);
      setVersion(nextVer);
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
      setProductSearch("");
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-150 bg-slate-50/80 flex-shrink-0">
              <h3 className="text-sm md:text-base lg:text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                {editingBom ? "แก้ไขสูตรการผลิต (BOM)" : "สร้างสูตรการผลิต (BOM) ใหม่"}
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="flex-1 overflow-y-auto flex flex-col">
              <div className="p-6 md:p-8 space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="relative md:col-span-1">
                    <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">เลือกสินค้าผลิตภัณฑ์ <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => {
                          setProductSearch(e.target.value);
                          setIsProductDropdownOpen(true);
                          const matched = products.find(p => `${p.code} - ${p.name}`.toLowerCase() === e.target.value.toLowerCase());
                          if (matched) {
                            setProductId(matched.id);
                          } else {
                            setProductId("");
                          }
                        }}
                        onFocus={() => setIsProductDropdownOpen(true)}
                        onBlur={() => {
                          setTimeout(() => {
                            setIsProductDropdownOpen(false);
                          }, 250);
                        }}
                        placeholder="พิมพ์เพื่อค้นหา หรือเลือกจากรายการ..."
                        required
                        className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition-all shadow-sm text-slate-800 placeholder:text-slate-400"
                      />
                      <div className="absolute right-3 top-3 text-slate-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {isProductDropdownOpen && (
                      <div className="absolute z-[60] left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl divide-y divide-slate-100">
                        {products
                          .filter(p => {
                            const pCode = (p.code || "").toLowerCase();
                            const pName = (p.name || "").toLowerCase();
                            const q = productSearch.toLowerCase();
                            return pCode.includes(q) || pName.includes(q);
                          })
                          .map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setProductId(p.id);
                                setProductSearch(`${p.code} - ${p.name}`);
                                setIsProductDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-xs md:text-sm hover:bg-blue-50 text-slate-700 font-sans transition-colors flex items-center justify-between"
                            >
                              <span className="font-semibold text-slate-800">{p.code} - {p.name}</span>
                              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded font-mono uppercase font-bold">{p.type}</span>
                            </button>
                          ))
                        }
                        {products.filter(p => {
                          const pCode = (p.code || "").toLowerCase();
                          const pName = (p.name || "").toLowerCase();
                          const q = productSearch.toLowerCase();
                          return pCode.includes(q) || pName.includes(q);
                        }).length === 0 && (
                          <div className="px-4 py-3 text-xs md:text-sm text-slate-400 italic">
                            ไม่พบสินค้าผลิตภัณฑ์ที่ตรงกัน
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">เวอร์ชันสูตร</label>
                    <input
                      type="text"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="เช่น v1.0, v2.1"
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs md:text-sm font-bold font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition-all shadow-sm text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">สถานะการใช้งาน</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs md:text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition-all shadow-sm text-slate-800 cursor-pointer"
                    >
                      <option value="active">เปิดใช้งาน (Active)</option>
                      <option value="test">สูตรทดลอง (Test)</option>
                      <option value="inactive">ไม่ใช้งาน (Inactive)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">หมายเหตุ / วิธีการผสมสูตรสำเร็จ</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ระบุคำอธิบายสั้นๆ สำหรับการผสม หรือข้อควรระวังพิเศษ"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition-all shadow-sm text-slate-800"
                  />
                </div>

                {/* Ingredients formulation lines */}
                <div className="space-y-3 border-t border-slate-150 pt-5">
                  <div className="flex items-center justify-between pb-1.5">
                    <h4 className="text-xs md:text-sm lg:text-base font-extrabold text-slate-800 flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-500" /> สัดส่วนส่วนผสมวัตถุดิบเคมีหลัก <span className="text-xs font-normal text-slate-400">(ต่อหนึ่งถังผลิตมาตรฐาน)</span>
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddMaterialRow}
                      className="text-xs md:text-sm text-blue-600 font-extrabold hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer bg-blue-50 px-3 py-1.5 rounded-lg transition-all border border-blue-100 shadow-sm"
                    >
                      + เพิ่มวัตถุดิบเคมี
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {/* Header Columns for Tablet and Up */}
                    {materials.length > 0 && (
                      <div className="hidden md:flex gap-3 items-center px-3 pb-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div className="flex-1">ชื่อวัตถุดิบเคมีภัณฑ์ / สารเคมี</div>
                        <div className="w-32">ปริมาณสัดส่วน</div>
                        <div className="w-32">หน่วยวัด</div>
                        <div className="w-8"></div>
                      </div>
                    )}

                    {materials.map((m, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                        {/* Material dropdown selection with Search & Typeable capability */}
                        <div className="flex-1 relative">
                          <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">วัตถุดิบเคมี</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={m.material_name}
                              onChange={(e) => {
                                handleMaterialChange(idx, "material_name", e.target.value);
                                setOpenDropdownIdx(idx);
                              }}
                              onFocus={() => setOpenDropdownIdx(idx)}
                              onBlur={() => {
                                setTimeout(() => {
                                  setOpenDropdownIdx(null);
                                }, 250);
                              }}
                              placeholder="พิมพ์ค้นหาหรือป้อนสารเคมี..."
                              className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                            <button
                              type="button"
                              tabIndex={-1}
                              onClick={() => {
                                setOpenDropdownIdx(openDropdownIdx === idx ? null : idx);
                              }}
                              className="absolute right-2 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          {openDropdownIdx === idx && (
                            <div className="absolute z-[70] left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl divide-y divide-slate-100">
                              {rawMaterials
                                .filter(rm => {
                                  const rmName = (rm.name || "").toLowerCase();
                                  const rmCode = (rm.code || "").toLowerCase();
                                  const q = (m.material_name || "").toLowerCase();
                                  return rmName.includes(q) || rmCode.includes(q);
                                })
                                .map(rm => (
                                  <button
                                    key={rm.id}
                                    type="button"
                                    onClick={() => {
                                      handleMaterialChange(idx, "material_name", rm.name);
                                      setOpenDropdownIdx(null);
                                    }}
                                    className="w-full text-left px-3 py-2.5 text-xs md:text-sm hover:bg-blue-50 text-slate-700 font-sans transition-colors flex flex-col gap-0.5"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-slate-800">{rm.code} - {rm.name}</span>
                                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono uppercase font-bold">{rm.unit}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                                      <span className={rm.stock_qty <= rm.min_stock ? "text-red-500 font-medium" : "text-emerald-600 font-medium"}>
                                        📦 คลังคงเหลือ: {rm.stock_qty.toLocaleString()} {rm.unit}
                                      </span>
                                      {rm.min_stock > 0 && (
                                        <span className="text-slate-400 font-mono text-[9px]">
                                          (ขั้นต่ำ: {rm.min_stock})
                                        </span>
                                      )}
                                    </div>
                                  </button>
                                ))
                              }
                              {rawMaterials.filter(rm => {
                                const rmName = (rm.name || "").toLowerCase();
                                const rmCode = (rm.code || "").toLowerCase();
                                const q = (m.material_name || "").toLowerCase();
                                return rmName.includes(q) || rmCode.includes(q);
                              }).length === 0 && (
                                <div className="px-3 py-2.5 text-xs md:text-sm text-slate-400 italic">
                                  ไม่พบวัตถุดิบเคมีที่ตรงกัน
                                </div>
                              )}
                              {m.material_name.trim() !== "" && !rawMaterials.some(rm => rm.name.toLowerCase() === m.material_name.toLowerCase()) && (
                                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 italic">
                                  ✍️ ใช้ชื่อที่พิมพ์: "{m.material_name}" (เพิ่มข้อมูลสารเคมีนอกระบบ)
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="w-full md:w-32">
                          <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ปริมาณ</label>
                          <input
                            type="number"
                            step="0.01"
                            value={m.quantity || ""}
                            onChange={(e) => handleMaterialChange(idx, "quantity", parseFloat(e.target.value) || 0)}
                            placeholder="จำนวน"
                            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs md:text-sm text-right font-bold font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
                          />
                        </div>

                        {/* Unit selection */}
                        <div className="w-full md:w-32">
                          <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">หน่วยวัด</label>
                          <select
                            value={m.unit}
                            onChange={(e) => handleMaterialChange(idx, "unit", e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs md:text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 cursor-pointer"
                          >
                            {standardUnits.map((un, unIdx) => (
                              <option key={unIdx} value={un}>{un}</option>
                            ))}
                          </select>
                        </div>

                        {/* Delete row */}
                        <div className="flex items-end justify-end md:items-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterialRow(idx)}
                            className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100"
                            title="ลบแถววัตถุดิบ"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 border-t border-slate-150 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs md:text-sm font-bold hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/10 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> บันทึกสูตร (BOM)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
