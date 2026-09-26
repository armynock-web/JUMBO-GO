import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

function parseToken(token: string): string | null {
  if (token.startsWith("jumbo_")) return token.slice(6);
  return null;
}

export async function GET(req: NextRequest) {
  const header = req.headers.get("authorization") || "";
  const bearer = header.replace(/^Bearer\s+/i, "");
  const token = bearer || req.nextUrl.searchParams.get("token") || "";

  const userId = parseToken(token);

  if (!userId) {
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }

  const { data: profile, error } = await supabaseServer
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }

  return NextResponse.json({
    authenticated: true,
    user: profile,
  });
}