import test from "node:test";
import assert from "node:assert/strict";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";
import { absoluteUrl, resolveSiteUrl } from "../src/lib/site";
import { categories, toolPath, tools } from "../src/tools/registry";

const origin = "https://www.aussietools.au";

test("the primary origin is www, and the apex is rewritten to it", () => {
  assert.equal(resolveSiteUrl(undefined), origin);
  assert.equal(resolveSiteUrl(""), origin);
  assert.equal(resolveSiteUrl("https://aussietools.au"), origin);
  assert.equal(resolveSiteUrl("https://aussietools.au/"), origin);
  assert.equal(resolveSiteUrl("http://www.aussietools.au"), origin);
  assert.equal(resolveSiteUrl("not a url"), origin);
  assert.equal(
    resolveSiteUrl("https://aussietools-git-preview.vercel.app"),
    "https://aussietools-git-preview.vercel.app",
  );
});

test("absolute homepage URL matches the canonical origin", () => {
  assert.equal(absoluteUrl("/"), origin);
  assert.equal(absoluteUrl("/about"), `${origin}/about`);
});

test("sitemap and robots use www and cover indexable routes only", () => {
  assert.equal(robots().sitemap, `${origin}/sitemap.xml`);
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);
  const dates = new Set(entries.map((entry) => entry.lastModified));

  assert.equal(urls[0], origin);
  for (const url of urls) {
    assert.equal(url.startsWith(`${origin}/`) || url === origin, true);
    assert.equal(url.includes("://aussietools.au"), false);
  }
  assert.ok(dates.size > 1);

  for (const path of [
    "/about",
    "/guides",
    "/guides/how-to-calculate-job-profit",
    "/money",
    "/work",
    "/business",
    "/privacy",
    "/terms",
    "/disclaimer",
  ]) {
    assert.ok(urls.includes(`${origin}${path}`), path);
  }
  for (const category of categories) {
    assert.ok(urls.includes(`${origin}/${category.slug}`));
  }
  for (const tool of tools) {
    const url = `${origin}${toolPath(tool)}`;
    assert.equal(urls.includes(url), tool.status === "live", tool.slug);
  }
  assert.equal(
    entries.find((entry) => entry.url === `${origin}/privacy`)?.lastModified,
    "2026-10-09",
  );
  assert.equal(
    entries.find((entry) => entry.url === `${origin}/guides`)?.lastModified,
    "2026-10-06",
  );
});
