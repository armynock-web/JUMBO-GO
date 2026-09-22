# JUMBO GO - Design System

## สีหลัก (Brand Colors)

| ชื่อสี | ค่า Hex | การใช้งาน |
|---------|---------|-------------|
| JUMBO Red | `#ED1C24` | สีหลักของแบรนด์ ใช้สำหรับปุ่มหลัก, Call-to-Action |
| White | `#FFFFFF` | พื้นหลังหลัก, ข้อความสำคัญ |
| Black | `#000000` | ข้อความหลัก, เส้นแบ่ง |
| Gray | `#666666` | ข้อความรอง, คำอธิบาย |
| Light Gray | `#F5F5F5` | พื้นหลังรอง, card backgrounds |

## Typography

### ฟอนต์
- ใช้ System Fonts (ถูกตั้งค่าโดย Tailwind CSS)

### ขนาดตัวอักษร
- **Heading 1**: 2rem (32px)
- **Heading 2**: 1.5rem (24px)
- **Heading 3**: 1.25rem (20px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)
- **Caption**: 0.75rem (12px)

### น้ำหนักตัวอักษร
- **Bold**: 700
- **Semi-bold**: 600
- **Medium**: 500
- **Regular**: 400

## Components

### UI Components (จาก Shadcn/Radix UI)
- Button
- Input
- Select
- Dialog
- Toast
- Avatar
- Badge
- Card
- Table
- Tabs
- Accordion
- Dropdown Menu
- และอื่นๆ

### Custom Components
- `AppShell` - โครงสร้างหลักของแอป
- `PhoneFrame` - frame สำหรับจำลองหน้าจอมือถือ
- `BottomNav` - navigation bar ด้านล่าง
- `StatusBar` - status bar ด้านบน
- `StepIndicator` - indicator สำหรับแสดงขั้นตอน
- `VehicleIcon` - icon สำหรับแสดงประเภทยานพาหนะ
- `Logo` - logo ของ JUMBO GO

## Spacing

ใช้ Tailwind CSS spacing scale:
- `4` = 1rem (16px)
- `8` = 2rem (32px)
- `12` = 3rem (48px)
- `16` = 4rem (64px)

## Border Radius

- `rounded-md` = 6px
- `rounded-lg` = 8px
- `rounded-xl` = 12px
- `rounded-full` = 50%

## Shadows

- `shadow-sm` - เงาเล็กน้อย
- `shadow-md` - เงาปานกลาง
- `shadow-lg` - เงาใหญ่

## Layout

### Container Width
- Mobile: 100%
- Tablet: 768px
- Desktop: 1024px

### Grid System
ใช้ Tailwind CSS Grid:
- `grid-cols-1` - 1 column
- `grid-cols-2` - 2 columns
- `grid-cols-3` - 3 columns
- `grid-cols-4` - 4 columns

## Responsive Breakpoints

- `sm` = 640px
- `md` = 768px
- `lg` = 1024px
- `xl` = 1280px
- `2xl` = 1536px

## Animation

ใช้ Framer Motion สำหรับ animations:
- Page transitions
- Modal open/close
- Button hover effects
- Loading states

## Accessibility

- ใช้ Semantic HTML
- ใช้ ARIA labels สำหรับ elements ที่ไม่มี text
- รองรับ keyboard navigation
- ใช้สีที่มีความ contrast เพียงพอ
