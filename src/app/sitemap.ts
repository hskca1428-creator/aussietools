import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { categories, tools, toolPath } from "@/tools/registry";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/about",
    "/guides",
    "/guides/how-to-calculate-job-profit",
    "/privacy",
    "/terms",
    "/disclaimer",
    ...categories.map((c) => `/${c.slug}`),
    ...tools.filter((t) => t.status === "live").map(toolPath),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified:
      tools.find((tool) => toolPath(tool) === path)?.lastUpdated ||
      "2026-10-08",
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
