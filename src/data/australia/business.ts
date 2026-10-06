export const australianBusinessData = {
  gstRate: 0.10,
  checkedOn: '2026-10-04',
  sources: [
    { title: 'MoneySmart — GST calculator', url: 'https://moneysmart.gov.au/work-and-tax/gst-calculator', note: '10% GST for taxable sales; GST-inclusive amounts are divided by 1.1 to obtain the exclusive amount.' },
    { title: 'ATO — Calculating GST on purchases', url: 'https://smallbusiness.taxsuperandyou.gov.au/goods-and-services-tax/calculating-gst-on-purchases', note: 'Explains the GST component of an inclusive purchase price.' }
  ],
  // Planning assumptions, not statutory rates or industry benchmarks.
  defaults: { vehicleCostPerKm: 0.80, targetMargin: 30, extraHours: 12 }
} as const;
