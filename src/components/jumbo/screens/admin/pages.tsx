"use client";

import { useJumbo } from "@/store/jumbo";
import {
  Users,
  Truck,
  ShieldCheck,
  IdCard,
  Briefcase,
  Tag,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronRight,
  TrendingUp,
  Wallet,
  Send,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

// === A03: Users ===
export function AdminUsersPage() {
  return (
    <Page
      title="ผู้ใช้งาน"
      count="1,420 ราย"
      subtitle="รายการผู้ใช้งานทั้งหมดในระบบ"
      headers={["รหัส", "ชื่อ", "เบอร์", "งาน", "สถานะ"]}
      rows={[
        ["USR-1024", "สมชาย ใจดี", "081-234-5678", "23", "ใช้งาน"],
        ["USR-1023", "สมหญิง ใจเย็น", "082-345-6789", "8", "ใช้งาน"],
        ["USR-1022", "อนุชา รักไทย", "089-999-9999", "0", "ใช้งาน"],
        ["USR-1021", "วันดี มีสุข", "081-555-1212", "42", "ระงับ"],
      ]}
    />
  );
}

// === A04: Drivers ===
export function AdminDriversPage() {
  return (
    <Page
      title="คนขับ"
      count="248 คน"
      subtitle="รายการ Driver ทั้งหมด"
      headers={["รหัส", "ชื่อ", "รถ", "คะแนน", "สถานะ"]}
      rows={[
        ["JG-00108", "สมชาย ใจดี", "กระบะตู้ทึบ", "4.8", "ออนไลน์"],
        ["JG-00107", "วันดี มีสุข", "6 ล้อ", "4.9", "ออฟไลน์"],
        ["JG-00106", "อนุชา รักไทย", "จัมโบ้", "4.7", "ออฟไลน์"],
        ["JG-00105", "ประยุทธ สดใส", "กระบะ", "4.6", "ระงับ"],
      ]}
    />
  );
}

// === A05: KYC Review ===
export function AdminKycPage() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div>
      <PageHeader
        title="ตรวจ KYC"
        count="14 รอตรวจ"
        subtitle="คำขอตรวจสอบ KYC จาก Driver ใหม่"
      />

      {selected === null ? (
        <div className="flex flex-col gap-2">
          {[
            { id: "KYC-1024", name: "สมชาย ใจดี", vehicle: "กระบะตู้ทึบ", time: "5 นาที", docs: 10 },
            { id: "KYC-1023", name: "วันดี มีสุข", vehicle: "6 ล้อ", time: "20 นาที", docs: 10 },
            { id: "KYC-1022", name: "อนุชา รักไทย", vehicle: "จัมโบ้", time: "1 ชม.", docs: 8 },
            { id: "KYC-1021", name: "ประยุทธ สดใส", vehicle: "กระบะ", time: "2 ชม.", docs: 9 },
          ].map((k) => (
            <div
              key={k.id}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jumbo text-[12px] font-bold text-white">
                {k.name.charAt(0)}
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-ink">{k.name}</p>
                <p className="text-[11px] text-ink-muted">
                  {k.id} • {k.vehicle} • {k.docs} เอกสาร • ส่ง {k.time}
                </p>
              </div>
              <button
                onClick={() => setSelected(k.id)}
                className="flex items-center gap-1 rounded-lg bg-jumbo px-3 py-1.5 text-[11px] font-bold text-white"
              >
                <Eye className="h-3 w-3" /> ตรวจสอบ
              </button>
            </div>
          ))}
        </div>
      ) : (
        <KycDetailPanel id={selected} onBack={() => setSelected(null)} />
      )}
    </div>
  );
}

function KycDetailPanel({ id, onBack }: { id: string; onBack: () => void }) {
  const [reason, setReason] = useState("");
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-3"
    >
      <button
        onClick={onBack}
        className="self-start text-[12px] font-bold text-jumbo"
      >
        ← ย้อนกลับ
      </button>
      <div className="rounded-2xl border border-line bg-white p-3">
        <p className="text-[13px] font-bold text-ink">{id} — สมชาย ใจดี</p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
          {[
            "บัตรประชาชน (หน้า)",
            "บัตรประชาชน (หลัง)",
            "Selfie",
            "ใบขับขี่ (หน้า)",
            "ใบขับขี่ (หลัง)",
            "เล่มทะเบียน",
            "พ.ร.บ.",
            "รูปหน้ารถ",
            "รูปด้านข้าง",
            "สมุดบัญชี",
          ].map((d, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 rounded-lg bg-surface p-2"
            >
              <IdCard className="h-3.5 w-3.5 flex-shrink-0 text-ink-muted" />
              <span className="truncate text-[10px] text-ink">{d}</span>
              <Eye className="ml-auto h-3 w-3 text-jumbo" />
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-ink-muted">
          เอกสารแสดงผ่าน Signed URL ที่หมดอายุใน 10 นาที
        </p>
      </div>

      {decision === null ? (
        <div className="flex gap-2">
          <button
            onClick={() => setDecision("reject")}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl border-2 border-jumbo bg-white py-2.5 text-[12px] font-bold text-jumbo"
          >
            <XCircle className="h-4 w-4" /> ปฏิเสธ
          </button>
          <button
            onClick={() => setDecision("approve")}
            className="flex flex-[1.4] items-center justify-center gap-1 rounded-xl bg-green-600 py-2.5 text-[12px] font-bold text-white"
          >
            <CheckCircle2 className="h-4 w-4" /> อนุมัติ
          </button>
        </div>
      ) : decision === "approve" ? (
        <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-3 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
          <p className="mt-1 text-[13px] font-bold text-green-700">
            อนุมัติ KYC แล้ว
          </p>
          <p className="text-[11px] text-green-700">
            Driver จะได้รับแจ้งเตือน และเปิดรับงานได้ทันที
          </p>
          <button
            onClick={onBack}
            className="mt-2 rounded-lg bg-green-600 px-3 py-1.5 text-[11px] font-bold text-white"
          >
            เสร็จสิ้น
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-jumbo bg-jumbo-light p-3">
          <p className="text-[12px] font-bold text-jumbo-dark">
            เหตุผลที่ปฏิเสธ
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="ระบุเหตุผล เช่น รูปบัตรไม่ชัด"
            className="mt-2 h-20 w-full rounded-lg border border-line bg-white p-2 text-[12px] outline-none placeholder:text-ink-muted/60 focus:border-jumbo"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setDecision(null)}
              className="flex-1 rounded-lg border border-line bg-white py-2 text-[11px] font-bold text-ink"
            >
              ยกเลิก
            </button>
            <button
              onClick={onBack}
              disabled={reason.length < 5}
              className="flex-1 rounded-lg bg-jumbo py-2 text-[11px] font-bold text-white disabled:opacity-50"
            >
              ส่งการปฏิเสธ
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// === A06: Vehicles ===
export function AdminVehiclesPage() {
  return (
    <Page
      title="รถ"
      count="312 คัน"
      subtitle="รถที่ลงทะเบียนในระบบ"
      headers={["ทะเบียน", "ประเภท", "Driver", "สถานะ"]}
      rows={[
        ["ขข 1234", "กระบะตู้ทึบ", "JG-00108", "อนุมัติ"],
        ["กก 5678", "6 ล้อ", "JG-00107", "อนุมัติ"],
        ["ขค 9012", "จัมโบ้", "JG-00106", "รอตรวจ"],
        ["กง 3456", "กระบะ", "JG-00105", "ตีกลบ"],
      ]}
    />
  );
}

// === A07: Jobs ===
export function AdminJobsPage() {
  return (
    <Page
      title="งานทั้งหมด"
      count="86 วันนี้"
      subtitle="งานทั้งหมดในระบบ (สามารถค้นหา/กรองได้)"
      headers={["รหัส", "เส้นทาง", "รถ", "ยอด", "สถานะ"]}
      rows={[
        ["JG-00108", "บ้าน→สนามบิน", "ตู้ทึบ", "619", "กำลังทำ"],
        ["JG-00107", "ออฟฟิศ→ไอคอน", "กระบะ", "450", "เสร็จสิ้น"],
        ["JG-00106", "บางนา→สุว.", "6 ล้อ", "720", "เสร็จสิ้น"],
        ["JG-00105", "ลาดพร้าว→สยาม", "จัมโบ้", "380", "ยกเลิก"],
      ]}
    />
  );
}

// === A08: Pricing ===
export function AdminPricingPage() {
  const [prices, setPrices] = useState(
    [
      { type: "กระบะ", base: 150, perKm: 12 },
      { type: "กระบะตู้ทึบ", base: 220, perKm: 15 },
      { type: "กระบะคอก", base: 240, perKm: 16 },
      { type: "จัมโบ้", base: 420, perKm: 22 },
      { type: "6 ล้อ", base: 650, perKm: 30 },
    ],
  );
  return (
    <div>
      <PageHeader
        title="ตั้งค่าราคา"
        count=""
        subtitle="คำนวณราคาตามระยะทางและประเภทรถ"
      />
      <div className="flex flex-col gap-2">
        {prices.map((p, i) => (
          <div
            key={p.type}
            className="rounded-2xl border border-line bg-white p-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-bold text-ink">{p.type}</p>
              <button className="flex items-center gap-1 text-[11px] font-bold text-jumbo">
                <Edit className="h-3 w-3" /> แก้ไข
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-surface p-2">
                <p className="text-[10px] text-ink-muted">ราคาเริ่มต้น</p>
                <p className="text-[15px] font-bold text-jumbo">฿{p.base}</p>
              </div>
              <div className="rounded-lg bg-surface p-2">
                <p className="text-[10px] text-ink-muted">ราคา/กม.</p>
                <p className="text-[15px] font-bold text-jumbo">฿{p.perKm}</p>
              </div>
            </div>
            <input
              type="range"
              min={50}
              max={1000}
              value={p.base}
              onChange={(e) => {
                const v = +e.target.value;
                setPrices((prev) =>
                  prev.map((x, idx) => (idx === i ? { ...x, base: v } : x)),
                );
              }}
              className="mt-2 w-full accent-jumbo"
              aria-label="ราคาเริ่มต้น"
            />
          </div>
        ))}
      </div>
      <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border-2 border-dashed border-jumbo bg-jumbo-light py-2.5 text-[12px] font-bold text-jumbo">
        <Plus className="h-4 w-4" /> เพิ่มประเภทรถ
      </button>
    </div>
  );
}

// === A09: Payments ===
export function AdminPaymentsPage() {
  return (
    <div>
      <PageHeader
        title="การชำระเงิน"
        count="฿84,500 วันนี้"
        subtitle="การชำระเงินและการโอนเงินให้ Driver"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-line bg-white p-3">
          <Wallet className="h-5 w-5 text-jumbo" />
          <p className="mt-1 text-[20px] font-extrabold text-ink">฿84.5k</p>
          <p className="text-[10px] text-ink-muted">ยอดรับวันนี้</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-3">
          <Send className="h-5 w-5 text-jumbo" />
          <p className="mt-1 text-[20px] font-extrabold text-ink">฿38.2k</p>
          <p className="text-[10px] text-ink-muted">โอนให้ Driver แล้ว</p>
        </div>
      </div>
      <p className="mb-2 mt-4 px-1 text-[12px] font-bold text-ink">
        รายการโอนล่าสุด
      </p>
      <div className="flex flex-col gap-2">
        {[
          ["TXN-5021", "สมชาย ใจดี", "1,250", "สำเร็จ", "10:42"],
          ["TXN-5020", "วันดี มีสุข", "5,400", "สำเร็จ", "08:15"],
          ["TXN-5019", "อนุชา รักไทย", "2,800", "รอโอน", "เมื่อวาน"],
          ["TXN-5018", "ประยุทธ สดใส", "3,100", "สำเร็จ", "เมื่อวาน"],
        ].map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-xl border border-line bg-white p-3"
          >
            <div className="flex-1">
              <p className="text-[12px] font-bold text-ink">{r[0]}</p>
              <p className="text-[10px] text-ink-muted">
                {r[1]} • {r[4]}
              </p>
            </div>
            <span className="text-[13px] font-bold text-jumbo">฿{r[2]}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                r[3] === "สำเร็จ"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {r[3]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// === A10: Reports ===
export function AdminReportsPage() {
  return (
    <div>
      <PageHeader
        title="รายงาน"
        count=""
        subtitle="สรุปและวิเคราะห์ข้อมูลการทำงาน"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-line bg-white p-3">
          <p className="text-[11px] text-ink-muted">งานรวมเดือนนี้</p>
          <p className="text-[20px] font-extrabold text-jumbo">2,420</p>
          <p className="text-[10px] text-green-600">↑ 18% จากเดือนก่อน</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-3">
          <p className="text-[11px] text-ink-muted">รายได้รวมเดือนนี้</p>
          <p className="text-[20px] font-extrabold text-jumbo">฿1.84M</p>
          <p className="text-[10px] text-green-600">↑ 12% จากเดือนก่อน</p>
        </div>
      </div>

      {/* bar chart */}
      <div className="mt-3 rounded-2xl border border-line bg-white p-3">
        <p className="text-[12px] font-bold text-ink">งาน 7 วันล่าสุด</p>
        <div className="mt-3 flex items-end justify-between gap-1.5" style={{ height: 120 }}>
          {[60, 80, 72, 95, 88, 110, 86].map((v, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${(v / 110) * 100}%` }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-1 flex-col items-center"
            >
              <div className="w-full rounded-t bg-gradient-to-t from-jumbo to-jumbo-dark" style={{ height: `${(v / 110) * 100}%` }} />
              <span className="mt-1 text-[9px] text-ink-muted">
                {["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"][i]}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* top drivers */}
      <p className="mb-2 mt-3 px-1 text-[12px] font-bold text-ink">
        Driver ยอดสูงสุด
      </p>
      <div className="flex flex-col gap-1.5">
        {[
          ["1", "สมชาย ใจดี", "128 งาน", "฿38,400"],
          ["2", "วันดี มีสุข", "112 งาน", "฿32,100"],
          ["3", "อนุชา รักไทย", "98 งาน", "฿28,500"],
        ].map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-xl border border-line bg-white p-2"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-jumbo text-[10px] font-bold text-white">
              {r[0]}
            </span>
            <span className="flex-1 text-[12px] font-bold text-ink">
              {r[1]}
            </span>
            <span className="text-[10px] text-ink-muted">{r[2]}</span>
            <span className="text-[12px] font-bold text-jumbo">{r[3]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// === A11: Settings ===
export function AdminSettingsPage() {
  return (
    <div>
      <PageHeader
        title="ตั้งค่าระบบ"
        count=""
        subtitle="ตั้งค่าระบบและบัญชีผู้ใช้งาน"
      />
      <div className="flex flex-col gap-2">
        {[
          { icon: Users, t: "จัดการบัญชีเจ้าหน้าที่", s: "เพิ่ม/แก้/ลบ Admin" },
          { icon: ShieldCheck, t: "บทบาทและสิทธิ์", s: "SUPER_ADMIN, ADMIN, REVIEWER" },
          { icon: Tag, t: "ตั้งค่าราคา", s: "ราคาต่อประเภทรถ" },
          { icon: Bell, t: "การแจ้งเตือน", s: "ตั้งค่า Push & Email" },
          { icon: Settings, t: "ตั้งค่าทั่วไป", s: "ภาษา, โซนเวลา, สกุลเงิน" },
          { icon: BarChart3, t: "Audit Log", s: "ดูประวัติการกระทำทั้งหมด" },
        ].map((item, i) => (
          <button
            key={i}
            className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3 text-left"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-jumbo-light">
              <item.icon className="h-4 w-4 text-jumbo" />
            </span>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-ink">{item.t}</p>
              <p className="text-[11px] text-ink-muted">{item.s}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-ink-muted" />
          </button>
        ))}
        <button className="flex items-center justify-center gap-1 rounded-xl border-2 border-jumbo bg-white py-2.5 text-[12px] font-bold text-jumbo">
          <Trash2 className="h-3.5 w-3.5" /> ล้างแคชระบบ
        </button>
      </div>
    </div>
  );
}

// === Reusable Page shell ===
function Page({
  title,
  count,
  subtitle,
  headers,
  rows,
}: {
  title: string;
  count: string;
  subtitle: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div>
      <PageHeader title={title} count={count} subtitle={subtitle} />
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-left text-[11px]">
          <thead className="border-b border-line bg-surface">
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-3 py-2 font-bold text-ink-muted"
                >
                  {h}
                </th>
              ))}
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-line/50 last:border-0">
                {r.map((c, j) => (
                  <td key={j} className="px-3 py-2.5">
                    {j === 0 ? (
                      <span className="font-bold text-jumbo">{c}</span>
                    ) : j === r.length - 1 ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          c === "ใช้งาน" || c === "ออนไลน์" || c === "อนุมัติ" || c === "เสร็จสิ้น"
                            ? "bg-green-100 text-green-700"
                            : c === "ระงับ" || c === "ยกเลิก" || c === "ตีกลบ"
                              ? "bg-jumbo-light text-jumbo"
                              : c === "รอตรวจ" || c === "กำลังทำ"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-surface text-ink"
                        }`}
                      >
                        {c}
                      </span>
                    ) : (
                      <span className="text-ink">{c}</span>
                    )}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-right">
                  <Eye className="ml-auto h-3.5 w-3.5 text-jumbo" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PageHeader({
  title,
  count,
  subtitle,
}: {
  title: string;
  count?: string;
  subtitle: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div>
        <h2 className="text-[16px] font-bold text-ink">{title}</h2>
        <p className="text-[11px] text-ink-muted">{subtitle}</p>
      </div>
      {count && (
        <span className="rounded-full bg-jumbo px-3 py-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </div>
  );
}
