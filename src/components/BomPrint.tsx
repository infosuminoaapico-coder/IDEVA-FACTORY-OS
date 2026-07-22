import React, { useState } from "react";
import { X, Printer, Settings, Layers, Database, ClipboardCheck, Tag } from "lucide-react";
import { BomRecipe, Customer, RawMaterial } from "../types";

interface BomPrintProps {
  bom: BomRecipe;
  customers: Customer[];
  rawMaterials: RawMaterial[];
  onClose: () => void;
}

export default function BomPrint({ bom, customers, rawMaterials, onClose }: BomPrintProps) {
  // Config States for printing
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | "">("");
  const [customCustomerName, setCustomCustomerName] = useState("");
  const [customCustomerCode, setCustomCustomerCode] = useState("");
  const [batchSize, setBatchSize] = useState<number>(1000);
  const [batchUnit, setBatchUnit] = useState<string>(bom.product_type === "Powder" ? "กก." : "ลิตร");
  const [lotNo, setLotNo] = useState<string>("001");
  const [productType, setProductType] = useState<string>(bom.product_type || "Liquid");
  const [printDate, setPrintDate] = useState<string>(new Date().toISOString().slice(0, 10));

  // Determine Customer details
  const matchedCustomer = customers.find(c => c.id === Number(selectedCustomerId));
  const customerName = matchedCustomer ? matchedCustomer.name : (customCustomerName || "ทั่วไป");
  const customerCode = matchedCustomer ? matchedCustomer.code : (customCustomerCode || "C-TEMP");

  // Format Instructions parsed from BOM notes JSON or raw string
  let instructions: Array<{ instruction: string }> = [];
  if (bom.notes) {
    try {
      if (bom.notes.trim().startsWith("[")) {
        instructions = JSON.parse(bom.notes);
      } else {
        instructions = [{ instruction: bom.notes }];
      }
    } catch (e) {
      instructions = [{ instruction: bom.notes }];
    }
  }
  // Fill up with empty instructions if empty to make the sheet look realistic
  if (instructions.length === 0 || (instructions.length === 1 && !instructions[0].instruction)) {
    instructions = [
      { instruction: "เตรียมภาชนะสะอาดและเครื่องชั่งตรวจสอบความถูกต้องก่อนชั่งสารเคมี" },
      { instruction: "เติมสารลำดับแรก กวนผสมช้าๆ จนสารละลายจนหมดและเนื้อเข้ากันดี" },
      { instruction: "ค่อยๆ เติมสารแต่งกลิ่นและสี กวนต่อด้วยความเร็วสม่ำเสมอเป็นเวลา 15-20 นาที" },
      { instruction: "ตรวจสอบลักษณะทางกายภาพ ค่าความหนืด และค่า pH ให้ได้ตามเกณฑ์มาตรฐาน" }
    ];
  }

  // Calculate Materials totals and ratio
  const totalBOMQty = bom.materials.reduce((sum, m) => sum + (Number(m.quantity) || 0), 0);
  
  // Calculate display rows
  const printMaterials = bom.materials.map((m, idx) => {
    const qty = Number(m.quantity) || 0;
    const ratio = totalBOMQty > 0 ? (qty / totalBOMQty) : 0;
    const wPercent = ratio * 100;
    const oneKgQty = ratio * 1000; // grams per 1 kg of mixture
    
    // Calculate final weight based on batch size
    const finalBatchQty = ratio * batchSize;

    // Find raw material code
    const matchedRm = rawMaterials.find(rm => rm.name.toLowerCase() === m.material_name.toLowerCase());
    const materialCode = matchedRm ? matchedRm.code : "RM-N/A";

    // Set logical parts grouping (A, B, C) based on material part or index
    let part = m.part || "A";
    if (!m.part) {
      if (idx >= 3) part = "B";
      if (idx >= 6) part = "C";
    }

    return {
      no: idx + 1,
      part,
      code: materialCode,
      name: m.material_name,
      percent: wPercent,
      oneKg: oneKgQty,
      oneKgUnit: "g",
      batchQty: finalBatchQty,
      batchUnit: m.unit || "กก.",
      notes: m.notes || ""
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm print:p-0 print:bg-white print:backdrop-blur-none">
      {/* Configuration Form panel - hidden on Print */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 print:hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-150 bg-slate-50">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-slate-800">เครื่องมือพิมพ์เอกสารการผลิต (BPR / ใบชั่ง / ฉลาก)</h3>
              <p className="text-[10px] md:text-xs text-slate-400">กำหนดตัวแปรของล็อตการผลิตเพื่อส่งออกแบบฟอร์มพิมพ์ขนาด A4 นำไปจัดชั่งและกวนผสมจริงในโรงงาน</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setup layout */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* LEFT: Config form panel */}
          <div className="w-full lg:w-80 p-5 bg-slate-50/60 space-y-4 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              <Settings className="w-4 h-4 text-slate-500" /> ตั้งค่าแบทช์การผลิต
            </div>

            {/* Customer select */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">ลูกค้า / แบรนด์</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- ลูกค้าทั่วไป / กำหนดเอง --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.code} - {c.name} {c.contact ? `(${c.contact})` : ""}</option>
                ))}
              </select>
            </div>

            {/* Custom customer fields if "general" is chosen */}
            {!selectedCustomerId && (
              <div className="grid grid-cols-2 gap-2 animate-in fade-in duration-150">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">รหัสลูกค้า</label>
                  <input
                    type="text"
                    value={customCustomerCode}
                    onChange={(e) => setCustomCustomerCode(e.target.value)}
                    placeholder="เช่น C-099"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">ชื่อแบรนด์/ลูกค้า</label>
                  <input
                    type="text"
                    value={customCustomerName}
                    onChange={(e) => setCustomCustomerName(e.target.value)}
                    placeholder="แบรนด์พรีเมียม"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}

            {/* Batch Size & Unit */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">ปริมาณที่จะผลิต</label>
                <input
                  type="number"
                  value={batchSize || ""}
                  onChange={(e) => setBatchSize(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-right"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">หน่วยแบทช์</label>
                <select
                  value={batchUnit}
                  onChange={(e) => setBatchUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-semibold"
                >
                  <option value="กก.">กก. (Powder/Solid)</option>
                  <option value="ลิตร">ลิตร (Liquid/Fluid)</option>
                  <option value="แกลลอน">แกลลอน</option>
                </select>
              </div>
            </div>

            {/* Lot No */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">เลขที่ Lot ผลิต</label>
                <input
                  type="text"
                  value={lotNo}
                  onChange={(e) => setLotNo(e.target.value)}
                  placeholder="เช่น 001"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">ลักษณะผลิตภัณฑ์</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="Liquid">Liquid (ของเหลว)</option>
                  <option value="Powder">Powder (ผงเคมี)</option>
                  <option value="Gel">Gel (เจล)</option>
                  <option value="Cream">Cream (ครีม)</option>
                </select>
              </div>
            </div>

            {/* Print Date */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">วันที่ชั่งสาร/ผลิต</label>
              <input
                type="date"
                value={printDate}
                onChange={(e) => setPrintDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
              />
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={handlePrint}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/15 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> กดพิมพ์เอกสาร (ขนาด A4)
              </button>
              <p className="text-[9px] text-slate-400 mt-2 text-center">ระบบจะสั่งพิมพ์แยกหน้า A4 อัตโนมัติ (เอกสาร 3 หน้า)</p>
            </div>
          </div>

          {/* RIGHT: Live Interactive Print Preview */}
          <div className="flex-1 p-6 bg-slate-100 overflow-y-auto space-y-8 print:p-0 print:bg-white">
            <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 flex items-center justify-between print:hidden">
              <span>ตัวอย่างหน้ากระดาษ A4 เสมือนจริง</span>
              <span className="bg-slate-200 px-2 py-0.5 rounded text-[9px] text-slate-600">3 หน้าพิมพ์</span>
            </div>

            {/* PREVIEW CONTAINER */}
            <div id="print-area" className="mx-auto space-y-12">
              
              {/* PAGE 1: BPR (Batch Processing Record) */}
              <div className="bg-white border border-slate-300 p-[15mm] w-[210mm] min-h-[297mm] shadow-lg font-sans text-slate-900 mx-auto box-border page-break print:border-none print:shadow-none print:p-[10mm]">
                
                {/* Header Section */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                  <div className="text-left">
                    <h1 className="text-lg font-extrabold tracking-tight font-serif text-slate-900">IDEVA GROUP</h1>
                    <p className="text-[9px] font-mono text-slate-500 font-bold">IDEVA GROUP CO., LTD.</p>
                  </div>
                  <div className="text-center flex-1">
                    <h2 className="text-sm font-bold text-slate-900 leading-tight">บันทึกการผลิต</h2>
                    <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">BATCH PROCESSING RECORD (BPR)</h3>
                  </div>
                  <div className="text-right text-[10px] font-mono border border-slate-300 p-1 bg-slate-50">
                    <strong>FM-PD-01</strong>
                  </div>
                </div>

                {/* Metadata Grid Table */}
                <div className="mt-4 border border-slate-950 text-[10px] w-full">
                  <div className="flex border-b border-slate-950">
                    <div className="w-1/2 p-1.5 border-r border-slate-950">
                      <strong>วัน/เวลา ชั่งสาร (เริ่ม-สิ้นสุด) :</strong> .............................................................
                    </div>
                    <div className="w-1/2 p-1.5">
                      <strong>วัน/เวลา ผสม (เริ่ม-สิ้นสุด) :</strong> .............................................................
                    </div>
                  </div>
                  <div className="flex border-b border-slate-950">
                    <div className="w-1/2 p-1.5 border-r border-slate-950">
                      <strong>ชื่อผลิตภัณฑ์ :</strong> <span className="font-bold">{bom.product_name || "-"}</span>
                    </div>
                    <div className="w-1/2 p-1.5">
                      <strong>รหัสผลิตภัณฑ์ :</strong> <span className="font-mono font-bold">{bom.product_code || "-"}</span>
                    </div>
                  </div>
                  <div className="flex border-b border-slate-950">
                    <div className="w-1/3 p-1.5 border-r border-slate-950">
                      <strong>ชื่อลูกค้า :</strong> <span className="font-bold">{customerName}</span>
                    </div>
                    <div className="w-1/3 p-1.5 border-r border-slate-950">
                      <strong>รหัสลูกค้า :</strong> <span className="font-mono font-bold">{customerCode}</span>
                    </div>
                    <div className="w-1/3 p-1.5">
                      <strong>ปริมาณรุ่นที่ผลิต :</strong> <span className="font-mono font-bold text-blue-600">{batchSize.toLocaleString()} {batchUnit}</span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 p-1.5 border-r border-slate-950">
                      <strong>ลักษณะผลิตภัณฑ์ :</strong> <span className="font-bold">{productType}</span>
                    </div>
                    <div className="w-1/2 p-1.5">
                      <strong>Lot :</strong> <span className="font-mono font-bold text-indigo-600">{lotNo}</span>
                    </div>
                  </div>
                </div>

                {/* Section Title: ปริมาณชั่ง */}
                <h4 className="mt-4 text-[11px] font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" /> ปริมาณชั่ง (Ingredient Formulation Sheet)
                </h4>

                {/* Materials List Table */}
                <table className="mt-1.5 w-full border-collapse border border-slate-950 text-[9px]">
                  <thead>
                    <tr className="bg-slate-100 text-center font-bold">
                      <th className="border border-slate-950 p-1 w-8">ลำดับ</th>
                      <th className="border border-slate-950 p-1 w-20">Lot.วัตถุดิบ</th>
                      <th className="border border-slate-950 p-1 w-8">Part</th>
                      <th className="border border-slate-950 p-1 w-20">รหัสวัตถุดิบ</th>
                      <th className="border border-slate-950 p-1">ชื่อวัตถุดิบ</th>
                      <th className="border border-slate-950 p-1 w-12">(% w/w)</th>
                      <th className="border border-slate-950 p-1 w-16">1 KG (g)</th>
                      <th className="border border-slate-950 p-1 w-24">ปริมาณผลิต ({batchSize} {batchUnit})</th>
                      <th className="border border-slate-950 p-1 w-12">ผู้ชั่ง</th>
                      <th className="border border-slate-950 p-1 w-12">ผู้ทวนสอบ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printMaterials.map((m) => (
                      <tr key={m.no} className="h-7 text-center">
                        <td className="border border-slate-950 p-1 font-mono text-slate-500">{m.no}</td>
                        <td className="border border-slate-950 p-1 font-mono">..................</td>
                        <td className="border border-slate-950 p-1 font-bold">{m.part}</td>
                        <td className="border border-slate-950 p-1 font-mono text-left">{m.code}</td>
                        <td className="border border-slate-950 p-1 text-left font-semibold">{m.name}</td>
                        <td className="border border-slate-950 p-1 font-mono">{m.percent.toFixed(2)}%</td>
                        <td className="border border-slate-950 p-1 font-mono">{m.oneKg.toFixed(2)}</td>
                        <td className="border border-slate-950 p-1 font-mono font-bold bg-slate-50 text-blue-700 text-right">
                          {m.batchQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {m.batchUnit}
                        </td>
                        <td className="border border-slate-950 p-1"></td>
                        <td className="border border-slate-950 p-1"></td>
                      </tr>
                    ))}
                    {/* Sum row */}
                    <tr className="bg-slate-50 font-bold text-right h-7">
                      <td colSpan={5} className="border border-slate-950 p-1 text-center font-bold">รวมสูตรผสมมาตรฐาน</td>
                      <td className="border border-slate-950 p-1 text-center font-mono">100.00%</td>
                      <td className="border border-slate-950 p-1 text-center font-mono">1,000.00</td>
                      <td className="border border-slate-950 p-1 font-mono text-right text-blue-800">
                        {batchSize.toLocaleString()} {batchUnit}
                      </td>
                      <td colSpan={2} className="border border-slate-950 bg-slate-100"></td>
                    </tr>
                  </tbody>
                </table>

                {/* Section Title: วิธีการผลิต */}
                <h4 className="mt-4 text-[11px] font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                  <ClipboardCheck className="w-3.5 h-3.5" /> วิธีการผลิต (Manufacturing Instructions & Steps)
                </h4>

                {/* Instruction Steps Table */}
                <table className="mt-1.5 w-full border-collapse border border-slate-950 text-[9px]">
                  <thead>
                    <tr className="bg-slate-100 font-bold">
                      <th className="border border-slate-950 p-1 w-10 text-center">ลำดับ</th>
                      <th className="border border-slate-950 p-1 text-left">วิธีการผลิต / ขั้นตอนผสมสารเคมีสำเร็จรูป</th>
                      <th className="border border-slate-950 p-1 w-24 text-center">ผลการดำเนินงาน</th>
                      <th className="border border-slate-950 p-1 w-16 text-center">ผู้บันทึก</th>
                      <th className="border border-slate-950 p-1 w-16 text-center">ผู้ตรวจสอบ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructions.map((inst, index) => (
                      <tr key={index} className="h-9">
                        <td className="border border-slate-950 p-1 text-center font-mono font-bold">{index + 1}</td>
                        <td className="border border-slate-950 p-1 text-left font-medium leading-relaxed max-w-sm">{inst.instruction}</td>
                        <td className="border border-slate-950 p-1 text-center text-[8px] text-slate-400">........................</td>
                        <td className="border border-slate-950 p-1"></td>
                        <td className="border border-slate-950 p-1"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Production result validation box */}
                <div className="mt-4 border border-slate-950 text-[9px]">
                  <div className="flex bg-slate-50 font-bold border-b border-slate-950 text-center">
                    <div className="w-1/4 p-1 border-r border-slate-950">ปริมาณตามทฤษฎี</div>
                    <div className="w-1/4 p-1 border-r border-slate-950">ปริมาณที่ควรผลิตได้</div>
                    <div className="w-1/4 p-1 border-r border-slate-950">ปริมาณที่ผลิตได้จริง</div>
                    <div className="w-1/4 p-1">ผู้บันทึกสรุป</div>
                  </div>
                  <div className="flex text-center h-7 items-center">
                    <div className="w-1/4 p-1 border-r border-slate-950 font-mono font-bold text-slate-700">{batchSize.toLocaleString()} {batchUnit}</div>
                    <div className="w-1/4 p-1 border-r border-slate-950 font-mono">...........................</div>
                    <div className="w-1/4 p-1 border-r border-slate-950 font-mono">...........................</div>
                    <div className="w-1/4 p-1 font-mono">...........................</div>
                  </div>
                </div>

                <div className="mt-3 p-1.5 border border-slate-950 rounded bg-slate-50 text-[8.5px] leading-relaxed text-slate-500">
                  <strong>หมายเหตุ / ข้อควรระวังพิเศษ :</strong> สวมใส่อุปกรณ์ป้องกันภัยส่วนบุคคล (PPE) อาทิ แว่นตานิรภัย หน้ากากกรองสารเคมี และถุงมือยางกันสารเคมีทุกครั้งขณะทำการจัดเตรียม และดำเนินกระบวนการกวนผสมสูตรผลิตภัณฑ์เคมีโรงงาน
                </div>

                {/* Signatures Section */}
                <div className="mt-5 grid grid-cols-3 gap-6 text-[9px]">
                  <div className="border border-slate-950 p-2 text-center space-y-3">
                    <div className="font-bold underline">ผู้บันทึกกระบวนการผลิต</div>
                    <div className="pt-2 text-slate-400">............................................................</div>
                    <div>ตำแหน่ง : ............................................</div>
                    <div>วันที่ : ......... / ......... / .............</div>
                  </div>
                  <div className="border border-slate-950 p-2 text-center space-y-3">
                    <div className="font-bold underline">ผู้ตรวจสอบ (QA/QC Auditor)</div>
                    <div className="pt-2 text-slate-400">............................................................</div>
                    <div>ตำแหน่ง : ............................................</div>
                    <div>วันที่ : ......... / ......... / .............</div>
                  </div>
                  <div className="border border-slate-950 p-2 text-center space-y-3">
                    <div className="font-bold underline">ผู้อนุมัติการปล่อยล็อตสินค้า</div>
                    <div className="pt-2 text-slate-400">............................................................</div>
                    <div>ตำแหน่ง : ............................................</div>
                    <div>วันที่ : ......... / ......... / .............</div>
                  </div>
                </div>

                {/* Page Footer */}
                <div className="mt-5 flex justify-between text-[8px] text-slate-400 font-mono font-bold border-t border-slate-200 pt-2">
                  <span>IDEVA FACTORY SYSTEM (BOM OS)</span>
                  <span>FM-PD-01 BPR บันทึกการผลิต Rev.02 บังคับใช้ 01.09.2566</span>
                  <span>หน้า 1/3</span>
                </div>

              </div>

              {/* PAGE 2: WEIGHING SHEET */}
              <div className="bg-white border border-slate-300 p-[15mm] w-[210mm] min-h-[297mm] shadow-lg font-sans text-slate-900 mx-auto box-border page-break print:border-none print:shadow-none print:p-[10mm] print:mt-0">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                  <div className="text-left">
                    <h1 className="text-lg font-extrabold tracking-tight font-serif text-slate-900">IDEVA GROUP</h1>
                    <p className="text-[9px] font-mono text-slate-500 font-bold">IDEVA GROUP CO., LTD.</p>
                  </div>
                  <div className="text-center flex-1">
                    <h2 className="text-sm font-bold text-slate-900 leading-tight">ชั่งสารสำหรับผลิต</h2>
                    <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Weighing for production</h3>
                  </div>
                  <div className="text-right text-[10px] font-mono border border-slate-300 p-1 bg-slate-50">
                    <strong>FM-PD-02</strong>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-4 border border-slate-950 text-[10px] w-full">
                  <div className="flex border-b border-slate-950">
                    <div className="w-1/2 p-2 border-r border-slate-950">
                      <strong>ชื่อผลิตภัณฑ์ :</strong> <span className="font-bold">{bom.product_name || "-"}</span>
                    </div>
                    <div className="w-1/2 p-2">
                      <strong>รหัสผลิตภัณฑ์ :</strong> <span className="font-mono font-bold">{bom.product_code || "-"}</span>
                    </div>
                  </div>
                  <div className="flex border-b border-slate-950">
                    <div className="w-1/2 p-2 border-r border-slate-950">
                      <strong>ชื่อลูกค้า/แบรนด์ :</strong> <span className="font-bold">{customerName}</span>
                    </div>
                    <div className="w-1/2 p-2">
                      <strong>ปริมาณที่ผลิต :</strong> <span className="font-mono font-bold text-blue-600">{batchSize.toLocaleString()} {batchUnit}</span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 p-2 border-r border-slate-950">
                      <strong>Lot :</strong> <span className="font-mono font-bold text-indigo-600">{lotNo}</span>
                    </div>
                    <div className="w-1/2 p-2">
                      <strong>วันที่ชั่งสาร :</strong> <span className="font-mono font-bold">{printDate}</span>
                    </div>
                  </div>
                </div>

                <table className="mt-6 w-full border-collapse border border-slate-950 text-[10px]">
                  <thead>
                    <tr className="bg-slate-100 text-center font-bold">
                      <th className="border border-slate-950 p-2 w-12">NO.</th>
                      <th className="border border-slate-950 p-2 w-32">RM CODE</th>
                      <th className="border border-slate-950 p-2">RM NAME</th>
                      <th className="border border-slate-950 p-2 w-36 text-right">ปริมาณการผลิต</th>
                      <th className="border border-slate-950 p-2 w-20">หน่วย</th>
                      <th className="border border-slate-950 p-2 w-36">ปริมาณที่ชั่งได้จริง</th>
                      <th className="border border-slate-950 p-2 w-20">หน่วย</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printMaterials.map((m, idx) => (
                      <tr key={idx} className="h-8 text-center">
                        <td className="border border-slate-950 p-2 font-mono text-slate-500">{idx + 1}</td>
                        <td className="border border-slate-950 p-2 font-mono text-left">{m.code}</td>
                        <td className="border border-slate-950 p-2 text-left font-bold text-slate-800">{m.name}</td>
                        <td className="border border-slate-950 p-2 text-right font-mono font-extrabold text-blue-700">
                          {m.batchQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="border border-slate-950 p-2 font-semibold">{m.batchUnit}</td>
                        <td className="border border-slate-950 p-2 text-center text-slate-300 font-mono">...........................</td>
                        <td className="border border-slate-950 p-2 text-center text-slate-400 font-mono">{m.batchUnit}</td>
                      </tr>
                    ))}
                    {/* Sum row */}
                    <tr className="bg-slate-50 font-bold h-8">
                      <td colSpan={3} className="border border-slate-950 p-2 text-center">ยอดรวมชั่งสารวัตถุดิบทั้งหมด</td>
                      <td className="border border-slate-950 p-2 text-right font-mono text-blue-800">
                        {batchSize.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="border border-slate-950 p-2 text-center">{batchUnit}</td>
                      <td className="border border-slate-950 p-2 text-center text-slate-300 font-mono">...........................</td>
                      <td className="border border-slate-950 p-2 text-center">{batchUnit}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Validation Note */}
                <div className="mt-8 p-3 border border-slate-950 bg-slate-50 text-[10px] leading-relaxed rounded text-slate-700">
                  <strong>ข้อกำหนดในการทวนสอบการชั่งสารเคมี :</strong> ผู้ทำการจัดตวงและชั่งสารเคมีดิบหลัก ต้องบันทึกรายงานผลการชั่งน้ำหนักสารเคมีในระบบใบตรวจสอบ พร้อมให้เจ้าหน้าที่วิเคราะห์คุณภาพ (QC Analyst) หรือผู้ได้รับมอบหมาย ร่วมทวนสอบลายเซ็นกำกับยอดจริงทุกรายการเพื่อรับประกันความถูกต้องแม่นยำสูงสุดก่อนเข้าสู่วาล์วถังผสมโรงงาน
                </div>

                {/* Signature box */}
                <div className="mt-12 grid grid-cols-2 gap-10 text-[10px]">
                  <div className="border border-slate-950 p-4 text-center space-y-4 rounded">
                    <div className="font-bold underline uppercase">ลงชื่อผู้ชั่งสาร (Weighed By)</div>
                    <div className="pt-3 text-slate-400">................................................................................</div>
                    <div>วันที่ (Date) : ......... / ......... / .............</div>
                  </div>
                  <div className="border border-slate-950 p-4 text-center space-y-4 rounded">
                    <div className="font-bold underline uppercase">ลงชื่อผู้ทวนสอบ (Double Checked By)</div>
                    <div className="pt-3 text-slate-400">................................................................................</div>
                    <div>วันที่ (Date) : ......... / ......... / .............</div>
                  </div>
                </div>

                {/* Page Footer */}
                <div className="mt-20 flex justify-between text-[8px] text-slate-400 font-mono font-bold border-t border-slate-200 pt-2">
                  <span>IDEVA FACTORY SYSTEM (BOM OS)</span>
                  <span>FM-PD-02 WEIGHING SHEET Rev.02 บังคับใช้ 01.09.2566</span>
                  <span>หน้า 2/3</span>
                </div>
              </div>

              {/* PAGE 3: WEIGHING LABELS (ฉลากชั่งวัตถุดิบ) */}
              <div className="bg-white border border-slate-300 p-[15mm] w-[210mm] min-h-[297mm] shadow-lg font-sans text-slate-900 mx-auto box-border print:border-none print:shadow-none print:p-[10mm] print:mt-0">
                
                {/* Header title */}
                <div className="text-center border-b-2 border-slate-900 pb-2 mb-4">
                  <h2 className="text-sm font-bold text-slate-900">ฉลากสำหรับระบุการชั่งสารเคมีวัตถุดิบรายถุง / ถัง</h2>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">WEIGHING LABELS REPORT (FM-PD-04)</h3>
                </div>

                {/* Grid of labels */}
                <div className="grid grid-cols-2 gap-4">
                  {printMaterials.map((m, idx) => (
                    <div key={idx} className="border border-slate-950 p-3 flex flex-col justify-between text-[9px] bg-white rounded-lg relative overflow-hidden h-[130mm] box-border shadow-sm print:shadow-none">
                      
                      {/* Label header */}
                      <div className="border-b border-slate-400 pb-1.5 flex justify-between items-center bg-slate-50 -m-3 p-2.5 mb-2 font-bold text-slate-800">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-blue-600" /> ฉลากชั่งวัตถุดิบ
                        </span>
                        <span className="text-[8px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                          NO. {idx + 1} / PART {m.part}
                        </span>
                      </div>

                      {/* Label Body metadata */}
                      <div className="space-y-1.5 flex-1">
                        <div>
                          <strong className="text-slate-500">ชื่อผลิตภัณฑ์ :</strong> <span className="font-semibold text-slate-900">{bom.product_name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <strong className="text-slate-500">รหัสสินค้า :</strong> <span className="font-mono font-bold">{bom.product_code}</span>
                          </div>
                          <div>
                            <strong className="text-slate-500">Batch/Lot No :</strong> <span className="font-mono font-bold text-indigo-600">{lotNo}</span>
                          </div>
                        </div>

                        <div className="border-t border-dashed border-slate-300 my-1.5 pt-1.5">
                          <div className="font-semibold bg-blue-50/50 p-1 text-[10px] text-blue-900 border border-blue-100 rounded">
                            <strong className="text-blue-700">รหัสวัตถุดิบ :</strong> <span className="font-mono font-bold">{m.code}</span>
                          </div>
                        </div>

                        <div>
                          <strong className="text-slate-500">ชื่อวัตถุดิบ :</strong> <span className="font-bold text-slate-900 text-[10px]">{m.name}</span>
                        </div>

                        <div>
                          <strong className="text-slate-500">Batch/Lot No วัตถุดิบเคมีดิบ :</strong> <span className="font-mono text-slate-400">...................................................</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 border border-slate-200 rounded my-1 font-mono">
                          <div>
                            <strong>น้ำหนักภาชนะ :</strong>
                            <p className="text-slate-400 text-[8px] mt-0.5">.................................. Kg/g</p>
                          </div>
                          <div className="border-l border-slate-300 pl-2">
                            <strong className="text-blue-700">นน.สารที่ชั่งจริง :</strong>
                            <p className="text-blue-800 font-extrabold text-[10px] mt-0.5">
                              {m.batchQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {m.batchUnit}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Label Signatures */}
                      <div className="border-t border-slate-300 pt-2 mt-2 space-y-1">
                        <div className="flex justify-between items-center">
                          <span><strong>ผู้ทำการชั่งสาร :</strong> ............................................</span>
                          <span><strong>วันที่ :</strong> ....../....../......</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span><strong>ผู้ตรวจสอบ :</strong> ............................................</span>
                          <span><strong>วันที่ :</strong> ....../....../......</span>
                        </div>
                      </div>

                      {/* Label Footer document code */}
                      <div className="text-[7.5px] text-slate-400 font-mono text-right mt-1 border-t border-slate-100 pt-1">
                        FM-PD-04 REV.02 บังคับใช้ 01.09.2566
                      </div>
                    </div>
                  ))}
                </div>

                {/* Page Footer */}
                <div className="mt-8 flex justify-between text-[8px] text-slate-400 font-mono font-bold border-t border-slate-200 pt-2">
                  <span>IDEVA FACTORY SYSTEM (BOM OS)</span>
                  <span>FM-PD-04 WEIGHING LABELS Rev.02 บังคับใช้ 01.09.2566</span>
                  <span>หน้า 3/3</span>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Global CSS Inject to customize printing behavior beautifully */}
      <style>{`
        @media print {
          /* Hide everything outside of print area */
          body * {
            visibility: hidden;
            background: none !important;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            box-shadow: none !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          /* Ensure nice typography & margins on paper */
          @page {
            size: A4;
            margin: 0;
          }
          input, select, textarea {
            border: none !important;
            outline: none !important;
            background: transparent !important;
          }
        }
      `}</style>
    </div>
  );
}
