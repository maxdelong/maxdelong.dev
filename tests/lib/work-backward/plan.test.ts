import { describe, expect, it } from "vitest";
import { dayLabel, formatClock, parseClock, planBackward } from "@/lib/work-backward/plan";

describe("clock", () => {
  it("reads time input values", () => {
    expect(parseClock("07:30")).toBe(450);
    expect(parseClock("00:00")).toBe(0);
    expect(parseClock("")).toBeNull();
    expect(parseClock("25:00")).toBeNull();
  });

  it("formats 12-hour times, including noon and midnight", () => {
    expect(formatClock(0)).toBe("12:00 AM");
    expect(formatClock(450)).toBe("7:30 AM");
    expect(formatClock(720)).toBe("12:00 PM");
    expect(formatClock(1439)).toBe("11:59 PM");
  });
});

describe("planBackward", () => {
  it("starts each step early enough for everything after it, in order", () => {
    const plan = planBackward(540, [
      { name: "Get ready", minutes: 30 },
      { name: "Drive", minutes: 25 },
      { name: "Park", minutes: 10 },
    ]);

    expect(plan.map((step) => [step.name, step.start])).toEqual([
      ["Get ready", 475],
      ["Drive", 505],
      ["Park", 530],
    ]);
    expect(plan.every((step) => step.dayOffset === 0)).toBe(true);
  });

  it("rolls back into earlier days", () => {
    const plan = planBackward(30, [
      { name: "Sleep elsewhere", minutes: 1440 },
      { name: "Drive", minutes: 60 },
    ]);

    expect(plan[1]).toMatchObject({ start: 1410, dayOffset: -1 });
    expect(plan[0]).toMatchObject({ start: 1410, dayOffset: -2 });
    expect(dayLabel(0)).toBe("");
    expect(dayLabel(-1)).toBe("the day before");
    expect(dayLabel(-2)).toBe("2 days before");
  });

  it("handles a step ending exactly at midnight", () => {
    expect(planBackward(60, [{ name: "Drive", minutes: 60 }])[0]).toMatchObject({ start: 0, dayOffset: 0 });
  });

  it("handles an empty plan", () => {
    expect(planBackward(540, [])).toEqual([]);
  });
});
