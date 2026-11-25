import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateRoadTrip, roadTripExample } from "../src/calculators/road-trip";

test("trip costs apply the right unit and keep wear out of the cash split", () => {
  const result = calculateRoadTrip({ ...roadTripExample, wear: 0.1 });
  assert.equal(result.litres, 96);
  assert.equal(result.costs.accommodation, 480);
  assert.equal(result.costs.food, 350);
  assert.equal(result.vehicleWear, 120);
  assert.equal(result.cashBudget.toFixed(2), "1300.64");
  assert.equal(result.perTraveller.toFixed(2), "650.32");
  assert.equal(result.total.toFixed(2), "1420.64");
});

test("day trips support zero paid nights and validate denominators", () => {
  const dayTrip = { ...roadTripExample, nights: 0, days: 1 };
  assert.equal(calculateRoadTrip(dayTrip).costs.accommodation, 0);
  assert.throws(() => calculateRoadTrip({ ...dayTrip, travellers: 0 }));
  assert.throws(() => calculateRoadTrip({ ...dayTrip, nights: 2 }));
  assert.throws(() => calculateRoadTrip({ ...dayTrip, fuelPrice: NaN }));
  assert.throws(() => calculateRoadTrip({ ...dayTrip, reserve: 101 }));
});
