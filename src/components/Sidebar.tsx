import React from "react";
import { 
  Factory, 
  Users, 
  ClipboardList, 
  ShieldCheck, 
  FileText, 
  Boxes, 
  ShoppingCart, 
  Layers, 
  Truck, 
  Warehouse, 
  LineChart, 
  Settings,
  Menu,
  BookOpen
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ activePage, setActivePage, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { section: "ภาพรวม", items: [
      { id: "dashboard", label: "แดชบอร์ด", icon: <Layers className="w-4 h-4" /> }
    ]},
    { section: "ข้อมูลหลัก", items: [
      { id: "customer", label: "ลูกค้า", icon: <Users className="w-4 h-4" /> },
      { id: "bom", label: "สูตรการผลิต (BOM)", icon: <ClipboardList className="w-4 h-4" /> }
    ]},
    { section: "การผลิต", items: [
      { id: "precheck", label: "ตรวจสอบก่อนผลิต", icon: <ShieldCheck className="w-4 h-4" /> },
      { id: "production", label: "ใบสั่งผลิต", icon: <FileText className="w-4 h-4" /> },
      { id: "packing", label: "ใบสั่งบรรจุ", icon: <Boxes className="w-4 h-4" /> }
    ]},
    { section: "จัดซื้อและคลัง", items: [
      { id: "purchase", label: "จัดซื้อวัตถุดิบ", icon: <ShoppingCart className="w-4 h-4" /> },
      { id: "grn", label: "รับเข้าคลัง (GRN)", icon: <Truck className="w-4 h-4" /> },
      { id: "inventory", label: "สต็อกคงคลัง", icon: <Warehouse className="w-4 h-4" /> }
    ]},
    { section: "รายงาน", items: [
      { id: "report", label: "รายงานสรุป", icon: <LineChart className="w-4 h-4" /> }
    ]},
    { section: "คู่มือและช่วยเหลือ", items: [
      { id: "manual", label: "คู่มือการใช้งานแบบละเอียด", icon: <BookOpen className="w-4 h-4" /> }
    ]}
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-[#eef5ff] via-[#f3f8ff] to-[#e4efff] text-slate-800 z-50
        flex flex-col border-r border-blue-100/80 transition-transform duration-200
        md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-blue-100/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden flex items-center justify-center">
              <img 
                src="https://lh3.googleusercontent.com/d/1_zQNRVcfcJAWJf4zL4as46PBlvkS_pQO" 
                alt="Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to default Factory icon if image cannot be loaded
                  e.currentTarget.style.display = 'none';
                  const sibling = e.currentTarget.nextElementSibling;
                  if (sibling) {
                    sibling.classList.remove('hidden');
                  }
                }}
              />
              <Factory className="w-5 h-5 text-blue-600 hidden" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider font-display text-blue-600">IDEVA FACTORY OS</h1>
              <p className="text-[10px] text-slate-500 font-sans">ระบบบริหารจัดการโรงงาน</p>
            </div>
          </div>
          <button 
            className="md:hidden p-1 rounded hover:bg-blue-100 text-slate-500 hover:text-slate-800"
            onClick={() => setIsOpen(false)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {menuItems.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold text-blue-900/40 uppercase tracking-wider">
                {sec.section}
              </h3>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const isActive = activePage === item.id;
                  return isActive ? (
                    <div key={item.id} className="relative p-[1.5px] overflow-hidden rounded-xl shadow-sm gold-glass-active transition-all duration-300">
                      {/* Running Gold Glow Line Effect */}
                      <div className="absolute inset-[-500%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_30%,#dfa823_45%,#ffe58f_55%,#dfa823_70%,transparent_100%)] pointer-events-none" />
                      
                      <button
                        onClick={() => {
                          setActivePage(item.id);
                          setIsOpen(false);
                        }}
                        className="relative w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-xs font-bold bg-white/75 backdrop-blur-md text-amber-900/95 border border-white/50 shadow-inner transition-all text-left justify-start"
                      >
                        <span className="text-amber-600 drop-shadow-sm">{item.icon}</span>
                        <span className="font-bold tracking-wide">{item.label}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActivePage(item.id);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-white/50 hover:text-blue-900 transition-all duration-150 text-left justify-start"
                    >
                      <span className="text-slate-400">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-blue-100 flex items-center gap-3 bg-white/30 backdrop-blur-md">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-600">
            ไอ
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-700 truncate" title="บริษัท ไอดีว่า กรุ๊ป จำกัด">บริษัท ไอดีว่า กรุ๊ป จำกัด</h4>
            <p className="text-[10px] text-slate-500 truncate">ผู้ดูแลระบบคลังและสูตร</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
