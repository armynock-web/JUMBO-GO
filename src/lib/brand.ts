// JUMBO GO brand constants & Thai domain data
// All UI text is Thai. Code is English.

export const BRAND = {
  name: "JUMBO GO",
  short: "JUMBO",
  tagline: "เรียกรถขนของ ราคาคนไทย",
  promise: "เร็ว • ปลอดภัย • ไว้ใจได้",
  slogan: "ขนได้ทุกที่ ไปได้ไกลกว่า ไปกับคนไทย",
  color: "#ED1C24",
  colorDark: "#C91017",
  colorLight: "#FFF0F0",
} as const;

// Vehicle types per blueprint U08
export type VehicleType =
  | "PICKUP"
  | "CLOSED_PICKUP"
  | "CAGE_PICKUP"
  | "JUMBO"
  | "SIX_WHEEL";

export type VehicleInfo = {
  type: VehicleType;
  name: string; // Thai name
  capacity: string; // Thai capacity text
  tonRange: string;
  basePrice: number; // base fare THB
  perKm: number; // THB per km
  icon: string; // emoji placeholder for icon system reference
  desc: string;
};

export const VEHICLES: VehicleInfo[] = [
  {
    type: "PICKUP",
    name: "กระบะ",
    capacity: "บรรทุกได้ประมาณ 1 ตัน",
    tonRange: "~1 ตัน",
    basePrice: 150,
    perKm: 12,
    icon: "pickup",
    desc: "ส่งของเล็ก ย้ายห้อง ขนของทั่วไป",
  },
  {
    type: "CLOSED_PICKUP",
    name: "กระบะตู้ทึบ",
    capacity: "บรรทุกได้ประมาณ 1.5 ตัน",
    tonRange: "~1.5 ตัน",
    basePrice: 220,
    perKm: 15,
    icon: "closed",
    desc: "กันฝนกันแดด เหมาะขนเอกสาร อุปกรณ์อิเล็กทรอนิกส์",
  },
  {
    type: "CAGE_PICKUP",
    name: "กระบะคอก",
    capacity: "บรรทุกได้ประมาณ 1.5 ตัน",
    tonRange: "~1.5 ตัน",
    basePrice: 240,
    perKm: 16,
    icon: "cage",
    desc: "คอกสูง ขนของสูงหรือยาวได้ดี",
  },
  {
    type: "JUMBO",
    name: "จัมโบ้",
    capacity: "บรรทุกได้ประมาณ 3–5 ตัน",
    tonRange: "~3-5 ตัน",
    basePrice: 420,
    perKm: 22,
    icon: "jumbo",
    desc: "ย้ายบ้าน ขนของหนัก เฟอร์นิเจอร์ขนาดใหญ่",
  },
  {
    type: "SIX_WHEEL",
    name: "6 ล้อ",
    capacity: "บรรทุกได้ประมาณ 5–10 ตัน",
    tonRange: "~5-10 ตัน",
    basePrice: 650,
    perKm: 30,
    icon: "six",
    desc: "ขนของจำนวนมาก งานโรงงาน ขนวัสดุก่อสร้าง",
  },
];

export const PROVINCES = [
  "กรุงเทพมหานคร",
  "นนทบุรี",
  "ปทุมธานี",
  "สมุทรปราการ",
  "นครปฐม",
  "ชลบุรี",
  "เชียงใหม่",
  "ขอนแก่น",
  "มหาสารคาม",
  "นครราชสีมา",
  "สงขลา",
  "ภูเก็ต",
];

// Recent / saved locations (mock for UI demo)
export const RECENT_LOCATIONS = [
  {
    name: "บ้าน",
    address: "99/9 หมู่บ้านพฤกษาวิลล์ ถนนศรีนครินทร์",
    sub: "เขตสวงหวาง กรุงเทพมหานคร",
  tag: "บ้าน",
  lat: 13.7563,
    lng: 100.7014,
  },
  {
    name: "ออฟฟิศ",
    address: "ชั้น 18 อาคารสาทรซิตี้ทาวเวอร์",
    sub: "เขตสาทร กรุงเทพมหานคร",
    tag: "ออฟฟิศ",
    lat: 13.7234,
    lng: 100.5345,
  },
  {
    name: "สนามบินสุวรรณภูมิ",
    address: "ท่าอากาศยานสุวรรณภูมิ ก.ท.ม.",
    sub: "เขตสายไหม กรุงเทพมหานคร",
    tag: "สนามบิน",
    lat: 13.69,
    lng: 100.7501,
  },
  {
    name: "ไอคอนสยาม",
    address: "ศูนย์การค้าไอคอนสยาม",
    sub: "เขตคลองสาน กรุงเทพมหานคร",
    tag: "ช้อปปิ้ง",
    lat: 13.7244,
    lng: 100.5098,
  },
  {
    name: "เซ็นทรัลเวสต์เกต",
    address: "ศูนย์การค้าเซ็นทรัล เวสต์เกต",
    sub: "เขตหลักสี่ กรุงเทพมหานคร",
    tag: "ช้อปปิ้ง",
    lat: 13.8474,
    lng: 100.5645,
  },
];

export const FEATURE_HIGHLIGHTS = [
  {
    title: "ราคาชัดเจน",
    sub: "ไม่มีช่วงวูบ ไม่มีค่าซ่อนเร้น",
    icon: "tag",
  },
  {
    title: "ที่ตั้งแน่นอน",
    sub: "รู้จักที่อยู่เสมอ พิกัดแม่นยำ",
    icon: "pin",
  },
  {
    title: "คุณภาพระดับมืออาชีพ",
    sub: "แม่ พ่อ ลูก สาว ใช้ได้",
    icon: "shield",
  },
] as const;

export const ONBOARDING_SLIDES = [
  {
    headline: "ต้องการ รถขนส่ง",
    sub: "เลือก JUMBO GO",
    desc: "สั่งแอปง่ายๆ พร้อมบริการคุณภาพ",
    footnote: "การันตีด้วยผลงาน จากลูกค้ามากกว่าหมื่นราย",
  },
  {
    headline: "ส่งของ • แพ็กของ • รับส่ง",
    sub: "มาตรฐานบริการ มืออาชีพ",
    desc: "เร่งด่วนทันใจ คุ้มครองความเสียหาย ขนของไปทั่วประเทศ",
    footnote: "ไม่ต้องกังวลเรื่อง การจัดส่ง",
  },
  {
    headline: "จัดการของ ง่ายมากขึ้น",
    sub: "ทุกขั้นตอนบนแอป โปร่งใส",
    desc: "เลือกราคา • ติดตามพิกัด Real-time • จองล่วงหน้า • แชทกับพนักงาน",
    footnote: "ไม่ต้อง ออกจาก เบอร์โทรศัพท์",
  },
];

export const DRIVER_DEMO = {
  name: "สมชาย ใจดี",
  rating: 4.8,
  reviews: 320,
  vehicle: "กระบะตู้ทึบ",
  plate: "ขข 1234",
  province: "กรุงเทพมหานคร",
  color: "สีขาว",
  etaMin: 12,
  distanceKm: 4.2,
  phone: "081-234-5678",
};

export const JOB_TIMELINE = [
  { key: "ACCEPTED", label: "รับงานแล้ว", desc: "คนขับรับงานของคุณ" },
  { key: "DRIVER_GOING_TO_PICKUP", label: "กำลังเดินทาง", desc: "คนขับกำลังไปจุดรับ" },
  { key: "ARRIVED_PICKUP", label: "ใกล้ถึงจุดรับ", desc: "คนขับใกล้ถึงจุดรับของคุณ" },
  { key: "PICKED_UP", label: "รับของแล้ว", desc: "ของของคุณถูกขึ้นรถแล้ว" },
  { key: "IN_TRANSIT", label: "กำลังขนส่ง", desc: "กำลังไปยังจุดส่ง" },
  { key: "DELIVERED", label: "ส่งของสำเร็จ", desc: "ส่งของถึงจุดหมายเรียบร้อย" },
];

// Notifications moved to src/lib/notifications.ts (comprehensive 3-role system)

export const JOB_HISTORY = [
  {
    id: "JG-2025-00108",
    date: "21 ก.ย. 2025",
    route: "บ้าน → ออฟฟิศ",
    vehicle: "กระบะตู้ทึบ",
    price: 520,
    status: "เสร็จสิ้น",
  },
  {
    id: "JG-2025-00094",
    date: "18 ก.ย. 2025",
    route: "ออฟฟิศ → สนามบินสุวรรณภูมิ",
    vehicle: "6 ล้อ",
    price: 1450,
    status: "เสร็จสิ้น",
  },
  {
    id: "JG-2025-00071",
    date: "12 ก.ย. 2025",
    route: "ไอคอนสยาม → บ้าน",
    vehicle: "จัมโบ้",
    price: 980,
    status: "เสร็จสิ้น",
  },
  {
    id: "JG-2025-00058",
    date: "5 ก.ย. 2025",
    route: "บ้าน → เซ็นทรัลเวสต์เกต",
    vehicle: "กระบะ",
    price: 320,
    status: "ยกเลิก",
  },
];

export const formatTHB = (n: number): string =>
  n.toLocaleString("th-TH", { maximumFractionDigits: 0 });
