import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LOCATIONS = [
  {
    name: "สาทร สแควร์",
    address: "ชั้น 18 ถนนสาทรเหนือ แขวงสีลม เขตบางรัก",
    sub: "แขวงสีลม เขตบางรัก กรุงเทพมหานคร",
    lat: 13.7225,
    lng: 100.5289,
    tag: "ออฟฟิศ",
  },
  {
    name: "บ้านเดี่ยว บางนา-ตราด",
    address: "ซอยบางนา 12 แขวงบางนา เขตบางนา",
    sub: "กม. 4 บางนา-ตราด กรุงเทพมหานคร",
    lat: 13.668217,
    lng: 100.614021,
    tag: "บ้าน",
  },
  {
    name: "สนามบินสุวรรณภูมิ คลังสินค้า 3",
    address: "อาคารคลังสินค้าระหว่างประเทศ โซน Free Zone",
    sub: "ต.หนองปรือ อ.บางพลี จ.สมุทรปราการ",
    lat: 13.69,
    lng: 100.75,
    tag: "สนามบิน",
  },
  {
    name: "ไอคอนสยาม ประตู 4",
    address: "จุดขนส่งสินค้า ถนนเจริญนคร",
    sub: "คลองต้นไทร คลองสาน กรุงเทพมหานคร",
    lat: 13.7267,
    lng: 100.5108,
    tag: "ห้างสรรพสินค้า",
  },
  {
    name: "โกดัง ทีทีดับบลิว บางพลี",
    address: "ถนนกิ่งแก้ว ต.บางพลีใหญ่",
    sub: "อ.บางพลี จ.สมุทรปราการ",
    lat: 13.6125,
    lng: 100.718,
    tag: "โกดัง",
  },
];

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.toLowerCase() || "";
  const filtered = query
    ? DEFAULT_LOCATIONS.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.address.toLowerCase().includes(query) ||
          l.sub.toLowerCase().includes(query)
      )
    : DEFAULT_LOCATIONS;

  return NextResponse.json({
    success: true,
    results: filtered,
  });
}
