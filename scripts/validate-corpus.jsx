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
  await exists(path.join(root, "src", "data", "source-backed-pages.js")),
  "src/data/source-backed-pages.js is missing; run npm run generate",
);

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
assert(manifest.corpus === "landing-page-source-inspirations", "manifest corpus mismatch");
assert(manifest.runtime === "vite-react-tailwind-worker", "manifest runtime mismatch");
assert(manifest.batch === "paulledemon-vite-20", `unexpected manifest batch ${manifest.batch}`);
assert(manifest.count === 20, `expected count 20, found ${manifest.count}`);
assert(manifest.pages.length === 20, `expected 20 pages, found ${manifest.pages.length}`);

const ids = new Set();
const htmlHashes = new Set();
const verticals = new Set();
const pageTypes = new Set();

for (const page of manifest.pages) {
  assert(!ids.has(page.id), `duplicate page id ${page.id}`);
  ids.add(page.id);
  verticals.add(page.vertical);
  pageTypes.add(page.pageType);

  assert(page.route === `/pages/${page.id}/`, `route mismatch for ${page.id}`);
  assert(page.status === "source-backed", `status mismatch for ${page.id}`);
  assert(page.deployMode === "vendored-static-html", `deploy mode mismatch for ${page.id}`);
  assert(page.source?.repoUrl === "https://github.com/PaulleDemon/awesome-landing-pages", `source repo mismatch for ${page.id}`);
  assert(page.source?.license === "MIT", `license mismatch for ${page.id}`);
  assert(page.source?.usageMode === "copied", `usage mode mismatch for ${page.id}`);

  const vendorRoot = path.join(root, page.source.vendorPath);
  assert(await exists(vendorRoot), `missing vendored source path for ${page.id}`);
  assert(await exists(path.join(vendorRoot, "index.html")), `missing vendored index.html for ${page.id}`);

  const pageRoot = path.join(root, "pages", page.id);
  assert(await exists(path.join(pageRoot, "page.json")), `missing page.json for ${page.id}`);
  assert(await exists(path.join(pageRoot, "license-notes.md")), `missing license notes for ${page.id}`);

  const publicRoot = path.join(root, "public", "pages", page.id);
  const publicIndex = path.join(publicRoot, "index.html");
  assert(await exists(publicIndex), `missing static public index.html for ${page.id}`);
  assert(await exists(path.join(publicRoot, "architect-preview.svg")), `missing preview svg for ${page.id}`);

  const html = await readFile(publicIndex, "utf8");
  htmlHashes.add(hash(html));
  assert(html.includes(`<base href="/pages/${page.id}/">`), `missing base tag for ${page.id}`);
  assert(html.includes(`name="architect-corpus-id" content="${page.id}"`), `missing corpus marker for ${page.id}`);
  assert(html.includes("PaulleDemon/awesome-landing-pages"), `missing source repo marker for ${page.id}`);
  assert(!html.includes("googletagmanager.com/gtag/js?id=G-"), `placeholder gtag script still present for ${page.id}`);
}

const rootRendered = renderToStaticMarkup(<App pathname="/" />);
assert(rootRendered.includes("20 source-backed Vite landing-page inspirations"), "root index heading missing");
assert(rootRendered.includes("/manifest.json"), "root index manifest link missing");

assert(htmlHashes.size === 20, `expected 20 unique static HTML pages, found ${htmlHashes.size}`);
assert(verticals.size >= 10, `expected at least 10 verticals, found ${verticals.size}`);
assert(pageTypes.size >= 8, `expected at least 8 page types, found ${pageTypes.size}`);

console.log("Vendored static HTML source corpus validation passed");
