import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JUMBO GO - เรียกรถขนของ ราคาคนไทย",
  description:
    "JUMBO GO แพลตฟอร์มเรียกรถขนของ ส่งของ • ย้ายบ้าน • ใช้งานง่าย เร็ว • ปลอดภัย • ไว้ใจได้ ขนได้ทุกที่ ไปได้ไกลกว่า ไปกับคนไทย",
  keywords: [
    "JUMBO GO",
    "เรียกรถ",
    "ขนส่ง",
    "ย้ายบ้าน",
    "รถกระบะ",
    "รถส่งของ",
    "JUMBO",
    "6 ล้อ",
  ],
  authors: [{ name: "JUMBO GO" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "JUMBO GO - เรียกรถขนของ ราคาคนไทย",
    description: "เร็ว • ปลอดภัย • ไว้ใจได้ ขนได้ทุกที่ ไปได้ไกลกว่า ไปกับคนไทย",
    siteName: "JUMBO GO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JUMBO GO",
    description: "เรียกรถขนของ ราคาคนไทย",
  },
};

export const viewport: Viewport = {
  themeColor: "#ED1C24",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${notoSansThai.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
