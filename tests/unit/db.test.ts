import { describe, it, expect } from "vitest";
import { supabase, supabaseServer } from "@/lib/db";

describe("lib/db re-exports", () => {
  it("re-exports both browser client and server client", () => {
    expect(supabase).toBeDefined();
    expect(typeof supabase.channel).toBe("function");
    expect(supabaseServer).toBeDefined();
  });
});