import { NextRequest } from "next/server";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { POST as postLogin } from "@/app/api/auth/login/route";
import { POST as postRegister } from "@/app/api/auth/register/route";
import { GET as getMe } from "@/app/api/auth/me/route";
import { POST as postSendOtp } from "@/app/api/auth/send-otp/route";
import { POST as postVerifyOtp } from "@/app/api/auth/verify-otp/route";

const BASE = "http://localhost";
// ใช้เบอร์สุ่มเพื่อไม่ชนกับข้อมูลจริง และลบ user หลัง test
const TEST_PHONE_NUMBER = `08${Math.floor(10000000 + Math.random() * 89999999)}`;

function req(method: string, path: string, opts: { body?: unknown; token?: string } = {}) {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["content-type"] = "application/json";
  if (opts.token) headers.authorization = `Bearer jumbo_${opts.token}`;
  return new NextRequest(`${BASE}${path}`, {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
}

// เก็บ state ที่ต้อง cleanup
let registered = { userId: "", email: "", phone: TEST_PHONE_NUMBER };
let otpVerifyUserId = "";

afterAll(async () => {
  if (registered.userId) {
    // 1) ลบ auth user
    await supabaseAdmin.auth.admin.deleteUser(registered.userId);
    // 2) ลบข้อมูลในตาราง users (ถ้าเหลือ)
    await supabaseServer.from("users").delete().eq("id", registered.userId);
  }
  if (otpVerifyUserId) {
    await supabaseServer.from("users").delete().eq("id", otpVerifyUserId);
  }
});

describe("POST /api/auth/register", () => {
  it("rejects empty payload (400)", async () => {
    const res = await postRegister(req("POST", "/api/auth/register", { body: {} }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("creates a real user with token (200)", async () => {
    const res = await postRegister(
      req("POST", "/api/auth/register", {
        body: {
          fullName: "ทดสอบ สมมุติ",
          phone: registered.phone,
          role: "user",
        },
      })
    );
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.token).toMatch(/^jumbo_/);
    expect(body.user).toBeTruthy();
    expect(body.user.first_name).toBe("ทดสอบ");
    expect(body.user.last_name).toBe("สมมุติ");
    registered.userId = body.user.id as string;
    registered.email = body.user.email as string;
  });
});

describe("POST /api/auth/login", () => {
  it("400 when neither email/password nor phone given", async () => {
    const res = await postLogin(req("POST", "/api/auth/login", { body: {} }));
    expect(res.status).toBe(400);
  });

  it("404 for unknown phone", async () => {
    const res = await postLogin(
      req("POST", "/api/auth/login", { body: { phone: "000-000-0000" } })
    );
    expect(res.status).toBe(404);
  });

  it("401 for wrong email/password (unknown email)", async () => {
    const res = await postLogin(
      req("POST", "/api/auth/login", {
        body: { email: "no-such-user@jumbogo.local", password: "wrongpass" },
      })
    );
    expect(res.status).toBe(401);
  });

  it("phone lookup returns token for registered user (200)", async () => {
    // ใช้ register user ด้านบน (มีอยู่ใน auth) ผ่าน phone lookup
    const res = await postLogin(
      req("POST", "/api/auth/login", { body: { phone: registered.phone } })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.token).toBe(`jumbo_${registered.userId}`);
  });
});

describe("GET /api/auth/me", () => {
  it("authenticated: false with no token", async () => {
    const res = await getMe(req("GET", "/api/auth/me"));
    const body = await res.json();
    expect(body.authenticated).toBe(false);
  });

  it("authenticated: true with valid token", async () => {
    const res = await getMe(req("GET", "/api/auth/me", { token: registered.userId }));
    const body = await res.json();
    expect(body.authenticated).toBe(true);
    expect(body.user.id).toBe(registered.userId);
  });

  it("query param token works too", async () => {
    const reqWithQuery = new NextRequest(
      `${BASE}/api/auth/me?token=jumbo_${registered.userId}`
    );
    const res = await getMe(reqWithQuery);
    const body = await res.json();
    expect(body.authenticated).toBe(true);
  });
});

describe("POST /api/auth/send-otp + verify-otp", () => {
  let otp = "";

  it("send-otp returns code and stores in map", async () => {
    const res = await postSendOtp(
      req("POST", "/api/auth/send-otp", { body: { phone: registered.phone } })
    );
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.otp).toMatch(/^\d{6}$/);
    otp = body.otp as string;
  });

  it("verify-otp rejects wrong code (400)", async () => {
    const res = await postVerifyOtp(
      req("POST", "/api/auth/verify-otp", {
        body: { phone: registered.phone, otp: "000000" },
      })
    );
    expect(res.status).toBe(400);
  });

  it("verify-otp accepts correct code and returns token", async () => {
    const res = await postVerifyOtp(
      req("POST", "/api/auth/verify-otp", {
        body: { phone: registered.phone, otp },
      })
    );
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.token).toMatch(/^jumbo_/);
    expect(body.user).toBeTruthy();
  });

  it("verify-otp creates a new user when phone not registered", async () => {
    const newPhone = `08${Math.floor(10000000 + Math.random() * 89999999)}`;
    const sendRes = await postSendOtp(
      req("POST", "/api/auth/send-otp", { body: { phone: newPhone } })
    );
    const sendBody = await sendRes.json();
    const verifyRes = await postVerifyOtp(
      req("POST", "/api/auth/verify-otp", {
        body: { phone: newPhone, otp: sendBody.otp },
      })
    );
    const verifyBody = await verifyRes.json();
    expect(verifyRes.status).toBe(200);
    expect(verifyBody.success).toBe(true);
    expect(verifyBody.user.phone).toBe(newPhone);
    otpVerifyUserId = verifyBody.user.id as string;
  });
});