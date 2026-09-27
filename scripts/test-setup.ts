import { loadEnvFile } from "node:process";
import { existsSync } from "node:fs";
import path from "node:path";

// โหลด .env.local ก่อนรัน tests เพื่อให้เชื่อม Supabase จริง (FACT verification ตาม ARM-AES)
const envPath = path.resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  loadEnvFile(envPath);
}