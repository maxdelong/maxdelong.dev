import { describe, expect, it } from "vitest";
import { classifyOpenDotaStatus } from "@/lib/dota-tracker/opendota";

describe("classifyOpenDotaStatus", () => {
  it("classifies 404 as not-found", () => {
    expect(classifyOpenDotaStatus(404)).toBe("not-found");
  });

  it("classifies 429 as rate-limited", () => {
    expect(classifyOpenDotaStatus(429)).toBe("rate-limited");
  });

  it("classifies other non-2xx statuses as unavailable", () => {
    expect(classifyOpenDotaStatus(500)).toBe("unavailable");
    expect(classifyOpenDotaStatus(503)).toBe("unavailable");
    expect(classifyOpenDotaStatus(400)).toBe("unavailable");
  });
});
