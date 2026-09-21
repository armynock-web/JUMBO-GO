// JUMBO GO Notification System
// ครบ 3 ฝั่ง: ลูกค้า (10), คนขับ (9), แอดมิน (5)

export type NotificationCategory =
  // ลูกค้า
  | "driver_accepted" // มีคนขับรับงาน
  | "driver_going_to_pickup" // คนขับกำลังไปรับ
  | "arrived_pickup" // ถึงจุดรับแล้ว
  | "picked_up" // รับสินค้าแล้ว
  | "in_transit" // กำลังจัดส่ง
  | "arrived_dropoff" // ถึงปลายทาง
  | "job_completed" // งานสำเร็จ
  | "driver_cancelled" // คนขับยกเลิกงาน
  | "payment_due" // แจ้งยอดเงิน/ค่าบริการ
  | "action_required" // กรณีต้องดำเนินการ
  // คนขับ
  | "new_job_nearby" // มีงานใหม่ใกล้ตัว
  | "job_details" // รายละเอียดงาน/ค่ารอบ
  | "customer_cancelled" // ลูกค้ายกเลิก
  | "job_modified" // งานมีการแก้ไข
  | "accept_deadline_warning" // ก่อนหมดเวลารับงาน
  | "earnings" // เงิน/เครดิต/รายได้
  | "kyc_result" // ผลการตรวจ KYC
  | "doc_expiring" // เอกสารใกล้หมดอายุ
  | "system_announcement" // ประกาศจากระบบ
  // แอดมิน
  | "abnormal_cancellation" // มีงานถูกยกเลิกผิดปกติ
  | "complaint" // ร้องเรียน
  | "stale_job" // งานค้างนาน
  | "payment_issue" // ปัญหาการชำระเงิน
  | "admin_action_required"; // เหตุการณ์ที่ต้องให้แอดมินจัดการ

export type NotificationRole = "customer" | "driver" | "admin";

export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export type JumboNotification = {
  id: string;
  role: NotificationRole;
  category: NotificationCategory;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  priority: NotificationPriority;
  jobId?: string;
  amount?: number; // THB ถ้าเกี่ยวกับเงิน
  action?: {
    label: string;
    target?: string; // screen id หรือ action
  };
};

// === ลูกค้า (Customer) — 10 ประเภท ===
export const CUSTOMER_NOTIFICATIONS: JumboNotification[] = [
  {
    id: "n-c-001",
    role: "customer",
    category: "driver_accepted",
    title: "คนขับรับงานแล้ว!",
    body: "สมชาย ใจดี (★4.8) รับงาน JG-2025-00108 ของคุณแล้ว กำลังมารับ",
    time: "เมื่อสักครู่",
    unread: true,
    priority: "high",
    jobId: "JG-2025-00108",
    action: { label: "ติดตามรถ", target: "tracking" },
  },
  {
    id: "n-c-002",
    role: "customer",
    category: "driver_going_to_pickup",
    title: "คนขับกำลังไปรับ",
    body: "สมชาย กำลังเดินทางไปจุดรับของคุณ อีกประมาณ 12 นาที (ระยะ 4.2 กม.)",
    time: "2 นาทีที่แล้ว",
    unread: true,
    priority: "normal",
    jobId: "JG-2025-00108",
    action: { label: "ดูตำแหน่ง", target: "tracking" },
  },
  {
    id: "n-c-003",
    role: "customer",
    category: "arrived_pickup",
    title: "คนขับถึงจุดรับแล้ว",
    body: "สมชาย ถึงจุดรับสินค้าแล้ว กรุณาเตรียมของส่งมอบ",
    time: "8 นาทีที่แล้ว",
    unread: true,
    priority: "high",
    jobId: "JG-2025-00108",
    action: { label: "โทรหาคนขับ" },
  },
  {
    id: "n-c-004",
    role: "customer",
    category: "picked_up",
    title: "รับสินค้าแล้ว",
    body: "คนขับรับสินค้าของคุณแล้ว กำลังเริ่มเดินทางไปจุดส่ง",
    time: "12 นาทีที่แล้ว",
    unread: false,
    priority: "normal",
    jobId: "JG-2025-00108",
  },
  {
    id: "n-c-005",
    role: "customer",
    category: "in_transit",
    title: "กำลังจัดส่ง",
    body: "สินค้าของคุณกำลังอยู่ระหว่างการขนส่ง คาดว่าจะถึงในอีก 18 นาที",
    time: "20 นาทีที่แล้ว",
    unread: false,
    priority: "normal",
    jobId: "JG-2025-00108",
    action: { label: "ติดตาม", target: "tracking" },
  },
  {
    id: "n-c-006",
    role: "customer",
    category: "arrived_dropoff",
    title: "ถึงปลายทางแล้ว",
    body: "คนขับถึงจุดส่งแล้ว กรุณารอรับมอบสินค้า",
    time: "35 นาทีที่แล้ว",
    unread: false,
    priority: "high",
    jobId: "JG-2025-00108",
  },
  {
    id: "n-c-007",
    role: "customer",
    category: "job_completed",
    title: "งานสำเร็จ!",
    body: "งาน JG-2025-00108 ส่งมอบเรียบร้อย ขอบคุณที่ใช้บริการ JUMBO GO",
    time: "1 ชม.ที่แล้ว",
    unread: false,
    priority: "normal",
    jobId: "JG-2025-00108",
    amount: 619,
    action: { label: "ให้คะแนน", target: "completed" },
  },
  {
    id: "n-c-008",
    role: "customer",
    category: "driver_cancelled",
    title: "คนขับยกเลิกงาน",
    body: "คนขับยกเลิกงาน JG-2025-00109 ระบบกำลังค้นหาคนขับใหม่ให้คุณ",
    time: "3 ชม.ที่แล้ว",
    unread: false,
    priority: "urgent",
    jobId: "JG-2025-00109",
    action: { label: "เรียกรถใหม่", target: "home" },
  },
  {
    id: "n-c-009",
    role: "customer",
    category: "payment_due",
    title: "แจ้งยอดชำระเงิน",
    body: "งาน JG-2025-00107 ยอดรวม ฿450 กรุณาชำระเงินสดปลายทาง",
    time: "เมื่อวาน",
    unread: false,
    priority: "high",
    jobId: "JG-2025-00107",
    amount: 450,
  },
  {
    id: "n-c-010",
    role: "customer",
    category: "action_required",
    title: "ต้องดำเนินการ: ยืนยันที่อยู่",
    body: "คนขับไม่พบที่อยู่จุดรับ กรุณาโทรหรือแชทเพื่อยืนยันพิกัด",
    time: "เมื่อวาน",
    unread: false,
    priority: "urgent",
    jobId: "JG-2025-00106",
    action: { label: "แชทคนขับ", target: "support" },
  },
];

// === คนขับ (Driver) — 9 ประเภท ===
export const DRIVER_NOTIFICATIONS: JumboNotification[] = [
  {
    id: "n-d-001",
    role: "driver",
    category: "new_job_nearby",
    title: "มีงานใหม่ใกล้ตัว!",
    body: "งานใหม่ห่างจากคุณ 4.2 กม. รายได้ ฿520 กรุณาตอบรับภายใน 30 วินาที",
    time: "เมื่อสักครู่",
    unread: true,
    priority: "urgent",
    jobId: "JG-2025-00109",
    amount: 520,
    action: { label: "ดูงาน", target: "driver-jobs" },
  },
  {
    id: "n-d-002",
    role: "driver",
    category: "job_details",
    title: "รายละเอียดงาน + ค่ารอบ",
    body: "JG-00109: กระบะตู้ทึบ, ระยะ 28.5 กม., ค่ารอบ ฿520, ค่าทางด่วน ฿75 (คืนให้)",
    time: "1 นาทีที่แล้ว",
    unread: true,
    priority: "normal",
    jobId: "JG-2025-00109",
    amount: 520,
    action: { label: "รับงาน", target: "driver-jobs" },
  },
  {
    id: "n-d-003",
    role: "driver",
    category: "customer_cancelled",
    title: "ลูกค้ายกเลิกงาน",
    body: "งาน JG-2025-00110 ถูกยกเลิกโดยลูกค้า ไม่มีผลต่อคะแนนของคุณ",
    time: "15 นาทีที่แล้ว",
    unread: true,
    priority: "normal",
    jobId: "JG-2025-00110",
  },
  {
    id: "n-d-004",
    role: "driver",
    category: "job_modified",
    title: "งานมีการแก้ไข",
    body: "ลูกค้าแก้ไขจุดส่งของงาน JG-00108 จาก สนามบิน → ไอคอนสยาม ระยะ +5 กม.",
    time: "30 นาทีที่แล้ว",
    unread: false,
    priority: "high",
    jobId: "JG-2025-00108",
    action: { label: "ดูเส้นทางใหม่", target: "driver-jobs" },
  },
  {
    id: "n-d-005",
    role: "driver",
    category: "accept_deadline_warning",
    title: "ใกล้หมดเวลารับงาน",
    body: "เหลือ 10 วินาที ในการตอบรับงาน JG-00111 หากไม่รับ งานจะถูกส่งให้คนขับคนอื่น",
    time: "1 ชม.ที่แล้ว",
    unread: false,
    priority: "urgent",
    jobId: "JG-2025-00111",
    action: { label: "รับงาน", target: "driver-jobs" },
  },
  {
    id: "n-d-006",
    role: "driver",
    category: "earnings",
    title: "แจ้งยอดรายได้",
    body: "รายได้สัปดาห์นี้ ฿5,400 พร้อมโอนเข้าบัญชี กสิกร ***1234 ในวันที่ 30 ก.ย.",
    time: "3 ชม.ที่แล้ว",
    unread: false,
    priority: "normal",
    amount: 5400,
    action: { label: "ดูรายได้", target: "driver-earnings" },
  },
  {
    id: "n-d-007",
    role: "driver",
    category: "kyc_result",
    title: "ผลการตรวจ KYC: อนุมัติแล้ว ✓",
    body: "เอกสาร KYC ของคุณผ่านการตรวจสอบ สามารถเปิดรับงานได้ทันที",
    time: "เมื่อวาน",
    unread: false,
    priority: "high",
    action: { label: "ไป Dashboard", target: "driver-dashboard" },
  },
  {
    id: "n-d-008",
    role: "driver",
    category: "doc_expiring",
    title: "เอกสารใกล้หมดอายุ",
    body: "ใบขับขี่ของคุณจะหมดอายุใน 30 วัน กรุณาอัปโหลดใบใหม่ก่อนหมดอายุ",
    time: "2 วันที่แล้ว",
    unread: false,
    priority: "high",
    action: { label: "อัปโหลดใหม่", target: "driver-onboarding" },
  },
  {
    id: "n-d-009",
    role: "driver",
    category: "system_announcement",
    title: "ประกาศ: โปรโมชั่นรายได้พิเศษ 20%",
    body: "รับงานครบ 10 งานในสัปดาห์นี้ รับโบนัสพิเศษ 20% ของรายได้สัปดาห์",
    time: "3 วันที่แล้ว",
    unread: false,
    priority: "low",
  },
];

// === แอดมิน (Admin) — 5 ประเภท ===
export const ADMIN_NOTIFICATIONS: JumboNotification[] = [
  {
    id: "n-a-001",
    role: "admin",
    category: "abnormal_cancellation",
    title: "มีงานถูกยกเลิกผิดปกติ",
    body: "Driver JG-00105 ยกเลิกงาน 4 ครั้งใน 1 ชม. ล่าสุด เกินเกณฑ์ปกติ",
    time: "เมื่อสักครู่",
    unread: true,
    priority: "urgent",
    action: { label: "ตรวจสอบ Driver", target: "admin-drivers" },
  },
  {
    id: "n-a-002",
    role: "admin",
    category: "complaint",
    title: "มีร้องเรียนใหม่",
    body: "ลูกค้า USR-1024 ร้องเรียน Driver JG-00106 เรื่อง มาสาย 1 ชม. โดยไม่แจ้ง",
    time: "20 นาทีที่แล้ว",
    unread: true,
    priority: "high",
    action: { label: "จัดการร้องเรียน", target: "admin-jobs" },
  },
  {
    id: "n-a-003",
    role: "admin",
    category: "stale_job",
    title: "งานค้างนานผิดปกติ",
    body: "งาน JG-00104 อยู่ในสถานะ 'ค้นหาคนขับ' เกิน 15 นาที กรุณาตรวจสอบ",
    time: "1 ชม.ที่แล้ว",
    unread: true,
    priority: "high",
    jobId: "JG-2025-00104",
    action: { label: "ดูงาน", target: "admin-jobs" },
  },
  {
    id: "n-a-004",
    role: "admin",
    category: "payment_issue",
    title: "ปัญหาการชำระเงิน",
    body: "TXN-5019 โอนเงินให้ Driver ล้มเหลว (บัญชีปิด) มูลค่า ฿2,800",
    time: "3 ชม.ที่แล้ว",
    unread: false,
    priority: "high",
    amount: 2800,
    action: { label: "ตรวจสอบ", target: "admin-payments" },
  },
  {
    id: "n-a-005",
    role: "admin",
    category: "admin_action_required",
    title: "ต้องให้แอดมินจัดการ: KYC ค้าง",
    body: "มี KYC รอตรวจ 14 รายการ เกิน 24 ชม. กรุณาเร่งตรวจเพื่อรักษา SLA",
    time: "5 ชม.ที่แล้ว",
    unread: false,
    priority: "normal",
    action: { label: "ไปตรวจ KYC", target: "admin-kyc" },
  },
];

export const ALL_NOTIFICATIONS = [
  ...CUSTOMER_NOTIFICATIONS,
  ...DRIVER_NOTIFICATIONS,
  ...ADMIN_NOTIFICATIONS,
];

// Helper: ดึงการแจ้งเตือนตาม role
export function getNotificationsByRole(role: NotificationRole) {
  return ALL_NOTIFICATIONS.filter((n) => n.role === role);
}

// Helper: นับยังไม่อ่าน
export function countUnread(role: NotificationRole) {
  return ALL_NOTIFICATIONS.filter((n) => n.role === role && n.unread).length;
}

// หมวดหมู่ทั้งหมดเป็นกลุ่ม (สำหรับ filter chips)
export const CATEGORY_GROUPS: Record<
  NotificationRole,
  { key: string; label: string; categories: NotificationCategory[] }[]
> = {
  customer: [
    {
      key: "job_status",
      label: "สถานะงาน",
      categories: [
        "driver_accepted",
        "driver_going_to_pickup",
        "arrived_pickup",
        "picked_up",
        "in_transit",
        "arrived_dropoff",
        "job_completed",
      ],
    },
    {
      key: "issue",
      label: "ปัญหา/ยกเลิก",
      categories: ["driver_cancelled", "action_required"],
    },
    {
      key: "payment",
      label: "การเงิน",
      categories: ["payment_due"],
    },
  ],
  driver: [
    {
      key: "jobs",
      label: "งาน",
      categories: [
        "new_job_nearby",
        "job_details",
        "customer_cancelled",
        "job_modified",
        "accept_deadline_warning",
      ],
    },
    {
      key: "money",
      label: "เงิน/รายได้",
      categories: ["earnings", "kyc_result", "doc_expiring"],
    },
    {
      key: "system",
      label: "ระบบ",
      categories: ["system_announcement"],
    },
  ],
  admin: [
    {
      key: "alerts",
      label: "การแจ้งเตือน",
      categories: [
        "abnormal_cancellation",
        "complaint",
        "stale_job",
        "payment_issue",
        "admin_action_required",
      ],
    },
  ],
};

// สี + ไอคอน metadata สำหรับแต่ละ category
export const CATEGORY_META: Record<
  NotificationCategory,
  { color: string; bg: string; icon: string }
> = {
  // ลูกค้า - สถานะงาน (น้ำเงิน/เขียว)
  driver_accepted: { color: "text-jumbo", bg: "bg-jumbo", icon: "UserCheck" },
  driver_going_to_pickup: { color: "text-blue-600", bg: "bg-blue-500", icon: "Navigation" },
  arrived_pickup: { color: "text-amber-600", bg: "bg-amber-500", icon: "MapPin" },
  picked_up: { color: "text-blue-600", bg: "bg-blue-500", icon: "Package" },
  in_transit: { color: "text-blue-600", bg: "bg-blue-500", icon: "Truck" },
  arrived_dropoff: { color: "text-amber-600", bg: "bg-amber-500", icon: "MapPin" },
  job_completed: { color: "text-green-600", bg: "bg-green-600", icon: "CheckCircle2" },
  driver_cancelled: { color: "text-jumbo", bg: "bg-jumbo", icon: "XCircle" },
  payment_due: { color: "text-jumbo", bg: "bg-jumbo", icon: "Wallet" },
  action_required: { color: "text-amber-700", bg: "bg-amber-600", icon: "AlertTriangle" },
  // คนขับ
  new_job_nearby: { color: "text-jumbo", bg: "bg-jumbo", icon: "Bell" },
  job_details: { color: "text-blue-600", bg: "bg-blue-500", icon: "FileText" },
  customer_cancelled: { color: "text-jumbo", bg: "bg-jumbo", icon: "XCircle" },
  job_modified: { color: "text-amber-600", bg: "bg-amber-500", icon: "Pencil" },
  accept_deadline_warning: { color: "text-jumbo", bg: "bg-jumbo", icon: "Clock" },
  earnings: { color: "text-green-600", bg: "bg-green-600", icon: "Banknote" },
  kyc_result: { color: "text-green-600", bg: "bg-green-600", icon: "ShieldCheck" },
  doc_expiring: { color: "text-amber-600", bg: "bg-amber-500", icon: "AlertTriangle" },
  system_announcement: { color: "text-jumbo", bg: "bg-jumbo", icon: "Megaphone" },
  // แอดมิน
  abnormal_cancellation: { color: "text-jumbo", bg: "bg-jumbo", icon: "AlertOctagon" },
  complaint: { color: "text-amber-700", bg: "bg-amber-600", icon: "MessageSquareWarning" },
  stale_job: { color: "text-amber-700", bg: "bg-amber-600", icon: "Clock" },
  payment_issue: { color: "text-jumbo", bg: "bg-jumbo", icon: "Wallet" },
  admin_action_required: { color: "text-jumbo", bg: "bg-jumbo", icon: "ShieldAlert" },
};

export const PRIORITY_META: Record<
  NotificationPriority,
  { label: string; color: string; bg: string }
> = {
  low: { label: "ทั่วไป", color: "text-ink-muted", bg: "bg-surface" },
  normal: { label: "ปกติ", color: "text-blue-600", bg: "bg-blue-100" },
  high: { label: "สำคัญ", color: "text-amber-700", bg: "bg-amber-100" },
  urgent: { label: "ด่วน", color: "text-jumbo", bg: "bg-jumbo-light" },
};
