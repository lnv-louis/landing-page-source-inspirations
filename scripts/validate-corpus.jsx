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
assert(manifest.batch === "source-backed-landing-pages-30", `unexpected manifest batch ${manifest.batch}`);
assert(manifest.count === 30, `expected count 30, found ${manifest.count}`);
assert(manifest.pages.length === 30, `expected 30 pages, found ${manifest.pages.length}`);
assert(manifest.batches.includes("paulledemon-vite-20"), "missing PaulleDemon batch");
assert(manifest.batches.includes("bcms-astro-starters-10"), "missing BCMS batch");

const ids = new Set();
const htmlHashes = new Set();
const verticals = new Set();
const pageTypes = new Set();
const repos = new Set();

for (const page of manifest.pages) {
  assert(!ids.has(page.id), `duplicate page id ${page.id}`);
  ids.add(page.id);
  verticals.add(page.vertical);
  pageTypes.add(page.pageType);
  repos.add(page.source.repoUrl);

  assert(page.route === `/pages/${page.id}/`, `route mismatch for ${page.id}`);
  assert(page.status === "source-backed", `status mismatch for ${page.id}`);
  assert(["vendored-static-html", "stored-starter-source"].includes(page.deployMode), `deploy mode mismatch for ${page.id}`);
  assert(
    ["https://github.com/PaulleDemon/awesome-landing-pages", "https://github.com/bcms/starters"].includes(page.source?.repoUrl),
    `source repo mismatch for ${page.id}`,
  );
  assert(["copied", "stored-source"].includes(page.source?.usageMode), `usage mode mismatch for ${page.id}`);

  const vendorRoot = path.join(root, page.source.vendorPath);
  assert(await exists(vendorRoot), `missing vendored source path for ${page.id}`);
  if (page.deployMode === "vendored-static-html") {
    assert(await exists(path.join(vendorRoot, "index.html")), `missing vendored index.html for ${page.id}`);
  } else {
    assert(await exists(path.join(vendorRoot, "package.json")), `missing vendored package.json for ${page.id}`);
  }

  const pageRoot = path.join(root, "pages", page.id);
  assert(await exists(path.join(pageRoot, "page.json")), `missing page.json for ${page.id}`);
  assert(await exists(path.join(pageRoot, "license-notes.md")), `missing license notes for ${page.id}`);

  const publicRoot = path.join(root, "public", "pages", page.id);
  const publicIndex = path.join(publicRoot, "index.html");
  assert(await exists(publicIndex), `missing static public index.html for ${page.id}`);
  assert(await exists(path.join(publicRoot, "architect-preview.svg")), `missing preview svg for ${page.id}`);
  assert(await exists(path.join(root, "public", page.previewImagePath.replace(/^\//, ""))), `missing preview image for ${page.id}`);

  const html = await readFile(publicIndex, "utf8");
  htmlHashes.add(hash(html));
  assert(html.includes(`name="architect-corpus-id" content="${page.id}"`), `missing corpus marker for ${page.id}`);
  assert(html.includes(page.source.repoUrl.replace("https://github.com/", "")), `missing source repo marker for ${page.id}`);
  if (page.deployMode === "vendored-static-html") {
    assert(html.includes(`<base href="/pages/${page.id}/">`), `missing base tag for ${page.id}`);
    assert(html.includes('href="./css/tailwind-build.css"'), `missing local Tailwind build CSS for ${page.id}`);
    assert(!html.includes("tailwind-runtime.css"), `tailwind runtime link still present for ${page.id}`);
  }
  assert(!html.includes("googletagmanager.com/gtag/js?id=G-"), `placeholder gtag script still present for ${page.id}`);
  assert(!/<script\b[^>]*\bsrc=["']https?:\/\//i.test(html), `external script still present for ${page.id}`);
  assert(!/<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']https?:\/\//i.test(html), `external stylesheet still present for ${page.id}`);
  assert(html.includes('id="source-interactions"'), `missing interaction fixtures for ${page.id}`);
  assert((html.match(/data-corpus-event=/g) ?? []).length >= 18, `expected at least 18 corpus events for ${page.id}`);
  assert((html.match(/data-canonical-action=/g) ?? []).length >= 18, `expected at least 18 canonical actions for ${page.id}`);
  assert(html.includes('data-canonical-action="submit_form"'), `missing submit form action for ${page.id}`);
  assert(html.includes('role="tablist"'), `missing tablist for ${page.id}`);
  assert(html.includes("<details"), `missing details disclosure for ${page.id}`);
}

const rootRendered = renderToStaticMarkup(<App pathname="/" />);
assert(rootRendered.includes("30 source-backed landing-page inspirations"), "root index heading missing");
assert(rootRendered.includes("/manifest.json"), "root index manifest link missing");

assert(htmlHashes.size === 30, `expected 30 unique HTML pages, found ${htmlHashes.size}`);
assert(verticals.size >= 10, `expected at least 10 verticals, found ${verticals.size}`);
assert(pageTypes.size >= 8, `expected at least 8 page types, found ${pageTypes.size}`);
assert(repos.size === 2, `expected 2 source repos, found ${repos.size}`);

console.log("Source-backed corpus validation passed");
