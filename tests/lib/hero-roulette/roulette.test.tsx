import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Roulette } from "@/components/hero-roulette/Roulette";
import { HEROES } from "@/lib/hero-roulette/heroes";
import {
  BUILDS,
  canReroll,
  CURSED_CHANCE,
  MAX_REROLLS,
  penaltiesFor,
  REROLL_PENALTIES,
  spin,
} from "@/lib/hero-roulette/roulette";

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

describe("hero data", () => {
  it("has unique names, and every hero fits at least one build and misfits another", () => {
    expect(new Set(HEROES.map((hero) => hero.name)).size).toBe(HEROES.length);
    for (const hero of HEROES) {
      const fits = BUILDS.filter((build) => hero.roles.includes(build.role));
      expect(fits.length, hero.name).toBeGreaterThan(0);
      expect(fits.length, hero.name).toBeLessThan(BUILDS.length);
    }
  });
});

describe("spin", () => {
  it("gives a suitable build unless the spin is cursed", () => {
    const rng = seeded(1);
    const spins = Array.from({ length: 2000 }, () => spin(rng));

    for (const result of spins) {
      expect(result.hero.roles.includes(result.build.role)).toBe(!result.cursed);
      expect(result.build.lanes).toContain(result.lane);
    }
    const cursedShare = spins.filter((result) => result.cursed).length / spins.length;
    expect(cursedShare).toBeGreaterThan(CURSED_CHANCE - 0.05);
    expect(cursedShare).toBeLessThan(CURSED_CHANCE + 0.05);
  });

  it("can reach every hero and never repeats the previous one", () => {
    const rng = seeded(2);
    const seen = new Set<string>();
    let previous: string | undefined;
    for (let i = 0; i < 5000; i++) {
      const { hero } = spin(rng, previous);
      expect(hero.name).not.toBe(previous);
      seen.add(hero.name);
      previous = hero.name;
    }
    expect(seen.size).toBe(HEROES.length);
  });

  it("stays valid at the extremes of the random range", () => {
    expect(spin(() => 0).hero).toBeDefined();
    const top = spin(() => 0.999999);
    expect(top.hero).toBeDefined();
    expect(top.build).toBeDefined();
    expect(top.twist).toBeDefined();
  });
});

describe("rerolls", () => {
  it("makes the first reroll free, then stacks penalties until rerolls run out", () => {
    expect(penaltiesFor(0)).toEqual([]);
    expect(penaltiesFor(1)).toEqual([]);
    expect(penaltiesFor(2)).toEqual(REROLL_PENALTIES.slice(0, 1));
    expect(penaltiesFor(MAX_REROLLS)).toEqual(REROLL_PENALTIES);
    expect(canReroll(MAX_REROLLS - 1)).toBe(true);
    expect(canReroll(MAX_REROLLS)).toBe(false);
  });
});

describe("Roulette", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  function clickAndSettle(name: string | RegExp) {
    fireEvent.click(screen.getByRole("button", { name }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  }

  it("spins, runs out of rerolls, locks in and starts over", () => {
    vi.useFakeTimers();
    render(<Roulette />);

    clickAndSettle("Spin");
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reroll (free)" })).toBeEnabled();

    clickAndSettle("Reroll (free)");
    for (let i = 1; i < MAX_REROLLS; i++) clickAndSettle("Reroll (costs you)");

    expect(screen.getByRole("button", { name: "No rerolls left" })).toBeDisabled();
    expect(screen.getByText(REROLL_PENALTIES[REROLL_PENALTIES.length - 1])).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Lock it in" }));
    expect(screen.getByText(/Locked in/)).toBeInTheDocument();

    clickAndSettle("Spin again");
    expect(screen.getByRole("button", { name: "Reroll (free)" })).toBeEnabled();
    expect(screen.queryByText(REROLL_PENALTIES[0])).toBeNull();
  });
});
