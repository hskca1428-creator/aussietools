import type { Metadata } from "next";
import type { CategorySlug } from "@/tools/registry";

export const siteName = "AussieTools";

export const homeTitle = "AussieTools — Practical tools for Australian life";
export const homeDescription =
  "Simple, transparent tools for real Australian decisions. Calculate job profit, compare your options and make a better call.";

const categoryDescriptions: Record<CategorySlug, string> = {
  money: "Money tools for Australian budgets, bills and everyday costs.",
  work: "Work tools for pay, employment and your next move.",
  business:
    "Business and tradie tools for better quotes and healthier businesses.",
  home: "Home tools for energy, renovations and household life.",
  "cars-travel": "Cars and travel tools for the real cost of getting there.",
  "caravan-camping":
    "Caravan and camping tools to plan your load and your next adventure.",
};

export function categoryDescription(slug: CategorySlug) {
  return categoryDescriptions[slug];
}

type PageMetadataInput = {
  title: string;
  description: string;
  /** App path, starting with `/`. Resolved against `metadataBase`. */
  path: string;
  /** Use the title as written, without the `| AussieTools` template. */
  absoluteTitle?: boolean;
  noIndex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const socialTitle = absoluteTitle ? title : `${title} | ${siteName}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName,
      locale: "en_AU",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
