#!/usr/bin/env node
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const expectedTemplates = [
  ["pixa-ai", "Pixa AI", "src/saas/pixaai"],
  ["saasy-dark", "SaaSy Dark", "src/saas/SaaSyDark"],
  ["saas-ai", "SaaS AI", "src/saas/SaaS-AI"],
  ["finance-saas", "Finance SaaS", "src/saas/finance"],
  ["celestial-saas", "Celestial SaaS", "src/saas/CelestialSaaS"],
  ["ai-sales-app", "AI Sales App", "src/apps/AISales"],
  ["chat-origin", "Chat Origin", "src/apps/chatorigin"],
  ["navigator", "Navigator", "src/apps/navigator"],
  ["traveler", "Traveler", "src/apps/traveler"],
  ["law-fire", "Law Fire", "src/law/lawfire"],
  ["law-group", "Law Group", "src/law/lawgroup"],
  ["brick-property", "Brick Property", "src/realestate/brickproperty"],
  ["project-africa", "Project Africa", "src/ngo/project-africa"],
  ["bistro-restaurant", "Bistro Restaurant", "src/restaurant/bistro"],
  ["nutrio-restaurant", "Nutrio Restaurant", "src/restaurant/nutrio"],
  ["car-wash", "Car Wash", "src/others/carwash"],
  ["jamie-developer", "Jamie Developer", "src/portfolio/Jamie-portfolio"],
  ["jrdev-portfolio", "JrDev Portfolio", "src/portfolio/jrdev"],
  ["bella-youtuber", "Bella Youtuber", "src/portfolio/bella"],
  ["notion-portfolio", "Notion Themed Portfolio", "src/portfolio/notion"],
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const sourceRoot = path.join(root, "vendor", "paulledemon-awesome-landing-pages", "source");
assert(await exists(sourceRoot), "missing vendored PaulleDemon source repo");
assert(await exists(path.join(root, "vendor", "paulledemon-awesome-landing-pages", "SOURCE.md")), "missing PaulleDemon SOURCE.md");

const manifestPath = path.join(root, "public", "manifest.paulledemon-vite-20.json");
assert(await exists(manifestPath), "missing public/manifest.paulledemon-vite-20.json; run npm run generate");

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
assert(manifest.batch === "paulledemon-vite-20", `unexpected batch ${manifest.batch}`);
assert(manifest.runtime === "vite-react-tailwind-worker", `unexpected runtime ${manifest.runtime}`);
assert(manifest.count === 20, `expected manifest count 20, found ${manifest.count}`);
assert(manifest.pages.length === 20, `expected 20 pages, found ${manifest.pages.length}`);

const ids = new Set(manifest.pages.map((page) => page.id));
assert(ids.size === 20, "expected 20 unique page ids");

for (const [slug, title, sourcePath] of expectedTemplates) {
  assert(ids.has(slug), `missing manifest page ${slug}`);
  const page = manifest.pages.find((candidate) => candidate.id === slug);
  assert(page.title === title, `title mismatch for ${slug}`);
  assert(page.route === `/pages/${slug}/`, `route mismatch for ${slug}`);
  assert(page.status === "source-backed", `status mismatch for ${slug}`);
  assert(page.deployMode === "vite-react-route", `deploy mode mismatch for ${slug}`);
  assert(page.source.repoUrl === "https://github.com/PaulleDemon/awesome-landing-pages", `repo URL mismatch for ${slug}`);
  assert(page.source.sourcePath === sourcePath, `source path mismatch for ${slug}`);
  assert(page.source.license === "MIT", `license mismatch for ${slug}`);
  assert(page.source.usageMode === "adapted", `usage mode mismatch for ${slug}`);
  assert(await exists(path.join(sourceRoot, sourcePath)), `missing vendored source folder ${sourcePath}`);
  assert(page.previewImagePath === `/pages/${slug}/assets/hero.svg`, `preview path mismatch for ${slug}`);
}

console.log("PaulleDemon Vite batch validation passed");
