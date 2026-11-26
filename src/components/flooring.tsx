"use client";

import { useState } from "react";
import { calculateFlooring, flooringExample } from "@/calculators/flooring";

const settings = [
  { key: "wastePercent", label: "Waste allowance (%)", min: 0, max: 100, step: 0.01 },
  { key: "packCoverage", label: "Coverage per pack (m²)", min: 0.0001, max: 1000, step: 0.0001 },
  { key: "packPrice", label: "Price per pack (AUD)", min: 0, max: 100000, step: 0.01 },
] as const;

const areaFormat = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 4 });
const packFormat = new Intl.NumberFormat("en-AU");
const area = (value: number) => `${value > 0 && value < 0.0001 ? "<0.0001" : areaFormat.format(value)} m²`;

export function Flooring() {
  const [draft, setDraft] = useState(flooringExample);
  let result: ReturnType<typeof calculateFlooring> | undefined;
  let error = "";
  try {
    result = calculateFlooring(draft);
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "Check your flooring measurements.";
  }

  return (
    <div className="comparison-tool">
      <p>Replace the example dimensions with your measurements. Split irregular rooms into rectangles and enter each section once. Use one flooring product per calculation.</p>
      <div className="comparison-inputs">
        <section className="flooring-rooms" aria-labelledby="flooring-rooms">
          <h2 id="flooring-rooms">Rooms and sections</h2>
          {draft.rooms.map((room, index) => (
            <fieldset className="comparison-card" key={room.id}>
              <legend>Room or section {index + 1}</legend>
              <div className="energy-scenarios">
                {(["length", "width"] as const).map((key) => (
                  <label className="number-field" key={key}>
                    <span>{key === "length" ? "Length (m)" : "Width (m)"}</span>
                    <div className="input-wrap">
                      <input type="number" inputMode="decimal" min={0.001} max={1000} step={0.001}
                        value={room[key]}
                        onChange={(event) => {
                          const value = event.target.value;
                          setDraft((previous) => ({
                            ...previous,
                            rooms: previous.rooms.map((item) => item.id === room.id ? { ...item, [key]: value } : item),
                          }));
                        }}
                      />
                    </div>
                  </label>
                ))}
              </div>
              <button type="button" className="energy-remove" aria-label={`Remove room or section ${index + 1}`}
                onClick={() => setDraft((previous) => ({ ...previous, rooms: previous.rooms.filter((item) => item.id !== room.id) }))}>
                Remove
              </button>
            </fieldset>
          ))}
          <button type="button" className="button" disabled={draft.rooms.length >= 50} onClick={() => {
            const room = { id: crypto.randomUUID(), length: "", width: "" };
            setDraft((previous) => ({ ...previous, rooms: [...previous.rooms, room] }));
          }}>Add a room or section</button>
        </section>
        <fieldset className="comparison-card">
          <legend>Flooring and waste</legend>
          <p className="comparison-card-note">Use the coverage printed on the pack. Adjust the example waste allowance for cuts, the layout and the product instructions.</p>
          {settings.map(({ key, label, ...limits }) => (
            <label className="number-field" key={key}>
              <span>{label}</span>
              <div className="input-wrap">
                <input type="number" inputMode="decimal" {...limits} value={draft[key]} onChange={(event) => {
                  const value = event.target.value;
                  setDraft((previous) => ({ ...previous, [key]: value }));
                }} />
              </div>
            </label>
          ))}
        </fieldset>
      </div>
      <button className="button" type="button" onClick={() => setDraft(flooringExample)}>Reset example</button>
      {error && <p className="comparison-error" role="status">{error}</p>}
      {result && (
        <section className="comparison-results" aria-labelledby="flooring-results">
          <h2 id="flooring-results">Your flooring estimate</h2>
          <div className="comparison-verdict" aria-live="polite">
            <div><span>Whole packs to buy</span><strong>{packFormat.format(result.packs)}</strong></div>
            <div><span>Flooring packs total (AUD)</span><strong>
              ${packFormat.format(result.costCents / 100n)}.{String(result.costCents % 100n).padStart(2, "0")}
            </strong></div>
          </div>
          <div className="comparison-table-wrap">
            <table>
              <thead><tr><th scope="col">Coverage</th><th scope="col">Estimate</th></tr></thead>
              <tbody>
                <tr><th scope="row">Measured floor area</th><td>{area(result.floorArea)}</td></tr>
                <tr><th scope="row">Allowance for cuts and waste</th><td>{area(result.wasteArea)}</td></tr>
                <tr><th scope="row">Floor area with allowance</th><td>{area(result.targetArea)}</td></tr>
                <tr><th scope="row">Coverage from whole packs</th><td>{area(result.purchasedArea)}</td></tr>
                <tr><th scope="row">Extra coverage after allowance</th><td>{area(result.leftover)}</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
      <section className="method-section">
        <h2>How we work it out</h2>
        <p>For each room, multiply length by width. Add the areas, apply the waste percentage, divide by the coverage per pack and round up to a whole pack. Multiply the pack count by the entered price for the materials estimate.</p>
        <p>Extra coverage is the amount above your measured area and waste allowance. Usable leftovers depend on the cuts and layout. Budget separately for underlay, trims, delivery and installation.</p>
      </section>
    </div>
  );
}
