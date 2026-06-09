#!/usr/bin/env node
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
assert(manifest.corpus === "landing-page-source-inspirations", "manifest corpus mismatch");
assert(manifest.pages.length === 100, `expected 100 pages, found ${manifest.pages.length}`);

const ids = new Set();
const signatures = new Set();
const htmlHashes = new Set();
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
  assert(page.localAssets.length >= 3, `expected at least 3 local assets for ${page.id}`);

  const pageRoot = path.join(root, "pages", page.id);
  const htmlPath = path.join(pageRoot, "source", "index.html");
  assert(await exists(path.join(pageRoot, "page.json")), `missing page.json for ${page.id}`);
  assert(await exists(path.join(pageRoot, "license-notes.md")), `missing license notes for ${page.id}`);
  assert(await exists(htmlPath), `missing source index for ${page.id}`);
  for (const asset of ["logo.svg", "hero.svg", "product.svg"]) {
    assert(await exists(path.join(pageRoot, "source", "assets", asset)), `missing ${asset} for ${page.id}`);
  }
  const html = await readFile(htmlPath, "utf8");
  htmlHashes.add(hash(html));
  assert(html.includes('data-root-key="hero"'), `missing hero root key for ${page.id}`);
  assert(html.includes('data-root-key="conversion"'), `missing conversion root key for ${page.id}`);
  assert(html.includes("assets/hero.svg"), `missing local hero asset reference for ${page.id}`);
  assert(html.includes("assets/logo.svg"), `missing local logo asset reference for ${page.id}`);
  assert((html.match(/<section /g) ?? []).length >= 5, `expected at least 5 sections for ${page.id}`);
}

assert(signatures.size === 100, `expected 100 unique layout signatures, found ${signatures.size}`);
assert(htmlHashes.size === 100, `expected 100 unique HTML documents, found ${htmlHashes.size}`);
assert(verticals.size >= 20, `expected at least 20 verticals, found ${verticals.size}`);
assert(archetypes.size >= 20, `expected at least 20 archetypes, found ${archetypes.size}`);
assert(layoutFamilies.size >= 20, `expected at least 20 layout families, found ${layoutFamilies.size}`);
assert(heroKinds.size >= 20, `expected at least 20 hero kinds, found ${heroKinds.size}`);
assert(navKinds.size >= 10, `expected at least 10 nav kinds, found ${navKinds.size}`);

console.log("Landing-page source corpus validation passed");
