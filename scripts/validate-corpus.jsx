#!/usr/bin/env node
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { App } from "../src/App.jsx";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

const manifestPath = path.join(root, "public", "manifest.json");
assert(await exists(manifestPath), "public/manifest.json is missing; run npm run generate");
assert(
  await exists(path.join(root, "src", "data", "generated-pages.js")),
  "src/data/generated-pages.js is missing; run npm run generate",
);

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
assert(manifest.corpus === "landing-page-source-inspirations", "manifest corpus mismatch");
assert(manifest.runtime === "vite-react-tailwind-worker", "manifest runtime mismatch");
assert(manifest.pages.length === 100, `expected 100 pages, found ${manifest.pages.length}`);

const ids = new Set();
const signatures = new Set();
const renderedHashes = new Set();
const verticals = new Set();
const archetypes = new Set();
const layoutFamilies = new Set();
const heroKinds = new Set();
const navKinds = new Set();

for (const page of manifest.pages) {
  assert(!ids.has(page.id), `duplicate page id ${page.id}`);
  ids.add(page.id);
  signatures.add(page.layoutSignature);
  verticals.add(page.vertical);
  archetypes.add(page.archetype);
  layoutFamilies.add(page.layoutFamily);
  heroKinds.add(page.heroKind);
  navKinds.add(page.navKind);
  assert(page.route === `/pages/${page.id}/`, `route mismatch for ${page.id}`);
  assert(page.sourcePath === `src/data/generated-pages.js#${page.id}`, `sourcePath mismatch for ${page.id}`);
  assert(page.localAssets.length >= 3, `expected at least 3 local assets for ${page.id}`);

  const pageRoot = path.join(root, "pages", page.id);
  assert(await exists(path.join(pageRoot, "page.json")), `missing page.json for ${page.id}`);
  assert(await exists(path.join(pageRoot, "license-notes.md")), `missing license notes for ${page.id}`);
  assert(
    !(await exists(path.join(pageRoot, "source", "index.html"))),
    `legacy static source/index.html should not exist for ${page.id}`,
  );

  for (const asset of ["logo.svg", "hero.svg", "product.svg"]) {
    assert(
      await exists(path.join(root, "public", "pages", page.id, "assets", asset)),
      `missing public ${asset} for ${page.id}`,
    );
  }

  const rendered = renderToStaticMarkup(<App pathname={page.route} />);
  renderedHashes.add(hash(rendered));
  assert(rendered.includes('data-root-key="hero"'), `missing hero root key for ${page.id}`);
  assert(rendered.includes('data-root-key="conversion"'), `missing conversion root key for ${page.id}`);
  assert(
    rendered.includes(`/pages/${page.id}/assets/`),
    `missing local asset reference for ${page.id}`,
  );
  assert(rendered.includes(page.company), `missing company name in rendered page for ${page.id}`);
  assert((rendered.match(/data-section-key=/g) ?? []).length >= 3, `expected at least 3 section keys for ${page.id}`);
}

const rootRendered = renderToStaticMarkup(<App pathname="/" />);
assert(rootRendered.includes("100 SaaS landing-page source inspirations"), "root index heading missing");
assert(rootRendered.includes("/manifest.json"), "root index manifest link missing");

assert(signatures.size === 100, `expected 100 unique layout signatures, found ${signatures.size}`);
assert(renderedHashes.size === 100, `expected 100 unique rendered React pages, found ${renderedHashes.size}`);
assert(verticals.size >= 50, `expected at least 50 verticals, found ${verticals.size}`);
assert(archetypes.size >= 20, `expected at least 20 archetypes, found ${archetypes.size}`);
assert(layoutFamilies.size >= 20, `expected at least 20 layout families, found ${layoutFamilies.size}`);
assert(heroKinds.size >= 20, `expected at least 20 hero kinds, found ${heroKinds.size}`);
assert(navKinds.size >= 10, `expected at least 10 nav kinds, found ${navKinds.size}`);

console.log("Landing-page React source corpus validation passed");
