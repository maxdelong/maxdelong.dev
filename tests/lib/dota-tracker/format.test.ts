import { describe, expect, it } from "vitest";
import { classifySearchInput, computeWinRate, steamId64ToAccountId } from "@/lib/dota-tracker/format";

describe("classifySearchInput", () => {
  it("returns null for empty or whitespace-only input", () => {
    expect(classifySearchInput("")).toBeNull();
    expect(classifySearchInput("   ")).toBeNull();
  });

  it("classifies a 17-digit SteamID64 as an account id, converted", () => {
    const result = classifySearchInput("76561198012345678");
    expect(result).toEqual({ type: "account-id", accountId: 52079950 });
  });

  it("classifies a short numeric string as an account id directly", () => {
    expect(classifySearchInput("123456789")).toEqual({
      type: "account-id",
      accountId: 123456789,
    });
  });

  it("classifies a non-numeric string as a name", () => {
    expect(classifySearchInput("Miracle-")).toEqual({ type: "name", name: "Miracle-" });
  });

  it("trims whitespace around a name", () => {
    expect(classifySearchInput("  SumaiL  ")).toEqual({ type: "name", name: "SumaiL" });
  });
});

describe("steamId64ToAccountId", () => {
  it("subtracts the fixed SteamID64 offset without precision loss", () => {
    expect(steamId64ToAccountId("76561198012345678")).toBe(52079950);
  });
});

describe("computeWinRate", () => {
  it("computes a fraction from win/lose counts", () => {
    expect(computeWinRate(60, 40)).toBe(0.6);
  });

  it("returns null when there are no recorded matches", () => {
    expect(computeWinRate(0, 0)).toBeNull();
  });
});
