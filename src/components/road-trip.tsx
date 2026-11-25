"use client";

import { useState } from "react";
import { calculateRoadTrip, roadTripExample } from "@/calculators/road-trip";

const groups = [
  {
    title: "Driving",
    fields: [
      ["distance", "Total trip distance (km)"],
      ["consumption", "Fuel use (L/100 km)"],
      ["fuelPrice", "Average fuel price ($/L)"],
      ["tolls", "Tolls and parking for the trip ($)"],
      ["wear", "Optional vehicle wear ($/km, excluding fuel)"],
    ],
  },
  {
    title: "People and stays",
    fields: [
      ["days", "Trip days"],
      ["nights", "Paid accommodation nights"],
      ["nightlyRate", "Accommodation per night for the group ($)"],
      ["travellers", "Travellers sharing the cost"],
      ["food", "Food per person per day ($)"],
      ["activities", "Activities for the group ($)"],
      ["other", "Other costs for the group ($)"],
      ["reserve", "Cash contingency (%)"],
    ],
  },
] as const;

const costLabels = {
  fuel: "Fuel",
  accommodation: "Accommodation",
  food: "Food",
  tolls: "Tolls and parking",
  activities: "Activities",
  other: "Other costs",
};

const currency = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });
const litres = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 1 });
type Field = keyof typeof roadTripExample;
const example = Object.fromEntries(
  Object.entries(roadTripExample).map(([key, value]) => [key, String(value)]),
) as Record<Field, string>;

export function RoadTrip() {
  const [draft, setDraft] = useState(example);
  let result: ReturnType<typeof calculateRoadTrip> | undefined;
  let error = "";
  try {
    if (Object.values(draft).some((value) => !value.trim())) {
      throw new Error("Complete all fields. Enter 0 for costs you want to leave out.");
    }
    result = calculateRoadTrip(Object.fromEntries(
      Object.entries(draft).map(([key, value]) => [key, Number(value)]),
    ) as typeof roadTripExample);
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "Check your trip inputs.";
  }

  return (
    <div className="comparison-tool">
      <p>Replace the example with your own estimates in AUD. Include the return leg and side trips in your distance.</p>
      <div className="comparison-inputs">
        {groups.map(({ title, fields }) => (
          <fieldset className="comparison-card" key={title}>
            <legend>{title}</legend>
            {fields.map(([key, label]) => {
              const whole = key === "days" || key === "nights" || key === "travellers";
              return (
                <label className="number-field" key={key}>
                  <span>{label}</span>
                  <div className="input-wrap">
                    <input
                      type="number"
                      inputMode={whole ? "numeric" : "decimal"}
                      min={key === "days" || key === "travellers" ? 1 : 0}
                      max={key === "reserve" ? 100 : 1_000_000}
                      step={whole ? 1 : "any"}
                      value={draft[key]}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((previous) => ({ ...previous, [key]: value }));
                      }}
                    />
                  </div>
                </label>
              );
            })}
          </fieldset>
        ))}
      </div>
      <button className="button" type="button" onClick={() => setDraft(example)}>Reset example</button>
      {error && <p className="comparison-error" role="status">{error}</p>}
      {result && (
        <section className="comparison-results" aria-labelledby="road-trip-results">
          <h2 id="road-trip-results">Your trip budget</h2>
          <div className="comparison-verdict" aria-live="polite">
            <div><span>Cash budget with contingency</span><strong>{currency.format(result.cashBudget)}</strong></div>
            <div><span>Cash budget per traveller</span><strong>{currency.format(result.perTraveller)}</strong></div>
          </div>
          <div className="comparison-table-wrap">
            <table>
              <thead><tr><th scope="col">Cost breakdown</th><th scope="col">Estimate</th></tr></thead>
              <tbody>
                {Object.entries(result.costs).map(([key, amount]) => (
                  <tr key={key}><th scope="row">{costLabels[key as keyof typeof costLabels]}</th><td>{currency.format(amount)}</td></tr>
                ))}
                <tr><th scope="row">Cash costs before contingency</th><td>{currency.format(result.cashCost)}</td></tr>
                <tr><th scope="row">Cash contingency</th><td>{currency.format(result.contingency)}</td></tr>
                <tr><th scope="row">Cash budget per trip day</th><td>{currency.format(result.perDay)}</td></tr>
                <tr><th scope="row">Optional vehicle wear</th><td>{currency.format(result.vehicleWear)}</td></tr>
                <tr><th scope="row">Total including vehicle wear</th><td>{currency.format(result.total)}</td></tr>
              </tbody>
            </table>
          </div>
          <p>Estimated fuel use is {litres.format(result.litres)} L.</p>
        </section>
      )}
      <section className="method-section">
        <h2>How we work it out</h2>
        <p>Fuel cost is total kilometres × litres per 100 km ÷ 100 × price per litre. Use fuel consumption that reflects the load and whether you’re towing.</p>
        <p>Accommodation is paid nights × the nightly group rate. Food is trip days × travellers × the daily food budget per person. The cash contingency applies to all entered cash costs.</p>
        <p>Optional vehicle wear is total kilometres × your wear allowance per kilometre. It adds to the total trip estimate. The cash budget and its daily and per-traveller amounts cover spending and contingency.</p>
      </section>
    </div>
  );
}
