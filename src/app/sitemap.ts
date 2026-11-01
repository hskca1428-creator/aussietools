import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { categories, tools, toolPath } from "@/tools/registry";

/**
 * Dates are the last meaningful revision of that page's own content,
 * not one stamp applied to the whole site.
 * Homepage and categories follow the directory update on 8 October 2026.
 * Privacy and terms state 9 October 2026 on the page.
 * Guides and the disclaimer were last revised on 6 October 2026.
 * Live tools use `tool.lastUpdated`.
 */
const staticLastModified: Record<string, string> = {
  "/": "2026-10-08",
  "/about": "2026-10-08",
  "/guides": "2026-10-06",
  "/guides/how-to-calculate-job-profit": "2026-10-06",
  "/privacy": "2026-10-09",
  "/terms": "2026-10-09",
  "/disclaimer": "2026-10-06",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryPaths = categories.map((category) => `/${category.slug}`);
  const liveToolPaths = tools
    .filter((tool) => tool.status === "live")
    .map(toolPath);
  const paths = [
    ...Object.keys(staticLastModified),
    ...categoryPaths,
    ...liveToolPaths,
  ];

  return paths.map((path) => {
    const tool = tools.find((item) => toolPath(item) === path);
    return {
      url: absoluteUrl(path),
      lastModified:
        tool?.lastUpdated || staticLastModified[path] || "2026-10-08",
      changeFrequency: "monthly",
      priority: path === "/" ? 1 : 0.7,
    };
  });
}
