#!/usr/bin/env node
import { cp, mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const manifest = JSON.parse(await readFile(path.join(root, "public", "manifest.json"), "utf8"));

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(root, "public"), dist, { recursive: true });

for (const page of manifest.pages) {
  await cp(path.join(root, "pages", page.id, "source"), path.join(dist, "pages", page.id), { recursive: true });
}

console.log("Built Cloudflare Worker assets in dist/");
