import { australianBusinessData } from '@/data/australia/business';
export type JobProfitInput = {
  quote: number; materials: number; ownHours: number; employeeHours: number;
  ownRate: number; employeeRate: number; distance: number; vehicleRate: number;
  otherExpenses: number; overhead: number; targetMargin: number; extraHours: number;
  quoteIncludesGst: boolean;
};
export const defaultJob: JobProfitInput = {
  quote: 8500, materials: 2300, ownHours: 32, employeeHours: 18,
  ownRate: 65, employeeRate: 42, distance: 240,
  vehicleRate: australianBusinessData.defaults.vehicleCostPerKm,
  otherExpenses: 350, overhead: 0, targetMargin: 30, extraHours: 12, quoteIncludesGst: false
};
export function calculateJobProfit(input: JobProfitInput) {
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'number' && (!Number.isFinite(value) || value < 0)) throw new Error(`Enter a valid non-negative value for ${key}.`);
  }
  if (input.targetMargin >= 100) throw new Error('Target margin must be less than 100%.');
  const revenue = input.quote / (input.quoteIncludesGst ? 1 + australianBusinessData.gstRate : 1);
  const ownLabour = input.ownHours * input.ownRate;
  const employeeLabour = input.employeeHours * input.employeeRate;
  const travel = input.distance * input.vehicleRate;
  const cost = input.materials + ownLabour + employeeLabour + travel + input.otherExpenses + input.overhead;
  const profit = revenue - cost;
  const margin = revenue > 0 ? profit / revenue * 100 : null;
  const minimumQuote = cost / (1 - input.targetMargin / 100);
  const stressedCost = cost + input.extraHours * input.ownRate;
  return {
    revenue, ownLabour, employeeLabour, travel, cost, profit, margin,
    minimumQuote, minimumQuoteIncGst: minimumQuote * (1 + australianBusinessData.gstRate),
    effectiveRate: input.ownHours > 0 ? profit / input.ownHours : null,
    stressedProfit: revenue - stressedCost,
    stressedMargin: revenue > 0 ? (revenue - stressedCost) / revenue * 100 : null,
    status: revenue === 0 ? 'no-revenue' : profit < 0 ? 'loss' : (margin ?? 0) < input.targetMargin ? 'below-target' : 'on-target'
  };
}
