"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../status-bar";
import {
  ChevronLeft,
  Search,
  MessageSquare,
  Phone,
  Mail,
  HelpCircle,
  Truck,
  CreditCard,
  Shield,
  X,
} from "lucide-react";

const FAQ = [
  {
    q: "จะยกเลิกการเรียกรถได้อย่างไร?",
    a: "กดปุ่มยกเลิกได้ภายใน 2 นาทีหลังกดยืนยัน ฟรี ไม่มีค่าใช้จ่าย",
    icon: Truck,
  },
  {
    q: "ราคาที่แสดงตรงกับที่จ่ายจริงไหม?",
    a: "ราคาเป็นราคาโดยประมาณ อาจมีการปรับตามค่าทางด่วนจริง",
    icon: CreditCard,
  },
  {
    q: "มีวิธีชำระเงินอะไรบ้าง?",
    a: "ปัจจุบันรองรับเงินสดจ่ายปลายทาง และ QR PromptPay",
    icon: CreditCard,
  },
  {
    q: "ข้อมูลส่วนตัวปลอดภัยหรือไม่?",
    a: "JUMBO GO ใช้ RLS และเข้ารหัสข้อมูลที่อ่อนไหวทุกชั้น",
    icon: Shield,
  },
  {
    q: "จะสมัครเป็นคนขับได้อย่างไร?",
    a: "เข้าเมนู > สมัคร Driver ผ่าน KYC ภายใน 1-2 วันทำการ",
    icon: Truck,
  },
];

export function SupportScreen() {
  const back = useJumbo((s) => s.back);
  const go = useJumbo((s) => s.go);

  return (
    <div className="relative flex h-full flex-col bg-surface">
      <StatusBar />
      <div className="flex items-center justify-between bg-white px-3 py-1">
        <button
          onClick={back}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
          aria-label="ย้อนกลับ"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-[13px] font-medium text-ink-muted">
          ศูนย์ช่วยเหลือ
        </span>
        <div className="w-9" />
      </div>

      {/* hero */}
      <div className="bg-white px-5 pb-4 pt-2">
        <h1 className="text-[20px] font-extrabold text-ink">
          สวัสดี เราพร้อมช่วยเหลือ
        </h1>
        <p className="-mt-1 text-[12px] text-ink-muted">
          เลือกหัวข้อที่ต้องการ หรือติดต่อเราโดยตรง
        </p>
        <div className="mt-3 flex items-center rounded-xl border-2 border-jumbo bg-white px-3">
          <Search className="h-4 w-4 text-jumbo" />
          <input
            placeholder="ค้นหาคำถาม..."
            className="ml-2 flex-1 bg-transparent py-2.5 text-[13px] outline-none placeholder:text-ink-muted/60"
          />
        </div>
      </div>

      {/* quick actions */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3">
        <QuickAction
          icon={MessageSquare}
          label="แชตสด"
          color="bg-jumbo"
        />
        <QuickAction
          icon={Phone}
          label="โทรหาเรา"
          color="bg-green-600"
        />
        <QuickAction
          icon={Mail}
          label="อีเมล"
          color="bg-ink"
        />
      </div>

      {/* FAQ */}
      <div className="flex-1 overflow-y-auto px-4 pb-3 scrollbar-hide">
        <p className="mb-2 px-1 text-[13px] font-bold text-ink">
          คำถามที่พบบ่อย
        </p>
        <div className="flex flex-col gap-2">
          {FAQ.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-line bg-white p-3"
            >
              <summary className="flex cursor-pointer items-center gap-3 list-none">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jumbo-light">
                  <f.icon className="h-4 w-4 text-jumbo" />
                </span>
                <span className="flex-1 text-[13px] font-semibold text-ink">
                  {f.q}
                </span>
                <ChevronLeft className="h-4 w-4 rotate-90 text-ink-muted transition group-open:-rotate-90" />
              </summary>
              <p className="mt-2 pl-11 text-[12px] leading-relaxed text-ink-muted">
                {f.a}
              </p>
            </details>
          ))}
        </div>

        {/* contact */}
        <div className="mt-3 rounded-2xl border border-line bg-white p-4 text-center">
          <HelpCircle className="mx-auto h-7 w-7 text-jumbo" />
          <p className="mt-1 text-[13px] font-bold text-ink">
            ยังไม่พบคำตอบ?
          </p>
          <p className="text-[11px] text-ink-muted">
            ทีมงานพร้อมตอบทุกวัน 08:00 - 22:00 น.
          </p>
          <button
            onClick={() => go("home")}
            className="mt-3 w-full rounded-xl bg-jumbo py-2.5 text-[13px] font-bold text-white"
          >
            ติดต่อเจ้าหน้าที่
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  return (
    <button className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-3 transition active:scale-95">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-full ${color} text-white`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-[11px] font-semibold text-ink">{label}</span>
    </button>
  );
}
