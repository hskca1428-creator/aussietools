import test from "node:test";
import assert from "node:assert/strict";
import {
  documentTotals,
  hourlyChargeOut,
  markupAndMargin,
  gstAmounts,
  clientEmail,
} from "../src/calculators/trade-toolkit";

test("documents round each line and GST to cents", () => {
  const result = documentTotals(
    [
      { id: 1, description: "Labour", quantity: 3, rate: 65.55 },
      { id: 2, description: "Materials", quantity: 1, rate: 10.01 },
    ],
    true,
  );
  assert.deepEqual(result, {
    lineTotals: [196.65, 10.01],
    subtotal: 206.66,
    gst: 20.67,
    total: 227.33,
  });
  assert.equal(
    documentTotals(
      [{ id: 1, description: "Job", quantity: 1, rate: 100 }],
      false,
    ).total,
    100,
  );
});
test("charge-out rate accounts for non-billable time and margin", () => {
  const result = hourlyChargeOut(100000, 30000, 30, 48, 20);
  assert.equal(result.billableHours, 1440);
  assert.ok(Math.abs(result.chargeOut - 112.8472222222) < 1e-7);
  assert.throws(() => hourlyChargeOut(100000, 0, 0, 48, 20));
  assert.throws(() => hourlyChargeOut(100000, 0, 30, 48, 100));
});
test("markup is not confused with margin", () => {
  const result = markupAndMargin(1000, 30);
  assert.equal(result.price, 1300);
  assert.ok(Math.abs(result.margin! - 23.0769230769) < 1e-7);
});
test("GST add/remove round trip and invalid inputs", () => {
  assert.deepEqual(gstAmounts(110, true), { exGst: 100, gst: 10, incGst: 110 });
  assert.deepEqual(gstAmounts(100, false), {
    exGst: 100,
    gst: 10,
    incGst: 110,
  });
  assert.throws(() =>
    documentTotals([{ id: 1, description: "", quantity: -1, rate: 10 }], false),
  );
});
test("email drafts keep supplied details and never invent payment facts", () => {
  const text = clientEmail(
    "payment",
    "Sam",
    "Example Plumbing",
    "Tap replacement",
    "Invoice 17: $220, due 8 October.",
    "friendly",
  );
  assert.ok(text.includes("Hi Sam,"));
  assert.ok(text.includes("Invoice 17: $220, due 8 October."));
  assert.ok(!text.includes("overdue"));
});
