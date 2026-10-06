import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateJobProfit, defaultJob } from '../src/calculators/job-profit';
test('costs reconcile and owner labour is counted before profit', () => { const r = calculateJobProfit(defaultJob); assert.equal(r.cost, 5678); assert.equal(r.profit, 2822); assert.ok(Math.abs(r.margin! - 33.2) < 0.01); assert.equal(r.effectiveRate, 88.1875); assert.equal(r.stressedProfit, 2042); assert.equal(r.minimumQuote, 5678 / 0.7); });
test('GST-inclusive quote is normalised without changing ex-GST costs', () => { const r = calculateJobProfit({ ...defaultJob, quote: 9350, quoteIncludesGst: true }); assert.ok(Math.abs(r.revenue - 8500) < 1e-9); assert.equal(r.cost, 5678); });
test('zero quote and zero hours avoid misleading infinite rates', () => { const r = calculateJobProfit({ ...defaultJob, quote: 0, ownHours: 0 }); assert.equal(r.margin, null); assert.equal(r.effectiveRate, null); assert.equal(r.status, 'no-revenue'); });
test('loss and below-target scenarios are flagged', () => { assert.equal(calculateJobProfit({ ...defaultJob, quote: 4000 }).status, 'loss'); assert.equal(calculateJobProfit({ ...defaultJob, quote: 6000 }).status, 'below-target'); });
test('invalid and impossible inputs are rejected', () => { for (const input of [{ ...defaultJob, quote: NaN }, { ...defaultJob, materials: -1 }, { ...defaultJob, targetMargin: 100 }]) assert.throws(() => calculateJobProfit(input)); });
