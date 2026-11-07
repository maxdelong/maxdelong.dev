import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { LunchRoulette } from "@/components/lunch-roulette/LunchRoulette";
import {
  addPlace,
  canVeto,
  MAX_VETOES,
  penaltiesFor,
  pickPlace,
  VETO_PENALTIES,
} from "@/lib/lunch-roulette/roulette";

describe("rules", () => {
  it("never repeats the previous pick while there's another option", () => {
    for (let i = 0; i < 200; i++) {
      expect(pickPlace(["Tacos", "Sushi"], Math.random, "Tacos")).toBe("Sushi");
    }
    expect(pickPlace(["Tacos"], Math.random, "Tacos")).toBe("Tacos");
  });

  it("stays in bounds at the top of the random range", () => {
    expect(pickPlace(["Tacos", "Sushi"], () => 0.999999)).toBe("Sushi");
  });

  it("ignores blanks and duplicates when adding", () => {
    expect(addPlace(["Tacos"], "  ")).toEqual(["Tacos"]);
    expect(addPlace(["Tacos"], " tacos ")).toEqual(["Tacos"]);
    expect(addPlace(["Tacos"], " Sushi ")).toEqual(["Tacos", "Sushi"]);
  });

  it("makes the first veto free, then stacks penalties until vetoes run out", () => {
    expect(penaltiesFor(1)).toEqual([]);
    expect(penaltiesFor(2)).toEqual(VETO_PENALTIES.slice(0, 1));
    expect(penaltiesFor(MAX_VETOES)).toEqual(VETO_PENALTIES);
    expect(canVeto(MAX_VETOES - 1, 2)).toBe(true);
    expect(canVeto(MAX_VETOES, 2)).toBe(false);
    expect(canVeto(0, 1)).toBe(false);
  });
});

describe("LunchRoulette", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves the list, and can't spin an empty one", () => {
    const { unmount } = render(<LunchRoulette />);
    for (const button of screen.getAllByRole("button", { name: /^Remove/ })) fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Spin" })).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Add a place"), { target: { value: "Noodle Hut" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    unmount();

    render(<LunchRoulette />);
    fireEvent.click(screen.getByRole("button", { name: "Spin" }));
    expect(screen.getByRole("heading", { name: "Noodle Hut" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "No vetoes left" })).toBeDisabled();
  });

  it("recovers from a corrupted saved list", () => {
    window.localStorage.setItem("lunch-roulette:places", "not json");
    render(<LunchRoulette />);
    expect(screen.getByText("Tacos")).toBeInTheDocument();
  });

  it("charges for vetoes, runs out, and clears the debt on a new spin", () => {
    render(<LunchRoulette />);
    fireEvent.click(screen.getByRole("button", { name: "Spin" }));
    fireEvent.click(screen.getByRole("button", { name: "Veto (free)" }));
    for (let i = 1; i < MAX_VETOES; i++) {
      fireEvent.click(screen.getByRole("button", { name: "Veto (costs you)" }));
    }
    expect(screen.getByRole("button", { name: "No vetoes left" })).toBeDisabled();
    expect(screen.getByText(VETO_PENALTIES[0])).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Lock it in" }));
    fireEvent.click(screen.getByRole("button", { name: "Spin again" }));
    expect(screen.queryByText(VETO_PENALTIES[0])).toBeNull();
  });
});
