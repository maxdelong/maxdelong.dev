import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DailyFetch } from "@/components/daily-fetch/DailyFetch";
import {
  dateKey,
  dayFor,
  flightFor,
  MAX_ANGLE,
  MAX_POWER,
  MIN_ANGLE,
  MIN_POWER,
  positionAt,
  shareText,
  verdictFor,
} from "@/lib/daily-fetch/game";

function datesFrom(start: string, count: number): string[] {
  const first = new Date(`${start}T00:00:00Z`).getTime();
  return Array.from({ length: count }, (_, i) =>
    new Date(first + i * 86_400_000).toISOString().slice(0, 10)
  );
}

describe("days", () => {
  const dates = datesFrom("2026-11-01", 730);

  it("gives the same day for the same date", () => {
    expect(dayFor("2026-11-06")).toEqual(dayFor("2026-11-06"));
  });

  it("varies from day to day and stays within its limits", () => {
    const days = dates.map(dayFor);
    expect(new Set(days.map((day) => `${day.dogDistance}/${day.wind}`)).size).toBeGreaterThan(300);
    for (const { dogDistance, wind } of days) {
      expect(dogDistance).toBeGreaterThanOrEqual(15);
      expect(dogDistance).toBeLessThanOrEqual(40);
      expect(Math.abs(wind)).toBeLessThanOrEqual(2.5);
    }
  });

  it("makes a catch possible every day", () => {
    for (const date of dates) {
      const day = dayFor(date);
      let best = Infinity;
      for (let angle = MIN_ANGLE; angle <= MAX_ANGLE; angle++) {
        for (let power = MIN_POWER; power <= MAX_POWER; power++) {
          best = Math.min(best, flightFor({ angle, power }, day).miss);
        }
      }
      expect(best, date).toBeLessThan(1);
    }
  });

  it("uses the calendar date", () => {
    expect(dateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("flight", () => {
  it("matches the textbook range with no wind", () => {
    const { landing, miss } = flightFor({ angle: 45, power: 14 }, { dogDistance: 10, wind: 0 });
    expect(landing).toBeCloseTo(20, 5);
    expect(miss).toBeCloseTo(10, 5);
  });

  it("is carried by a tailwind and held back by a headwind", () => {
    const aim = { angle: 45, power: 15 };
    const still = flightFor(aim, { dogDistance: 20, wind: 0 }).landing;
    expect(flightFor(aim, { dogDistance: 20, wind: 2 }).landing).toBeGreaterThan(still);
    expect(flightFor(aim, { dogDistance: 20, wind: -2 }).landing).toBeLessThan(still);
  });

  it("ends on the ground", () => {
    const day = { dogDistance: 20, wind: 1 };
    const aim = { angle: 60, power: 20 };
    expect(positionAt(aim, day, flightFor(aim, day).duration).y).toBeCloseTo(0, 5);
  });

  it("scores and shares a throw", () => {
    expect(verdictFor(0.5)).toContain("Caught");
    expect(verdictFor(50)).toContain("gone back inside");
    expect(shareText("2026-11-06", 1.42)).toBe("Daily Fetch 2026-11-06 🎾 1.4 m from the dog");
  });
});

describe("DailyFetch", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("allows one throw, and remembers it after a reload", () => {
    const { unmount } = render(<DailyFetch />);
    fireEvent.click(screen.getByRole("button", { name: /Throw/ }));

    expect(screen.getByText(/m from the dog/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Throw/ })).toBeNull();
    const score = screen.getByText(/m from the dog/).textContent;
    unmount();

    render(<DailyFetch />);
    expect(screen.queryByRole("button", { name: /Throw/ })).toBeNull();
    expect(screen.getByText(/m from the dog/).textContent).toBe(score);
  });
});
