import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (clsx + tailwind-merge)", () => {
  it("merges conditional class names", () => {
    expect(cn("base", true && "on", false && "off")).toBe("base on");
  });

  it("tailwind-merge dedupes conflicting utilities (last wins)", () => {
    expect(cn("p-2 p-4")).toBe("p-4");
    expect(cn("text-red-500 text-blue-600")).toBe("text-blue-600");
  });

  it("keeps non-tailwind strings intact and handles empty args", () => {
    expect(cn("btn", "px-3", undefined, null)).toBe("btn px-3");
    expect(cn()).toBe("");
  });

  it("combined merge of grouped inputs", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
  });
});