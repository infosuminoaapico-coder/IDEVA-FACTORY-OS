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
  ChevronDown,
  Printer,
  Trash
} from "lucide-react";
import { BomRecipe, Product, RawMaterial, ProductionOrder, Customer } from "../types";
import BomPrint from "./BomPrint";

interface BomsProps {
  bomRecipes: BomRecipe[];
  products: Product[];
  rawMaterials: RawMaterial[];
  productionOrders: ProductionOrder[];
  customers: Customer[];
  onSaveBom: (bom: any) => Promise<void>;
  onDeleteBom: (id: number) => Promise<void>;
}

export default function Boms({
  bomRecipes,
  products,
  rawMaterials,
  productionOrders,
  customers,
  onSaveBom,
  onDeleteBom
}: BomsProps) {
  const [search, setSearch] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBom, setSelectedBom] = useState<BomRecipe | null>(null);
  const [editingBom, setEditingBom] = useState<BomRecipe | null>(null);

  // Print Popup states
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printSelectedBom, setPrintSelectedBom] = useState<BomRecipe | null>(null);

  // Form states
  const [productId, setProductId] = useState<number | "">("");
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [partNo, setPartNo] = useState("");
  const [isProductCodeDropdownOpen, setIsProductCodeDropdownOpen] = useState(false);
  const [isProductNameDropdownOpen, setIsProductNameDropdownOpen] = useState(false);

  // Dropdown indices for each material row
  const [openCodeDropdownIdx, setOpenCodeDropdownIdx] = useState<number | null>(null);
  const [openNameDropdownIdx, setOpenNameDropdownIdx] = useState<number | null>(null);

  const [version, setVersion] = useState("v1.0");
  const [status, setStatus] = useState("active");

  // Dynamic Instructions List (Step-by-Step)
  const [instructions, setInstructions] = useState<Array<{ instruction: string }>>([
    { instruction: "" }
  ]);

  // materials array with part, code, name, quantity, unit
  const [materials, setMaterials] = useState<Array<{ 
    part?: string;
    material_code: string; 
    material_name: string; 
    quantity: number | string; 
    unit: string; 
    notes?: string 
  }>>([
    { part: "A", material_code: "", material_name: "", quantity: "", unit: "KG." }
  ]);

  // Handle Dynamic rows inside formulation
  const handleAddMaterialRow = () => {
    const nextPart = materials.length >= 6 ? "C" : materials.length >= 3 ? "B" : "A";
    setMaterials([...materials, { part: nextPart, material_code: "", material_name: "", quantity: "", unit: "KG." }]);
  };

  const handleRemoveMaterialRow = (index: number) => {
    const updated = [...materials];
    updated.splice(index, 1);
    setMaterials(updated);
  };

  const handleMaterialChange = (index: number, field: string, value: any) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    
    // Automatically match code/name/unit if selected raw material matches cache
    if (field === "material_code") {
      const matched = rawMaterials.find(r => r.code.toLowerCase() === value.trim().toLowerCase());
      if (matched) {
        updated[index].material_name = matched.name;
        updated[index].unit = matched.unit || "KG.";
      }
    } else if (field === "material_name") {
      const matched = rawMaterials.find(r => r.name.toLowerCase() === value.trim().toLowerCase());
      if (matched) {
        updated[index].material_code = matched.code;
        updated[index].unit = matched.unit || "KG.";
      }
    }
    setMaterials(updated);
  };

  // Handle Dynamic instructions rows
  const handleAddInstructionRow = () => {
    setInstructions([...instructions, { instruction: "" }]);
  };

  const handleRemoveInstructionRow = (index: number) => {
    const updated = [...instructions];
    updated.splice(index, 1);
    setInstructions(updated);
  };

  const handleInstructionChange = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = { instruction: value };
    setInstructions(updated);
  };

  // List of standard units in English abbreviations
  const standardUnits = ["KG.", "G.", "L.", "ML.", "PCS.", "BAG", "DRUM", "BOX", "CAN", "BOTTLE", "SET"];

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
      setPartNo(bom.part_no || "");
      
      const matchedProd = products.find(p => p.id === bom.product_id);
      setProductCode(matchedProd ? matchedProd.code : (bom.product_code || ""));
      setProductName(matchedProd ? matchedProd.name : (bom.product_name || ""));
      
      // Auto-increment version if editing, otherwise reset to v1.0 if cloning
      const nextVer = clone ? "v1.0" : incrementVersion(bom.version);
      setVersion(nextVer);
      setStatus(bom.status);
      
      // Parse instructions from bom.notes (JSON or string fallback)
      let parsedInstructions = [{ instruction: "" }];
      if (bom.notes) {
        try {
          if (bom.notes.trim().startsWith("[")) {
            parsedInstructions = JSON.parse(bom.notes);
          } else {
            parsedInstructions = [{ instruction: bom.notes }];
          }
        } catch (e) {
          parsedInstructions = [{ instruction: bom.notes }];
        }
      }
      setInstructions(parsedInstructions);

      // Map materials
      setMaterials(bom.materials.map((m, idx) => {
        const matchedRm = rawMaterials.find(rm => rm.name.toLowerCase() === m.material_name.toLowerCase());
        return {
          part: m.part || (idx >= 6 ? "C" : idx >= 3 ? "B" : "A"),
          material_code: m.material_code || (matchedRm ? matchedRm.code : ""),
          material_name: m.material_name,
          quantity: m.quantity,
          unit: m.unit || "KG.",
          notes: m.notes || ""
        };
      }));
    } else {
      setEditingBom(null);
      setProductId("");
      setPartNo("PART-001");
      setProductCode("");
      setProductName("");
      setVersion("v1.0");
      setStatus("active");
      setInstructions([{ instruction: "" }]);
      setMaterials([{ part: "A", material_code: "", material_name: "", quantity: "", unit: "KG." }]);
    }
    setIsEditModalOpen(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Resolve product_id
    let resolvedProductId = Number(productId);
    if (!resolvedProductId || isNaN(resolvedProductId)) {
      const matchedProd = products.find(
        p => (productCode && p.code.toLowerCase() === productCode.trim().toLowerCase()) ||
             (productName && p.name.toLowerCase() === productName.trim().toLowerCase())
      );
      if (matchedProd) {
        resolvedProductId = matchedProd.id;
      } else if (products.length > 0) {
        resolvedProductId = products[0].id;
      } else {
        resolvedProductId = 1;
      }
    }

    if (!productCode.trim() && !productName.trim()) {
      alert("กรุณาระบุรหัสสินค้าหรือชื่อสินค้าที่ต้องการสร้างสูตร!");
      return;
    }

    // 2. Filter out invalid materials (must have name and quantity > 0)
    const validMaterials = materials.filter(m => m.material_name.trim() && Number(m.quantity) > 0);
    if (validMaterials.length === 0) {
      alert("กรุณาระบุวัตถุดิบและใส่ปริมาณส่วนผสมอย่างน้อย 1 รายการ (พิมพ์จุดทศนิยม เช่น 0.01 ได้)!");
      return;
    }

    // 3. Filter out empty instruction lines
    const validInstructions = instructions.filter(inst => inst.instruction.trim());

    // 4. Calculate estimated unit cost
    let calculatedCost = 0;
    const formattedMaterials = validMaterials.map((m, idx) => {
      const matchedRm = rawMaterials.find(
        rm => rm.name.toLowerCase() === m.material_name.trim().toLowerCase() || 
              (m.material_code && rm.code.toLowerCase() === m.material_code.trim().toLowerCase())
      );
      const qtyNum = Number(m.quantity) || 0;
      const unitPrice = matchedRm?.unit_price || 0;
      calculatedCost += qtyNum * unitPrice;

      return {
        part: m.part || (idx >= 6 ? "C" : idx >= 3 ? "B" : "A"),
        raw_material_id: matchedRm ? matchedRm.id : null,
        material_code: m.material_code || (matchedRm ? matchedRm.code : ""),
        material_name: m.material_name.trim(),
        quantity: qtyNum,
        unit: m.unit || "KG.",
        unit_price: unitPrice,
        notes: m.notes || ""
      };
    });

    try {
      await onSaveBom({
        id: editingBom ? editingBom.id : 0,
        product_id: resolvedProductId,
        product_code: productCode,
        product_name: productName,
        part_no: partNo || "PART-001",
        version,
        status,
        notes: JSON.stringify(validInstructions),
        estimated_unit_cost: calculatedCost,
        materials: formattedMaterials
      });
      setIsEditModalOpen(false);
    } catch (err: any) {
      alert("เกิดข้อผิดพลาดในการบันทึกสูตร BOM: " + (err.message || err));
    }
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
      <div className="bg-white border border-slate-250 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-[11px] text-slate-700 tracking-wider">
                <th className="p-2 border border-slate-200 font-normal text-center w-12">ลำดับ</th>
                <th className="p-2 border border-slate-200 font-normal">Part No.</th>
                <th className="p-2 border border-slate-200 font-normal">รหัสสินค้า</th>
                <th className="p-2 border border-slate-200 font-normal">ชื่อสินค้าที่ผลิต</th>
                <th className="p-2 border border-slate-200 font-normal text-center w-24">เวอร์ชันสูตร</th>
                <th className="p-2 border border-slate-200 font-normal text-right w-32">ต้นทุนประมาณการ/หน่วย</th>
                <th className="p-2 border border-slate-200 font-normal text-right w-44">ผลิตไปแล้ว (Already Produced)</th>
                <th className="p-2 border border-slate-200 font-normal text-center w-24">สถานะ</th>
                <th className="p-2 border border-slate-200 font-normal text-center w-48">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, index) => {
                // Production stats
                const stats = getProductProductionStats(b.product_id);
                const hasProduced = stats.qty > 0;
                const estCost = b.estimated_unit_cost || b.materials.reduce((sum, m) => {
                  const rm = rawMaterials.find(r => r.name.toLowerCase() === m.material_name.toLowerCase());
                  return sum + (Number(m.quantity) * (rm?.unit_price || 0));
                }, 0);
                
                return (
                  <tr key={b.id} className="odd:bg-white even:bg-[#f2f6fc] hover:bg-blue-50/55 transition-colors">
                    <td className="p-2 border border-slate-200 text-center font-mono text-slate-500 font-normal">{index + 1}</td>
                    <td className="p-2 border border-slate-200 font-bold font-mono text-blue-600">{b.part_no || "PART-001"}</td>
                    <td className="p-2 border border-slate-200 font-normal font-mono text-slate-800">{b.product_code || "-"}</td>
                    <td className="p-2 border border-slate-200">
                      <div>
                        <span className="font-semibold text-slate-800">{b.product_name || "-"}</span>
                      </div>
                    </td>
                    <td className="p-2 border border-slate-200 text-center font-normal font-mono text-slate-500">
                      <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                        {b.version}
                      </span>
                    </td>
                    <td className="p-2 border border-slate-200 text-right font-bold font-mono text-emerald-700">
                      ฿{estCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-2 border border-slate-200 text-right font-normal">
                      {hasProduced ? (
                        <div className="flex flex-col items-end">
                          <span className="text-blue-700 font-normal font-mono">
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
                    <td className="p-2 border border-slate-200 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-normal px-2 py-0.5 rounded-full border ${
                        b.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : b.status === "test"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}>
                        {b.status === "active" ? "เปิดใช้งาน" : b.status === "test" ? "ทดสอบ" : "ปิดใช้งาน"}
                      </span>
                    </td>
                    <td className="p-2 border border-slate-200 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewDetails(b)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-normal flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> ดูสูตร
                        </button>
                        <button
                          onClick={() => openEditModal(b, false)}
                          title="แก้ไขสูตร"
                          className="p-1 text-amber-600 hover:bg-amber-50 hover:text-amber-800 rounded-lg transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(b, true)}
                          title="Clone คัดลอกสูตร"
                          className="p-1 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg transition-all"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          title="ลบ"
                          className="p-1 text-red-600 hover:bg-red-50 hover:text-red-800 rounded-lg transition-all"
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
                  <td colSpan={7} className="p-8 text-center text-slate-400 border border-slate-200">
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
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col gap-1.5 font-sans">
                  <span className="font-bold text-slate-800">วิธีการผสมและเตรียมสารเคมี:</span>
                  {selectedBom.notes.trim().startsWith("[") ? (
                    <ol className="list-decimal pl-4.5 space-y-1">
                      {JSON.parse(selectedBom.notes).map((inst: any, idx: number) => (
                        <li key={idx} className="font-medium text-slate-600">{inst.instruction}</li>
                      ))}
                    </ol>
                  ) : (
                    <span className="font-medium text-slate-600">{selectedBom.notes}</span>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setPrintSelectedBom(selectedBom);
                  setIsPrintModalOpen(true);
                  setIsViewModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/10 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> พิมพ์ใบชั่งและ BPR
              </button>
              <button
                type="button"
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
                type="button"
                onClick={() => setIsEditModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="flex-1 overflow-y-auto flex flex-col">
              <div className="p-6 md:p-8 space-y-6 flex-1">
                {/* Section 1: Product Selection & Meta */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Part No. */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Part No. / รหัส Part</label>
                    <input
                      type="text"
                      value={partNo}
                      onChange={(e) => setPartNo(e.target.value)}
                      placeholder="เช่น PART-A, P-01"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs md:text-sm font-bold font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition-all shadow-sm text-slate-800"
                    />
                  </div>

                  {/* รหัสผลิตภัณฑ์ */}
                  <div className="relative md:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">รหัสผลิตภัณฑ์ <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type="text"
                        value={productCode}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProductCode(val);
                          setIsProductCodeDropdownOpen(true);
                          const matched = products.find(p => p.code.toLowerCase() === val.trim().toLowerCase());
                          if (matched) {
                            setProductId(matched.id);
                            setProductName(matched.name);
                          } else {
                            setProductId("");
                          }
                        }}
                        onFocus={() => setIsProductCodeDropdownOpen(true)}
                        onBlur={() => {
                          setTimeout(() => {
                            setIsProductCodeDropdownOpen(false);
                          }, 250);
                        }}
                        placeholder="พิมพ์เพื่อค้นหา..."
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs md:text-sm font-bold font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition-all shadow-sm text-slate-800"
                      />
                    </div>
                    {isProductCodeDropdownOpen && (
                      <div className="absolute z-[60] left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl divide-y divide-slate-100">
                        {products
                          .filter(p => (p.code || "").toLowerCase().includes(productCode.toLowerCase()))
                          .map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setProductId(p.id);
                                setProductCode(p.code);
                                setProductName(p.name);
                                setIsProductCodeDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 text-slate-700 font-sans transition-colors flex flex-col"
                            >
                              <span className="font-bold text-blue-600 font-mono">{p.code}</span>
                              <span className="text-[10px] text-slate-400 truncate">{p.name}</span>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* ชื่อผลิตภัณฑ์ */}
                  <div className="relative md:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">ชื่อผลิตภัณฑ์ <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProductName(val);
                          setIsProductNameDropdownOpen(true);
                          const matched = products.find(p => p.name.toLowerCase() === val.trim().toLowerCase());
                          if (matched) {
                            setProductId(matched.id);
                            setProductCode(matched.code);
                          } else {
                            setProductId("");
                          }
                        }}
                        onFocus={() => setIsProductNameDropdownOpen(true)}
                        onBlur={() => {
                          setTimeout(() => {
                            setIsProductNameDropdownOpen(false);
                          }, 250);
                        }}
                        placeholder="พิมพ์เพื่อค้นหา..."
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs md:text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition-all shadow-sm text-slate-800"
                      />
                    </div>
                    {isProductNameDropdownOpen && (
                      <div className="absolute z-[60] left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl divide-y divide-slate-100">
                        {products
                          .filter(p => (p.name || "").toLowerCase().includes(productName.toLowerCase()))
                          .map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setProductId(p.id);
                                setProductCode(p.code);
                                setProductName(p.name);
                                setIsProductNameDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 text-slate-700 font-sans transition-colors flex flex-col"
                            >
                              <span className="font-semibold text-slate-800">{p.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{p.code}</span>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* เวอร์ชัน */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">เวอร์ชันสูตร</label>
                    <input
                      type="text"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="เช่น v1.0"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs md:text-sm font-bold font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition-all shadow-sm text-slate-800"
                    />
                  </div>

                  {/* สถานะ */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">สถานะการใช้งาน</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs md:text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition-all shadow-sm text-slate-800 cursor-pointer"
                    >
                      <option value="active">เปิดใช้งาน (Active)</option>
                      <option value="test">สูตรทดลอง (Test)</option>
                      <option value="inactive">ไม่ใช้งาน (Inactive)</option>
                    </select>
                  </div>
                </div>

                {/* Section 2: Ingredient List with Split Autocomplete Columns */}
                <div className="space-y-3 border-t border-slate-150 pt-5">
                  <div className="flex items-center justify-between pb-1.5">
                    <h4 className="text-xs md:text-sm lg:text-base font-extrabold text-slate-800 flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-500" /> รายการวัตถุดิบและส่วนผสมสารเคมี <span className="text-xs font-normal text-slate-400">(ต่อหนึ่งถังผลิตมาตรฐาน)</span>
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
                    {/* Header Columns for Desktop */}
                    {materials.length > 0 && (
                      <div className="hidden md:flex gap-3 items-center px-3 pb-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div className="w-20">Part</div>
                        <div className="w-1/4">รหัสวัตถุดิบ</div>
                        <div className="flex-1">ชื่อวัตถุดิบเคมีภัณฑ์ / สารเคมี</div>
                        <div className="w-28 text-right">ปริมาณ (สัดส่วน)</div>
                        <div className="w-24">หน่วยวัด</div>
                        <div className="w-8"></div>
                      </div>
                    )}

                    {materials.map((m, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm relative">
                        
                        {/* 0. Part */}
                        <div className="w-full md:w-20">
                          <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Part</label>
                          <input
                            type="text"
                            value={m.part || "A"}
                            onChange={(e) => handleMaterialChange(idx, "part", e.target.value)}
                            placeholder="A / B"
                            className="w-full px-2 py-2 bg-white border border-slate-300 rounded-xl text-xs md:text-sm text-center font-bold font-mono text-slate-800 focus:outline-none focus:border-blue-500 uppercase"
                          />
                        </div>

                        {/* 1. รหัสวัตถุดิบ (Autocomplete) */}
                        <div className="w-full md:w-1/4 relative">
                          <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">รหัสวัตถุดิบ</label>
                          <input
                            type="text"
                            value={m.material_code}
                            onChange={(e) => {
                              handleMaterialChange(idx, "material_code", e.target.value);
                              setOpenCodeDropdownIdx(idx);
                              setOpenNameDropdownIdx(null);
                            }}
                            onFocus={() => {
                              setOpenCodeDropdownIdx(idx);
                              setOpenNameDropdownIdx(null);
                            }}
                            onBlur={() => {
                              setTimeout(() => {
                                setOpenCodeDropdownIdx(null);
                              }, 250);
                            }}
                            placeholder="ค้นหารหัสสาร..."
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs md:text-sm font-bold font-mono text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                          />

                          {openCodeDropdownIdx === idx && (
                            <div className="absolute z-[70] left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl divide-y divide-slate-100">
                              {rawMaterials
                                .filter(rm => (rm.code || "").toLowerCase().includes((m.material_code || "").toLowerCase()))
                                .map(rm => (
                                  <button
                                    key={rm.id}
                                    type="button"
                                    onClick={() => {
                                      handleMaterialChange(idx, "material_code", rm.code);
                                      setOpenCodeDropdownIdx(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 text-slate-700 font-sans font-medium transition-colors"
                                  >
                                    <div className="font-bold text-blue-600 font-mono">{rm.code}</div>
                                    <div className="text-[10px] text-slate-500 truncate">{rm.name}</div>
                                  </button>
                                ))
                              }
                            </div>
                          )}
                        </div>

                        {/* 2. ชื่อวัตถุดิบ (Autocomplete) */}
                        <div className="flex-1 relative">
                          <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ชื่อวัตถุดิบ</label>
                          <input
                            type="text"
                            value={m.material_name}
                            onChange={(e) => {
                              handleMaterialChange(idx, "material_name", e.target.value);
                              setOpenNameDropdownIdx(idx);
                              setOpenCodeDropdownIdx(null);
                            }}
                            onFocus={() => {
                              setOpenNameDropdownIdx(idx);
                              setOpenCodeDropdownIdx(null);
                            }}
                            onBlur={() => {
                              setTimeout(() => {
                                setOpenNameDropdownIdx(null);
                              }, 250);
                            }}
                            placeholder="พิมพ์ค้นหาชื่อสารเคมี..."
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                          />

                          {openNameDropdownIdx === idx && (
                            <div className="absolute z-[70] left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl divide-y divide-slate-100">
                              {rawMaterials
                                .filter(rm => (rm.name || "").toLowerCase().includes((m.material_name || "").toLowerCase()))
                                .map(rm => (
                                  <button
                                    key={rm.id}
                                    type="button"
                                    onClick={() => {
                                      handleMaterialChange(idx, "material_name", rm.name);
                                      setOpenNameDropdownIdx(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 text-slate-700 font-sans font-medium transition-colors"
                                  >
                                    <div className="font-semibold text-slate-800">{rm.name}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">{rm.code}</div>
                                  </button>
                                ))
                              }
                            </div>
                          )}
                        </div>

                        {/* 3. ปริมาณ (พิมพ์ 0.01 ได้) */}
                        <div className="w-full md:w-28">
                          <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ปริมาณ</label>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            value={m.quantity === undefined || m.quantity === null ? "" : m.quantity}
                            onChange={(e) => handleMaterialChange(idx, "quantity", e.target.value)}
                            placeholder="0.01"
                            required
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs md:text-sm text-right font-bold font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
                          />
                        </div>

                        {/* 4. หน่วยวัด */}
                        <div className="w-full md:w-24">
                          <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">หน่วยวัด</label>
                          <select
                            value={m.unit}
                            onChange={(e) => handleMaterialChange(idx, "unit", e.target.value)}
                            className="w-full px-2 py-2 bg-white border border-slate-300 rounded-xl text-xs md:text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 cursor-pointer"
                          >
                            {standardUnits.map((un, unIdx) => (
                              <option key={unIdx} value={un}>{un}</option>
                            ))}
                          </select>
                        </div>

                        {/* ลบแถว */}
                        <div className="flex items-end justify-end md:items-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterialRow(idx)}
                            className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100"
                            title="ลบแถววัตถุดิบ"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Step-by-Step Manufacturing Instructions (วิธีการผลิต) */}
                <div className="space-y-3 border-t border-slate-150 pt-5">
                  <div className="flex items-center justify-between pb-1.5">
                    <h4 className="text-xs md:text-sm lg:text-base font-extrabold text-slate-800 flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-indigo-500" /> ขั้นตอนและวิธีการผสมผลิตผลิตภัณฑ์สำเร็จรูป
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddInstructionRow}
                      className="text-xs md:text-sm text-indigo-600 font-extrabold hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg transition-all border border-indigo-100 shadow-sm"
                    >
                      + เพิ่มขั้นตอนผลิต
                    </button>
                  </div>

                  <div className="space-y-3">
                    {instructions.map((inst, idx) => (
                      <div key={idx} className="flex gap-3 items-center bg-indigo-50/20 p-3 rounded-xl border border-indigo-100/50 hover:border-indigo-200 transition-all">
                        <span className="w-16 text-xs font-bold text-indigo-600 font-mono text-center bg-indigo-50 px-2.5 py-1 rounded-lg">
                          ขั้นตอน {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={inst.instruction}
                          onChange={(e) => handleInstructionChange(idx, e.target.value)}
                          placeholder="ระบุรายละเอียดขั้นตอนการผสม อุณหภูมิ เวลา หรือข้อระวัง..."
                          required
                          className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveInstructionRow(idx)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
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

      {/* BomPrint integration popup */}
      {isPrintModalOpen && printSelectedBom && (
        <BomPrint
          bom={printSelectedBom}
          rawMaterials={rawMaterials}
          customers={customers}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
}
