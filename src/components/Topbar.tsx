import React from "react";
import { Bell, Search, Menu, Calendar, Clock } from "lucide-react";

interface TopbarProps {
  activePage: string;
  setSidebarOpen: (open: boolean) => void;
  lowStockCount: number;
  dbStatus: any;
  activeTheme?: string;
  setActiveTheme?: (theme: string) => void;
}

export default function Topbar({ 
  activePage, 
  setSidebarOpen, 
  lowStockCount, 
  dbStatus,
  activeTheme,
  setActiveTheme 
}: TopbarProps) {
  const pageTitles: Record<string, string> = {
    dashboard: "แดชบอร์ดภาพรวม",
    customer: "ข้อมูลลูกค้าและแบรนด์",
    bom: "สูตรการผลิต (BOM)",
    precheck: "ตรวจสอบเคมีภัณฑ์ก่อนผลิต",
    production: "ใบสั่งผลิต (Production Orders)",
    packing: "ใบสั่งบรรจุภัณฑ์ (Packing)",
    purchase: "ใบสั่งซื้อเคมีภัณฑ์",
    grn: "ใบรับเข้าคลังสินค้า (GRN)",
    inventory: "คลังสินค้าและวัตถุดิบ",
    report: "รายงานสรุปโรงงาน"
  };

  const [time, setTime] = React.useState("");
  const [date, setDate] = React.useState("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDate(now.toLocaleDateString("th-TH", { day: "2-digit", month: "long", year: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 h-16 px-4 md:px-6 flex items-center justify-between z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm md:text-base font-bold text-slate-800 font-display">
            {pageTitles[activePage] || activePage}
          </h2>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-500 mt-0.5 font-sans">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {date}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {time} น.
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {dbStatus ? (
          dbStatus.useSupabase ? (
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Supabase Connected ⚡
            </div>
          ) : dbStatus.useMySQL ? (
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              MySQL: เชื่อมต่อแล้ว ({dbStatus.user}@{dbStatus.host})
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
              ระบบออฟไลน์ (In-Memory Fallback)
            </div>
          )
        ) : (
          <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-500 px-2.5 py-1 rounded-full text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></span>
            กำลังตรวจสอบระบบ...
          </div>
        )}

        {lowStockCount > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 px-2.5 py-1 rounded-full text-[10px] font-semibold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            พบวัตถุดิบต่ำกว่าขั้นต่ำ {lowStockCount} รายการ!
          </div>
        )}

        {/* Pastel Theme Selector (โทนอ่อน บาง ๆ) */}
        <div className="flex items-center gap-1 bg-slate-100/70 border border-slate-200 px-2 py-1 rounded-full text-xs">
          <span className="text-[10px] text-slate-400 font-medium px-1 hidden lg:inline">ธีมพาสเทล:</span>
          <div className="flex items-center gap-1">
            {[
              { id: "blue", name: "ฟ้า", color: "#60a5fa" },
              { id: "sage", name: "เขียว", color: "#34d399" },
              { id: "rose", name: "ชมพู", color: "#fb7185" },
              { id: "lavender", name: "ม่วง", color: "#a78bfa" },
              { id: "amber", name: "พีช", color: "#fbbf24" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTheme?.(t.id)}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 hover:scale-110 ${
                  activeTheme === t.id
                    ? "ring-2 ring-slate-400 border-white"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: t.color }}
                title={t.name}
              />
            ))}
          </div>
        </div>

        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
          <Bell className="w-4 h-4" />
          {lowStockCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          )}
        </button>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right">
            <h4 className="text-xs font-semibold text-slate-700">Somchai J.</h4>
            <p className="text-[9px] text-slate-400">Admin Supervisor</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-blue-200 border-2 border-white">
            SJ
          </div>
        </div>
      </div>
    </header>
  );
}
