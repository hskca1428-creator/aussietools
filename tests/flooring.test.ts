import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateFlooring, flooringExample } from "../src/calculators/flooring";

test("adds room areas, allows for waste and prices whole packs", () => {
  const result = calculateFlooring(flooringExample);
  assert.deepEqual(result, {
    floorArea: 25.02,
    wasteArea: 2.502,
    targetArea: 27.522,
    packs: 13n,
    purchasedArea: 28.6,
    leftover: 1.078,
    costCents: 77870n,
  });
});

test("exact pack boundaries stay exact and a small shortfall needs another pack", () => {
  const input = {
    ...flooringExample,
    rooms: [{ id: "1", length: "0.3", width: "0.1" }],
    wastePercent: "0",
    packCoverage: "0.01",
  };
  assert.equal(calculateFlooring(input).packs, 3n);
  assert.equal(calculateFlooring({ ...input, wastePercent: "0.01" }).packs, 4n);
  assert.equal(calculateFlooring({ ...input, packPrice: "0" }).costCents, 0n);
});

test("rejects missing measurements and invalid pack settings", () => {
  for (const patch of [{ rooms: [] }, { packCoverage: "0" }, { packPrice: "2.003" }, { wastePercent: "101" }]) {
    assert.throws(() => calculateFlooring({ ...flooringExample, ...patch }));
  }
  assert.throws(() => calculateFlooring({ ...flooringExample, rooms: [{ id: "1", length: "", width: "5" }] }));
});
