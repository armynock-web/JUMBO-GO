import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://oqopribnhovxfaxnjoia.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "NEXT_PUBLIC_SUPABASE_ANON_KEY_REPLACED";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
