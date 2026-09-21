"use client";

import { useJumbo } from "@/store/jumbo";
import { StatusBar } from "../../status-bar";
import {
  ChevronLeft,
  User,
  IdCard,
  Camera,
  FileText,
  Truck,
  FolderArchive,
  Banknote,
  ShieldCheck,
  ClipboardCheck,
  Send,
  Check,
  Upload,
  X,
  AlertCircle,
  UserRound,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const STEPS = [
  { key: 1, label: "ข้อมูลส่วนตัว", icon: User, route: "profile" },
  { key: 2, label: "บัตรประชาชน", icon: IdCard, route: "identity" },
  { key: 3, label: "ยืนยันใบหน้า", icon: Camera, route: "selfie" },
  { key: 4, label: "ใบขับขี่", icon: FileText, route: "license" },
  { key: 5, label: "ข้อมูลรถ", icon: Truck, route: "vehicle" },
  { key: 6, label: "เอกสารรถ", icon: FolderArchive, route: "vehicle-docs" },
  { key: 7, label: "บัญชีธนาคาร", icon: Banknote, route: "bank" },
  { key: 8, label: "ข้อกำหนด", icon: ShieldCheck, route: "consent" },
  { key: 9, label: "ตรวจสอบข้อมูล", icon: ClipboardCheck, route: "review" },
  { key: 10, label: "ส่งตรวจสอบ", icon: Send, route: "submit" },
] as const;

export function DriverOnboardingScreen() {
  const go = useJumbo((s) => s.go);
  const back = useJumbo((s) => s.back);
  const kycStep = useJumbo((s) => s.kycStep);
  const setKycStep = useJumbo((s) => s.setKycStep);
  const submitKyc = useJumbo((s) => s.submitKyc);

  const step = STEPS[kycStep - 1];
  const StepIcon = step.icon;
  const isLast = kycStep === 10;

  const next = () => {
    if (isLast) {
      submitKyc();
      go("driver-onboarding-status");
    } else {
      setKycStep(kycStep + 1);
    }
  };
  const prev = () => (kycStep === 1 ? back() : setKycStep(kycStep - 1));

  return (
    <div className="relative flex h-full flex-col bg-surface">
      <StatusBar />
      {/* header */}
      <div className="flex items-center justify-between bg-white px-3 py-1">
        <button
          onClick={prev}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
          aria-label="ย้อนกลับ"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-[13px] font-medium text-ink-muted">
          ขั้นที่ {kycStep} จาก 10
        </span>
        <div className="w-9" />
      </div>

      {/* step progress */}
      <div className="bg-white px-4 pb-3">
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => {
            const done = i < kycStep - 1;
            const active = i === kycStep - 1;
            return (
              <div
                key={s.key}
                className="flex flex-1 items-center"
              >
                <span
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold transition ${
                    done
                      ? "bg-green-600 text-white"
                      : active
                        ? "bg-jumbo text-white ring-4 ring-jumbo-light"
                        : "bg-surface text-ink-muted"
                  }`}
                >
                  {done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </span>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${done ? "bg-green-600" : "bg-line"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <StepIcon className="h-4 w-4 text-jumbo" />
          <p className="text-[13px] font-bold text-ink">{step.label}</p>
        </div>
      </div>

      {/* content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={kycStep}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            {kycStep === 1 && <ProfileStep />}
            {kycStep === 2 && <IdentityStep />}
            {kycStep === 3 && <SelfieStep />}
            {kycStep === 4 && <LicenseStep />}
            {kycStep === 5 && <VehicleStep />}
            {kycStep === 6 && <VehicleDocsStep />}
            {kycStep === 7 && <BankStep />}
            {kycStep === 8 && <ConsentStep />}
            {kycStep === 9 && <ReviewStep />}
            {kycStep === 10 && <SubmitStep />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* footer */}
      <div className="border-t border-line bg-white p-3">
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="flex-1 rounded-2xl border border-line bg-white py-3.5 text-[14px] font-bold text-ink transition active:scale-[0.98]"
          >
            ย้อนกลับ
          </button>
          <button
            onClick={next}
            className="flex-[1.6] rounded-2xl bg-jumbo py-3.5 text-[15px] font-bold text-white shadow-lg shadow-jumbo/30 transition active:scale-[0.98]"
          >
            {isLast ? "ส่งตรวจสอบ" : "บันทึกและถัดไป"}
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-ink-muted">
          ข้อมูลถูกเก็บเป็น Draft กลับมาแก้ไขต่อได้
        </p>
      </div>
    </div>
  );
}

// === Step 1: Profile ===
function ProfileStep() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-[16px] font-bold text-ink">ข้อมูลส่วนตัว</h2>
      <Field label="ชื่อ–นามสกุล" placeholder="สมชาย ใจดี" value="สมชาย ใจดี" />
      <Field label="วันเกิด" type="date" value="1990-01-15" />
      <Field label="ที่อยู่" placeholder="99/9 หมู่ 1" value="99/9 หมู่ 1" />
      <div className="grid grid-cols-2 gap-2">
        <Field label="จังหวัด" placeholder="กรุงเทพมหานคร" value="กรุงเทพมหานคร" />
        <Field label="อำเภอ" placeholder="เขตสายไหม" value="เขตสายไหม" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="ตำบล" placeholder="ท่าทรัพย์" value="ท่าทรัพย์" />
        <Field label="รหัสไปรษณีย์" placeholder="10220" value="10220" />
      </div>
      <Field
        label="ผู้ติดต่อฉุกเฉิน"
        placeholder="สมหญิง ใจดี"
        value="สมหญิง ใจดี"
      />
      <Field
        label="เบอร์ผู้ติดต่อฉุกเฉิน"
        inputMode="tel"
        placeholder="089-999-9999"
        value="089-999-9999"
      />
      <Note>
        ข้อมูลนี้ใช้สำหรับติดต่อและยืนยันตัวตน กรุณากรอกให้ถูกต้อง
      </Note>
    </div>
  );
}

// === Step 2: Identity ===
function IdentityStep() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[16px] font-bold text-ink">บัตรประชาชน</h2>
      <p className="text-[12px] text-ink-muted">
        ถ่ายรูปบัตรทั้งสองด้าน ให้ชัดเจน ไม่มวล
      </p>
      <div className="grid grid-cols-2 gap-3">
        <UploadCard label="ด้านหน้า" type="id-front" />
        <UploadCard label="ด้านหลัง" type="id-back" />
      </div>
      <Field label="เลขบัตรประชาชน" placeholder="1-1023-45678-90-1" value="1-1023-45678-90-1" />
      <Field label="วันออกบัตร" type="date" value="2020-01-15" />
      <Field label="วันหมดอายุ" type="date" value="2027-01-14" />
      <Note>
        เอกสารนี้ถูกเก็บใน Private Bucket และแสดงผ่าน Signed URL เท่านั้น
      </Note>
    </div>
  );
}

// === Step 3: Selfie ===
function SelfieStep() {
  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="self-start text-[16px] font-bold text-ink">
        ยืนยันใบหน้า (Selfie)
      </h2>
      <p className="self-start text-[12px] text-ink-muted">
        ถ่ายเซลฟี่คู่กับบัตรประชาชน เพื่อยืนยันตัวตน
      </p>
      <div className="relative flex h-52 w-44 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-line bg-surface">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative flex flex-col items-center gap-2">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-jumbo-light">
            <UserRound className="h-10 w-10 text-jumbo" strokeWidth={2} />
          </div>
          <span className="text-[11px] font-medium text-ink-muted">
            แตะเพื่อถ่ายรูป
          </span>
        </div>
        <button
          className="absolute bottom-2 flex h-10 w-10 items-center justify-center rounded-full bg-jumbo text-white shadow-lg"
          aria-label="ถ่ายรูป"
        >
          <Camera className="h-5 w-5" />
        </button>
      </div>
      <div className="w-full rounded-xl bg-jumbo-light p-3">
        <ul className="flex flex-col gap-1">
          {[
            "หน้าตรง ไม่สวมหมวก/แว่น",
            "แสงสว่างพอเพียง",
            "ไม่มีผู้อื่นในภาพ",
          ].map((t, i) => (
            <li key={i} className="flex items-center gap-1.5 text-[11px] font-medium text-jumbo-dark">
              <Check className="h-3 w-3 flex-shrink-0" strokeWidth={3} />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// === Step 4: License ===
function LicenseStep() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[16px] font-bold text-ink">ใบขับขี่</h2>
      <div className="grid grid-cols-2 gap-3">
        <UploadCard label="ใบขับขี่ด้านหน้า" type="license-front" />
        <UploadCard label="ใบขับขี่ด้านหลัง" type="license-back" />
      </div>
      <Field label="เลขที่ใบขับขี่" placeholder="10-1023-45678-90" value="10-1023-45678-90" />
      <div>
        <span className="mb-1 block text-[13px] font-medium text-ink">
          ประเภทใบขับขี่
        </span>
        <div className="grid grid-cols-3 gap-2">
          {["รถยนต์ส่วนบุคคล", "รถยนต์สาธารณะ", "รถบรรทุก"].map(
            (t, i) => (
              <button
                key={t}
                className={`rounded-xl border-2 py-2.5 text-[11px] font-medium transition ${
                  i === 2
                    ? "border-jumbo bg-jumbo-light text-jumbo"
                    : "border-line bg-white text-ink"
                }`}
              >
                {t}
              </button>
            ),
          )}
        </div>
      </div>
      <Field label="วันออกบัตร" type="date" value="2024-01-15" />
      <Field label="วันหมดอายุ" type="date" value="2029-01-14" />
      <div className="rounded-xl bg-amber-50 p-3">
        <p className="flex items-center gap-1.5 text-[11px] font-medium text-amber-700">
          <AlertCircle className="h-3.5 w-3.5" />
          ใบขับขี่ต้องไม่หมดอายุ
        </p>
      </div>
    </div>
  );
}

// === Step 5: Vehicle ===
function VehicleStep() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[16px] font-bold text-ink">ข้อมูลรถ</h2>
      <div>
        <span className="mb-1 block text-[13px] font-medium text-ink">
          ประเภทรถ
        </span>
        <div className="grid grid-cols-3 gap-2">
          {[
            "กระบะ",
            "กระบะตู้ทึบ",
            "กระบะคอก",
            "จัมโบ้",
            "6 ล้อ",
            "10 ล้อ",
          ].map((t, i) => (
            <button
              key={t}
              className={`rounded-xl border-2 py-2.5 text-[11px] font-medium transition ${
                i === 1
                  ? "border-jumbo bg-jumbo-light text-jumbo"
                  : "border-line bg-white text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="ยี่ห้อ" placeholder="Isuzu" value="Isuzu" />
        <Field label="รุ่น" placeholder="D-Max" value="D-Max" />
      </div>
      <Field label="สี" placeholder="ขาว" value="ขาว" />
      <div className="grid grid-cols-2 gap-2">
        <Field label="ทะเบียน" placeholder="ขข 1234" value="ขข 1234" />
        <Field label="จังหวัดทะเบียน" placeholder="กรุงเทพมหานคร" value="กรุงเทพมหานคร" />
      </div>
      <Field label="น้ำหนักบรรทุกสูงสุด (กก.)" inputMode="numeric" placeholder="1500" value="1500" />
      <Note>ระบบจะตรวจทะเบียนซ้ำกับรถที่มีอยู่ในระบบ</Note>
    </div>
  );
}

// === Step 6: Vehicle documents ===
function VehicleDocsStep() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[16px] font-bold text-ink">เอกสารรถ</h2>
      <p className="text-[12px] text-ink-muted">
        อัปโหลดเอกสารรถทั้งหมด 4 รายการ
      </p>
      <UploadCard label="เล่มทะเบียนรถ" type="reg-book" full />
      <UploadCard label="พ.ร.บ. ประกันภัยภาคบังคับ" type="compulsory" full />
      <UploadCard label="รูปหน้ารถ" type="vehicle-front" full />
      <UploadCard label="รูปด้านข้างรถ" type="vehicle-side" full />
      <Note>เอกสารเหล่านี้ใช้ตรวจสอบความถูกต้องของรถ</Note>
    </div>
  );
}

// === Step 7: Bank ===
function BankStep() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[16px] font-bold text-ink">บัญชีธนาคาร</h2>
      <p className="text-[12px] text-ink-muted">
        บัญชีที่จะรับเงินรายได้จากงาน
      </p>
      <div>
        <span className="mb-1 block text-[13px] font-medium text-ink">
          ธนาคาร
        </span>
        <div className="grid grid-cols-3 gap-2">
          {["กสิกร", "กรุงไทย", "กรุงศรี", "ไทยพาณิชย์", "ทหารไทย", "ออมสิน"].map(
            (b, i) => (
              <button
                key={b}
                className={`rounded-xl border-2 py-2.5 text-[11px] font-medium transition ${
                  i === 0
                    ? "border-jumbo bg-jumbo-light text-jumbo"
                    : "border-line bg-white text-ink"
                }`}
              >
                {b}
              </button>
            ),
          )}
        </div>
      </div>
      <Field label="ชื่อบัญชี" placeholder="สมชาย ใจดี" value="สมชาย ใจดี" />
      <Field
        label="เลขบัญชี"
        inputMode="numeric"
        placeholder="xxx-xxx-1234"
        value="xxx-xxx-1234"
        note="ระบบเก็บเลขบัญชีแบบเข้ารหัส แสดงเพียง 4 ตัวท้าย"
      />
      <UploadCard label="รูปหน้าสมุดบัญชี" type="bank-book" full />
      <Note>รายได้จะโอนเข้าบัญชีนี้ทุกสัปดาห์</Note>
    </div>
  );
}

// === Step 8: Consent ===
function ConsentStep() {
  const [checks, setChecks] = useState([true, false, false, false, false]);
  const allChecked = checks.every(Boolean);
  const items = [
    "ยอมรับข้อกำหนดการใช้บริการ JUMBO GO",
    "ยินยอมให้ตรวจสอบข้อมูลส่วนตัวกับหน่วยงานราชการ",
    "ยินยอมให้จัดเก็บและใช้เอกสาร KYC ตามนโยบายความเป็นส่วนตัว",
    "รับทราบนโยบายความเป็นส่วนตัว (PDPA)",
    "ยินยอมให้ใช้ตำแหน่งระหว่างออนไลน์เพื่อรับงาน",
  ];
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[16px] font-bold text-ink">ข้อกำหนดและการยินยอม</h2>
      <div className="flex flex-col gap-2">
        {items.map((t, i) => (
          <button
            key={i}
            onClick={() =>
              setChecks((c) => c.map((v, idx) => (idx === i ? !v : v)))
            }
            className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition ${
              checks[i]
                ? "border-jumbo bg-jumbo-light"
                : "border-line bg-white"
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition ${
                checks[i] ? "border-jumbo bg-jumbo" : "border-line bg-white"
              }`}
            >
              {checks[i] && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
            </span>
            <span className="text-[12px] leading-relaxed text-ink">{t}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => setChecks([true, true, true, true, true])}
        className="self-end text-[11px] font-bold text-jumbo"
      >
        ยินยอมทั้งหมด
      </button>
      <Note>
        {allChecked
          ? "ยินยอมครบทุกข้อแล้ว สามารถส่งตรวจสอบได้"
          : "ต้องยินยอมทุกข้อจึงจะส่งตรวจสอบได้"}
      </Note>
    </div>
  );
}

// === Step 9: Review ===
function ReviewStep() {
  const rows = [
    ["ชื่อ–นามสกุล", "สมชาย ใจดี"],
    ["เบอร์โทรศัพท์", "081-234-5678"],
    ["ที่อยู่", "99/9 หมู่ 1 กรุงเทพมหานคร"],
    ["บัตรประชาชน", "1-1023-45678-90-1"],
    ["ใบขับขี่", "10-1023-45678-90 (รถบรรทุก)"],
    ["รถ", "Isuzu D-Max กระบะตู้ทึบ ขข 1234"],
    ["บัญชีธนาคาร", "กสิกรไทย xxx-xxx-1234"],
    ["การยินยอม", "ยินยอมครบ 5 รายการ"],
  ];
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[16px] font-bold text-ink">ตรวจสอบข้อมูลก่อนส่ง</h2>
      <p className="text-[12px] text-ink-muted">
        กรุณาตรวจสอบความถูกต้อง หลังส่งแล้วแก้ไขไม่ได้จนกว่า Admin จะตีกลับ
      </p>
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {rows.map((r, i) => (
          <div
            key={i}
            className={`flex items-center justify-between gap-2 px-3 py-2.5 ${
              i !== rows.length - 1 ? "border-b border-line" : ""
            }`}
          >
            <span className="text-[12px] text-ink-muted">{r[0]}</span>
            <span className="text-right text-[12px] font-semibold text-ink">
              {r[1]}
            </span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-surface p-3">
        <p className="text-[11px] text-ink-muted">
          เอกสารที่อัปโหลด: บัตรประชาชน 2 รูป, Selfie 1 รูป, ใบขับขี่ 2 รูป,
          เอกสารรถ 4 รูป, สมุดบัญชี 1 รูป (รวม 10 ไฟล์)
        </p>
      </div>
    </div>
  );
}

// === Step 10: Submit ===
function SubmitStep() {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-jumbo-light"
      >
        <Send className="h-8 w-8 text-jumbo" />
      </motion.div>
      <h2 className="text-[18px] font-extrabold text-ink">พร้อมส่งตรวจสอบ</h2>
      <p className="max-w-[280px] text-[12px] leading-relaxed text-ink-muted">
        ข้อมูลและเอกสารทั้งหมดพร้อมส่ง หลังกดปุ่ม “ส่งตรวจสอบ”
        ระบบจะส่งให้เจ้าหน้าที่ Admin ตรวจสอบ ระยะเวลาโดยประมาณ 1–2 วันทำการ
      </p>
      <div className="w-full rounded-2xl border border-line bg-white p-3 text-left">
        <p className="text-[12px] font-bold text-ink">หลังส่งตรวจสอบ</p>
        <ul className="mt-1.5 flex flex-col gap-1.5">
          {[
            "แก้ไขข้อมูลไม่ได้จนกว่า Admin จะตีกลบ",
            "เห็นสถานะได้ที่หน้าสถานะ KYC",
            "ได้รับแจ้งเตือนเมื่ออนุมัติหรือปฏิเสธ",
          ].map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-ink-muted">
              <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-jumbo" strokeWidth={3} />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// === Reusable bits ===
function Field({
  label,
  value,
  placeholder,
  type = "text",
  inputMode,
  note,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  type?: string;
  inputMode?: "tel" | "text" | "numeric";
  note?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium text-ink">{label}</span>
      <div className="flex items-center rounded-xl border border-line bg-surface px-3 focus-within:border-jumbo focus-within:bg-white">
        <input
          type={type}
          defaultValue={value}
          inputMode={inputMode}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-2.5 text-[13px] outline-none placeholder:text-ink-muted/60"
        />
      </div>
      {note && <span className="mt-1 block text-[10px] text-ink-muted">{note}</span>}
    </label>
  );
}

function UploadCard({
  label,
  type,
  full,
}: {
  label: string;
  type: string;
  full?: boolean;
}) {
  const [uploaded, setUploaded] = useState(type === "id-front" || type === "license-front" || type === "reg-book");
  return (
    <div className={full ? "w-full" : ""}>
      <span className="mb-1 block text-[12px] font-medium text-ink">{label}</span>
      <button
        onClick={() => setUploaded(true)}
        className={`relative flex h-24 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${
          uploaded ? "border-jumbo bg-jumbo-light" : "border-line bg-surface"
        }`}
      >
        {uploaded ? (
          <>
            <div className="bg-grid absolute inset-0 opacity-20" />
            <div className="relative flex flex-col items-center gap-1">
              <Check className="h-6 w-6 text-jumbo" strokeWidth={3} />
              <span className="text-[10px] font-medium text-jumbo">อัปโหลดแล้ว</span>
            </div>
            <button
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90"
              aria-label="ลบ"
              onClick={(e) => {
                e.stopPropagation();
                setUploaded(false);
              }}
            >
              <X className="h-3 w-3 text-jumbo" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Upload className="h-5 w-5 text-ink-muted" />
            <span className="text-[10px] font-medium text-ink-muted">แตะอัปโหลด</span>
          </div>
        )}
      </button>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-surface p-2.5">
      <p className="text-[11px] leading-relaxed text-ink-muted">{children}</p>
    </div>
  );
}
