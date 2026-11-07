"use client";

import { useState } from "react";
import { type Car, carCost, type CarCost } from "@/lib/car-cost/cost";

type CarForm = Record<keyof Car, string> & { name: string };

const FIELDS: { key: keyof Car; label: string }[] = [
  { key: "price", label: "Price ($)" },
  { key: "downPayment", label: "Down payment ($)" },
  { key: "loanRate", label: "Loan rate (%)" },
  { key: "loanYears", label: "Loan length (years)" },
  { key: "yearsOwned", label: "Years you'll keep it" },
  { key: "resaleValue", label: "Resale value then ($)" },
  { key: "milesPerYear", label: "Miles per year" },
  { key: "milesPerGallon", label: "Miles per gallon" },
  { key: "gasPrice", label: "Gas price ($/gallon)" },
  { key: "insurancePerYear", label: "Insurance ($/year)" },
  { key: "upkeepPerYear", label: "Upkeep and repairs ($/year)" },
];

const EXAMPLE_NEW: CarForm = {
  name: "New car",
  price: "32000",
  downPayment: "4000",
  loanRate: "7",
  loanYears: "5",
  yearsOwned: "5",
  resaleValue: "17000",
  milesPerYear: "12000",
  milesPerGallon: "32",
  gasPrice: "3.25",
  insurancePerYear: "1800",
  upkeepPerYear: "600",
};

const EXAMPLE_USED: CarForm = {
  ...EXAMPLE_NEW,
  name: "Used car",
  price: "18000",
  downPayment: "3000",
  loanRate: "9",
  resaleValue: "9000",
  milesPerGallon: "28",
  insurancePerYear: "1500",
  upkeepPerYear: "1100",
};

const ROWS: { key: keyof CarCost; label: string }[] = [
  { key: "depreciation", label: "Value lost" },
  { key: "interest", label: "Loan interest" },
  { key: "fuel", label: "Gas" },
  { key: "insurance", label: "Insurance" },
  { key: "upkeep", label: "Upkeep and repairs" },
];

const dollars = (value: number | null, cents = false) =>
  value === null
    ? "—"
    : value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: cents ? 2 : 0,
        minimumFractionDigits: cents ? 2 : 0,
      });

function toCar(form: CarForm): Car {
  return Object.fromEntries(
    FIELDS.map(({ key }) => [key, Math.max(0, Number(form[key]) || 0)])
  ) as unknown as Car;
}

function CarFields({
  form,
  index,
  onChange,
}: Readonly<{ form: CarForm; index: number; onChange: (form: CarForm) => void }>) {
  return (
    <fieldset className="min-w-0 rounded-xl border border-line bg-panel p-4">
      <legend className="sr-only">Car {index + 1}</legend>
      <input
        value={form.name}
        onChange={(event) => onChange({ ...form, name: event.target.value })}
        aria-label={`Car ${index + 1} name`}
        className="mb-2 w-full rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-sm font-semibold text-ink"
      />
      <div className="flex flex-col gap-1.5">
        {FIELDS.map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between gap-2 text-[13px] text-muted">
            {label}
            <input
              type="number"
              min={0}
              step="any"
              value={form[key]}
              onChange={(event) => onChange({ ...form, [key]: event.target.value })}
              className="w-24 rounded-lg border border-line bg-canvas px-2 py-1 text-right text-[13px] text-ink"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CarCompare() {
  const [forms, setForms] = useState([EXAMPLE_NEW, EXAMPLE_USED]);
  const costs = forms.map((form) => carCost(toCar(form)));
  const [first, second] = costs;
  const gap = Math.abs(first.total - second.total);
  const cheaper = first.total <= second.total ? forms[0] : forms[1];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        {forms.map((form, index) => (
          <CarFields
            key={index}
            form={form}
            index={index}
            onChange={(next) => setForms(forms.map((other, i) => (i === index ? next : other)))}
          />
        ))}
      </div>

      <section aria-label="Results" aria-live="polite" className="rounded-xl border border-line bg-panel p-4">
        <p className="text-xl font-semibold tracking-tight text-ink">
          {gap < 1
            ? "They cost about the same."
            : `${cheaper.name.trim() || "That car"} saves you ${dollars(gap)} overall.`}
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-96 text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th scope="col" className="py-1.5 font-medium">
                  <span className="sr-only">Cost</span>
                </th>
                {forms.map((form, index) => (
                  <th key={index} scope="col" className="py-1.5 text-right font-medium text-ink">
                    {form.name || `Car ${index + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ROWS.map(({ key, label }) => (
                <tr key={key}>
                  <th scope="row" className="py-1.5 text-left font-normal text-muted">
                    {label}
                  </th>
                  {costs.map((cost, index) => (
                    <td key={index} className="py-1.5 text-right tabular-nums text-ink">
                      {dollars(cost[key])}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="font-semibold">
                <th scope="row" className="py-1.5 text-left text-ink">
                  True total
                </th>
                {costs.map((cost, index) => (
                  <td key={index} className="py-1.5 text-right tabular-nums text-ink">
                    {dollars(cost.total)}
                  </td>
                ))}
              </tr>
              <tr className="font-semibold">
                <th scope="row" className="py-1.5 text-left text-ink">
                  Per month
                </th>
                {costs.map((cost, index) => (
                  <td key={index} className="py-1.5 text-right tabular-nums text-accent">
                    {dollars(cost.perMonth)}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="py-1.5 text-left font-normal text-muted">
                  Per mile
                </th>
                {costs.map((cost, index) => (
                  <td key={index} className="py-1.5 text-right tabular-nums text-ink">
                    {dollars(cost.perMile, true)}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="py-1.5 text-left font-normal text-muted">
                  Loan payment, for comparison
                </th>
                {costs.map((cost, index) => (
                  <td key={index} className="py-1.5 text-right tabular-nums text-muted">
                    {dollars(cost.loanPayment)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-muted">
        The starting numbers are made-up examples, so replace them with your own. This is a rough
        estimate, not financial advice.
      </p>
    </div>
  );
}
