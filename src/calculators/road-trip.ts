export const roadTripExample = {
  distance: 1200,
  consumption: 8,
  fuelPrice: 1.90,
  days: 5,
  nights: 4,
  nightlyRate: 120,
  travellers: 2,
  food: 35,
  tolls: 20,
  activities: 100,
  other: 50,
  wear: 0,
  reserve: 10,
};

type RoadTripInputs = typeof roadTripExample;

export function calculateRoadTrip(input: RoadTripInputs) {
  const values = Object.values(input);
  if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 1_000_000)) {
    throw new Error("Enter a number between 0 and 1,000,000 in each field.");
  }
  if (!Number.isInteger(input.days) || input.days < 1 ||
      !Number.isInteger(input.travellers) || input.travellers < 1 ||
      !Number.isInteger(input.nights) || input.nights > input.days) {
    throw new Error("Enter at least one day and traveller, and use whole numbers for days, nights and travellers. Nights cannot exceed trip days.");
  }
  if (input.reserve > 100) throw new Error("Enter a contingency between 0% and 100%.");

  const litres = input.distance * input.consumption / 100;
  const costs = {
    fuel: litres * input.fuelPrice,
    accommodation: input.nights * input.nightlyRate,
    food: input.days * input.travellers * input.food,
    tolls: input.tolls,
    activities: input.activities,
    other: input.other,
  };
  const cashCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  const contingency = cashCost * input.reserve / 100;
  const cashBudget = cashCost + contingency;
  const vehicleWear = input.distance * input.wear;
  return {
    litres, costs, cashCost, contingency, cashBudget, vehicleWear,
    total: cashBudget + vehicleWear,
    perTraveller: cashBudget / input.travellers,
    perDay: cashBudget / input.days,
  };
}
