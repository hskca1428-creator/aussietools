const primaryOrigin = "https://www.aussietools.au";

/**
 * Origin for canonicals, Open Graph, JSON-LD, the sitemap and robots.txt.
 * The apex host 308-redirects to www, so an apex value is rewritten to the primary host.
 * Any other origin (a preview deployment, for example) is kept.
 */
export function resolveSiteUrl(
  configured = process.env.NEXT_PUBLIC_SITE_URL,
): string {
  const value = configured?.trim();
  if (!value) return primaryOrigin;
  try {
    const url = new URL(value);
    if (url.hostname === "aussietools.au") url.hostname = "www.aussietools.au";
    if (url.hostname === "www.aussietools.au") url.protocol = "https:";
    return url.origin;
  } catch {
    return primaryOrigin;
  }
}

export const siteUrl = resolveSiteUrl();

/** Absolute URL on `siteUrl`. `/` is the origin with no trailing slash, matching the canonical tag. */
export function absoluteUrl(path = "/"): string {
  if (path === "/" || path === "") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const money = (value: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
export const percent = (value: number | null) =>
  value === null ? "—" : `${value.toFixed(1)}%`;
