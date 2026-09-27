"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Truck,
  Building2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { useJumbo } from "@/store/jumbo";

interface BannerItem {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  ctaText: string;
  code?: string;
  bgGradient: string;
  accentColor: string;
  icon: typeof Tag;
  action: (go: (screen: any) => void, onApplyCode?: (code: string) => void) => void;
}

interface PromotionBannerCarouselProps {
  onApplyPromoCode?: (code: string) => void;
}

export function PromotionBannerCarousel({
  onApplyPromoCode,
}: PromotionBannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [copied, setCopied] = useState(false);
  const go = useJumbo((s) => s.go);

  const BANNERS: BannerItem[] = [
    {
      id: "promo-first",
      badge: "สิทธิพิเศษลูกค้าใหม่",
      title: "ฉลองเปิดตัว JUMBO GO",
      highlight: "ลดทันที ฿150",
      subtitle: "ใช้โค้ด JUMBOFIRST เรียกรถทุกประเภทเที่ยวแรก",
      ctaText: "ใช้โค้ดนี้เลย",
      code: "JUMBOFIRST",
      bgGradient: "from-red-600 via-rose-600 to-amber-600",
      accentColor: "bg-white text-red-600",
      icon: Tag,
      action: (_, apply) => {
        if (apply) apply("JUMBOFIRST");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
    {
      id: "promo-moving",
      badge: "บริการยอดนิยม",
      title: "ย้ายบ้าน คอนโด สำนักงาน",
      highlight: "พร้อมทีมยกของมืออาชีพ",
      subtitle: "กระบะตู้ทึบและ 4 ล้อใหญ่ ขนส่งปลอดภัย 100% ไร้กังวล",
      ctaText: "ดูข้อมูลรถตู้ทึบ",
      bgGradient: "from-slate-900 via-indigo-950 to-slate-900",
      accentColor: "bg-amber-400 text-slate-950",
      icon: Truck,
      action: (navigate) => {
        navigate("home");
      },
    },
    {
      id: "promo-business",
      badge: "JUMBO for Business",
      title: "โซลูชันขนส่งสำหรับธุรกิจ",
      highlight: "วางบิล เครดิตเทอม 30 วัน",
      subtitle: "ประกันสินค้าเสียหาย 50,000 บาทฟรีทุกเที่ยววิ่ง",
      ctaText: "สอบถามเปิดบัญชีธุรกิจ",
      bgGradient: "from-blue-900 via-slate-900 to-blue-950",
      accentColor: "bg-emerald-400 text-slate-950",
      icon: Building2,
      action: () => {
        window.open("tel:021234567", "_self");
      },
    },
    {
      id: "promo-driver",
      badge: "ร่วมงานกับเรา",
      title: "สมัครเป็นพาร์ทเนอร์คนขับ",
      highlight: "รายได้เฉลี่ย 35,000+ บ./ด.",
      subtitle: "ขับรถกระบะหรือ 6 ล้อ รับงานอิสระ โอนไวทุกวัน",
      ctaText: "สมัครเป็นคนขับเลย",
      bgGradient: "from-emerald-700 via-teal-800 to-slate-900",
      accentColor: "bg-white text-emerald-800",
      icon: ShieldCheck,
      action: () => {
        window.location.href = "/driver";
      },
    },
  ];

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [BANNERS.length]);

  const banner = BANNERS[current];
  const IconComponent = banner.icon;

  const nextBanner = () => setCurrent((prev) => (prev + 1) % BANNERS.length);
  const prevBanner = () =>
    setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-md border border-slate-200/80">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className={`relative overflow-hidden bg-gradient-to-r ${banner.bgGradient} p-4 text-white sm:p-5`}
        >
          {/* Subtle Background Pattern */}
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute right-12 bottom-0 opacity-15 pointer-events-none">
            <IconComponent className="h-32 w-32 text-white" />
          </div>

          <div className="relative z-10 flex flex-col justify-between gap-3">
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                {banner.badge}
              </span>

              {/* Slide Indicators */}
              <div className="flex items-center gap-1">
                {BANNERS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === current
                        ? "w-5 bg-white"
                        : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Headline Content */}
            <div className="mt-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-black tracking-tight sm:text-[17px]">
                  {banner.title}:{" "}
                  <span className="text-amber-300 font-extrabold">
                    {banner.highlight}
                  </span>
                </h3>
              </div>
              <p className="mt-0.5 text-[11px] sm:text-[12px] text-white/90">
                {banner.subtitle}
              </p>
            </div>

            {/* Action Row */}
            <div className="mt-1 flex items-center justify-between gap-2">
              <button
                onClick={() => banner.action(go, onApplyPromoCode)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[12px] font-black shadow-sm transition hover:opacity-90 active:scale-95 ${banner.accentColor}`}
              >
                <span>
                  {copied && banner.code ? "✓ นำโค้ดไปใช้แล้ว!" : banner.ctaText}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={prevBanner}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/20 text-white hover:bg-black/30 transition"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextBanner}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/20 text-white hover:bg-black/30 transition"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
