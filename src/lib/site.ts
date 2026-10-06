export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aussietools.au';
export const money = (value: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value);
export const percent = (value: number | null) => value === null ? '—' : `${value.toFixed(1)}%`;
