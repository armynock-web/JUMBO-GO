import { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTokenUserId, resolveDriverId } from "@/lib/request-auth";

const DRIVER_ROW = { id: "6d4a6c6d-d97f-4aca-adbc-25f8a6598f76" };

vi.mock("@/lib/supabase/repository", () => ({
  JumboRepository: {
    getDriverByUserId: vi.fn(async (userId: string) =>
      userId === "f74c32ed-7cb6-49a8-9963-a21d34e73335" ? DRIVER_ROW : null
    ),
    getDriverById: vi.fn(async (id: string) =>
      id === "6d4a6c6d-d97f-4aca-adbc-25f8a6598f76" ? DRIVER_ROW : null
    ),
  },
}));

import { JumboRepository } from "@/lib/supabase/repository";

function makeReq(header: string | null): NextRequest {
  return new NextRequest("http://localhost/api/test", {
    headers: header ? { authorization: header } : {},
  });
}

describe("getTokenUserId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("parses Bearer jumbo_<userId> token", () => {
    const req = makeReq("Bearer jumbo_a9dce7bb-a9cf-4f21-874a-129b0138fd56");
    expect(getTokenUserId(req)).toBe("a9dce7bb-a9cf-4f21-874a-129b0138fd56");
  });

  it("parses raw jumbo_ token (case-insensitive Bearer)", () => {
    const req = new NextRequest("http://localhost/api/test?token=jumbo_xyz", {});
    expect(getTokenUserId(req)).toBe("xyz");
  });

  it("returns null for non-jumbo token", () => {
    const req = makeReq("Bearer anon-key-123");
    expect(getTokenUserId(req)).toBeNull();
  });

  it("returns null when header missing", () => {
    const req = makeReq(null);
    expect(getTokenUserId(req)).toBeNull();
  });
});

describe("resolveDriverId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves driver id from token via user_id", async () => {
    const req = makeReq("Bearer jumbo_f74c32ed-7cb6-49a8-9963-a21d34e73335");
    const id = await resolveDriverId(req);
    expect(id).toBe("6d4a6c6d-d97f-4aca-adbc-25f8a6598f76");
    expect(JumboRepository.getDriverByUserId).toHaveBeenCalledWith(
      "f74c32ed-7cb6-49a8-9963-a21d34e73335"
    );
  });

  it("accepts valid explicit driverId when no token", async () => {
    const req = makeReq(null);
    const id = await resolveDriverId(req, "6d4a6c6d-d97f-4aca-adbc-25f8a6598f76");
    expect(id).toBe("6d4a6c6d-d97f-4aca-adbc-25f8a6598f76");
  });

  it("rejects unknown explicit driverId", async () => {
    const req = makeReq(null);
    const id = await resolveDriverId(req, "00000000-0000-0000-0000-000000000000");
    expect(id).toBeNull();
  });

  it("returns null when no identity anywhere", async () => {
    const req = makeReq(null);
    expect(await resolveDriverId(req)).toBeNull();
  });
});