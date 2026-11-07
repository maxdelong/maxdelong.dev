export interface Car {
  price: number;
  downPayment: number;
  /** Annual loan rate as a percentage, like 7 for 7%. */
  loanRate: number;
  loanYears: number;
  yearsOwned: number;
  /** What it sells for at the end. */
  resaleValue: number;
  milesPerYear: number;
  milesPerGallon: number;
  gasPrice: number;
  insurancePerYear: number;
  upkeepPerYear: number;
}

export interface CarCost {
  /** Price minus resale value. */
  depreciation: number;
  /** Interest paid while you own the car. */
  interest: number;
  fuel: number;
  insurance: number;
  upkeep: number;
  total: number;
  /** Null if the car is owned for no time. */
  perMonth: number | null;
  /** Null if the car is never driven. */
  perMile: number | null;
  /** The number on the loan paperwork, for comparison. */
  loanPayment: number;
}

/**
 * The real cost of owning a car. Loan payments aren't added up directly, because
 * paying off the price is already counted as depreciation and resale value.
 */
export function carCost(car: Car): CarCost {
  const principal = Math.max(0, car.price - car.downPayment);
  const loanMonths = Math.round(car.loanYears * 12);
  const monthsOwned = Math.max(0, Math.round(car.yearsOwned * 12));
  const years = monthsOwned / 12;
  const miles = car.milesPerYear * years;

  const { payment, interest } = loan(principal, car.loanRate, loanMonths, monthsOwned);
  const depreciation = car.price - car.resaleValue;
  const fuel = car.milesPerGallon > 0 ? (miles / car.milesPerGallon) * car.gasPrice : 0;
  const insurance = car.insurancePerYear * years;
  const upkeep = car.upkeepPerYear * years;
  const total = depreciation + interest + fuel + insurance + upkeep;

  return {
    depreciation,
    interest,
    fuel,
    insurance,
    upkeep,
    total,
    perMonth: monthsOwned > 0 ? total / monthsOwned : null,
    perMile: miles > 0 ? total / miles : null,
    loanPayment: payment,
  };
}

/** The monthly payment, and the interest paid during the months the car is owned. */
function loan(principal: number, annualRate: number, months: number, monthsOwned: number) {
  if (principal <= 0 || months <= 0) return { payment: 0, interest: 0 };

  const rate = annualRate / 100 / 12;
  if (rate <= 0) return { payment: principal / months, interest: 0 };

  const growth = (1 + rate) ** months;
  const payment = (principal * rate * growth) / (growth - 1);
  const paidMonths = Math.min(monthsOwned, months);
  const balance = principal * (1 + rate) ** paidMonths - (payment * ((1 + rate) ** paidMonths - 1)) / rate;
  return { payment, interest: payment * paidMonths - (principal - balance) };
}
