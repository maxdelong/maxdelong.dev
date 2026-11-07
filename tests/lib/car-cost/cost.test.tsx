import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CarCompare } from "@/components/car-cost/CarCompare";
import { type Car, carCost } from "@/lib/car-cost/cost";

const CASH_CAR: Car = {
  price: 20000,
  downPayment: 20000,
  loanRate: 0,
  loanYears: 0,
  yearsOwned: 2,
  resaleValue: 14000,
  milesPerYear: 10000,
  milesPerGallon: 25,
  gasPrice: 3,
  insurancePerYear: 1000,
  upkeepPerYear: 500,
};

describe("carCost", () => {
  it("adds up a cash purchase by hand", () => {
    const cost = carCost(CASH_CAR);

    expect(cost.depreciation).toBe(6000);
    expect(cost.interest).toBe(0);
    expect(cost.fuel).toBe(2400);
    expect(cost.insurance).toBe(2000);
    expect(cost.upkeep).toBe(1000);
    expect(cost.total).toBe(11400);
    expect(cost.perMonth).toBe(475);
    expect(cost.perMile).toBeCloseTo(0.57, 5);
    expect(cost.loanPayment).toBe(0);
  });

  it("matches a known loan: $10,000 at 6% over 5 years", () => {
    const cost = carCost({ ...CASH_CAR, downPayment: 10000, loanRate: 6, loanYears: 5, yearsOwned: 5 });

    expect(cost.loanPayment).toBeCloseTo(193.33, 2);
    expect(cost.interest).toBeCloseTo(1599.68, 0);
  });

  it("only counts interest paid while you own the car", () => {
    const loan = { ...CASH_CAR, downPayment: 10000, loanRate: 6, loanYears: 5 };
    const sold = carCost({ ...loan, yearsOwned: 1 }).interest;
    const kept = carCost({ ...loan, yearsOwned: 5 }).interest;
    const longer = carCost({ ...loan, yearsOwned: 8 }).interest;

    expect(sold).toBeGreaterThan(0);
    expect(sold).toBeLessThan(kept);
    expect(longer).toBeCloseTo(kept, 5);
  });

  it("doesn't add loan payments on top of the value lost", () => {
    const financed = carCost({ ...CASH_CAR, downPayment: 0, loanRate: 0, loanYears: 2 });

    expect(financed.loanPayment).toBeCloseTo(20000 / 24, 5);
    expect(financed.total).toBe(carCost(CASH_CAR).total);
  });

  it("survives zeros and a down payment larger than the price", () => {
    const empty = carCost({ ...CASH_CAR, yearsOwned: 0, milesPerGallon: 0, milesPerYear: 0 });
    expect(empty.perMonth).toBeNull();
    expect(empty.perMile).toBeNull();
    expect(empty.fuel).toBe(0);
    expect(Number.isFinite(empty.total)).toBe(true);

    const overpaid = carCost({ ...CASH_CAR, downPayment: 99999, loanRate: 5, loanYears: 5 });
    expect(overpaid.loanPayment).toBe(0);
    expect(overpaid.interest).toBe(0);
  });
});

describe("CarCompare", () => {
  it("names the cheaper car, and updates when a number changes", () => {
    render(<CarCompare />);
    expect(screen.getByText(/saves you/).textContent).toContain("Used car");

    const prices = screen.getAllByLabelText("Price ($)");
    fireEvent.change(prices[1], { target: { value: "90000" } });

    expect(screen.getByText(/saves you/).textContent).toContain("New car");
  });
});
