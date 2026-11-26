export const flooringExample = {
  rooms: [
    { id: "living", length: "4.2", width: "3.6" },
    { id: "bedroom", length: "3.3", width: "3" },
  ],
  wastePercent: "10",
  packCoverage: "2.2",
  packPrice: "59.90",
};

type FlooringInput = typeof flooringExample;

function fixedDecimal(value: string, places: number, label: string, min: number, max: number) {
  const input = value.trim();
  const format = new RegExp(`^(?:\\d+(?:\\.\\d{0,${places}})?|\\.\\d{1,${places}})$`);
  const amount = Number(input);
  if (!format.test(input) || amount < min || amount > max) {
    throw new Error(`Enter ${label} from ${min} to ${max}, with up to ${places} decimal places.`);
  }
  return BigInt(Math.round(amount * 10 ** places));
}

export function calculateFlooring(input: FlooringInput) {
  if (input.rooms.length === 0) throw new Error("Add at least one room or section.");

  // Millimetres squared give an exact room area. Waste adds four decimal
  // places (hundredths of a percent), so the pack ceiling uses integers.
  const area = input.rooms.reduce((total, room, index) => {
    const length = fixedDecimal(room.length, 3, `room ${index + 1} length (m)`, 0.001, 1000);
    const width = fixedDecimal(room.width, 3, `room ${index + 1} width (m)`, 0.001, 1000);
    return total + length * width;
  }, 0n);
  const waste = fixedDecimal(input.wastePercent, 2, "a waste allowance (%)", 0, 100);
  const coverage = fixedDecimal(input.packCoverage, 4, "pack coverage (m²)", 0.0001, 1000);
  const price = fixedDecimal(input.packPrice, 2, "a pack price (AUD)", 0, 100000);
  const target = area * (10_000n + waste);
  const packArea = coverage * 1_000_000n;
  const packs = (target + packArea - 1n) / packArea;
  const supplied = packs * packArea;
  const squareMetres = 10_000_000_000;

  return {
    floorArea: Number(area) / 1_000_000,
    wasteArea: Number(area * waste) / squareMetres,
    targetArea: Number(target) / squareMetres,
    packs,
    purchasedArea: Number(supplied) / squareMetres,
    leftover: Number(supplied - target) / squareMetres,
    costCents: packs * price,
  };
}
