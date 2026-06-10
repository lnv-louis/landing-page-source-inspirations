#!/usr/bin/env node
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl =
  process.env.CORPUS_BASE_URL ?? "https://architect-canon-evals-worker.architect-analytics-eval.workers.dev";
const generatedAt = process.env.CORPUS_GENERATED_AT ?? "2026-06-09T00:00:00.000Z";

const paulledemonSource = {
  batch: "paulledemon-vite-20",
  repoUrl: "https://github.com/PaulleDemon/awesome-landing-pages",
  sourceCommit: "e98eb80c593b8cd28d1f39556ccdda160a932581",
  vendorRoot: "vendor/paulledemon-awesome-landing-pages/source",
  license: "MIT",
};

const awesomeLandingPageSource = {
  batch: "awesome-landing-page-tech-6",
  repoUrl: "https://github.com/nordicgiant2/awesome-landing-page",
  sourceCommit: "d98ff2a3e26e99004baf3e035d970c4c4ac3f191",
  vendorRoot: "vendor/awesome-landing-page-sources",
  license: "varies-by-linked-repo",
};

const paulledemonTemplates = [
  { id: "pixa-ai", title: "Pixa AI", sourcePath: "src/saas/pixaai", vertical: "ai-saas", pageType: "home", tags: ["saas", "ai"] },
  { id: "saasy-dark", title: "SaaSy Dark", sourcePath: "src/saas/SaaSyDark", vertical: "saas", pageType: "home", tags: ["saas", "dark"] },
  { id: "saas-ai", title: "SaaS AI", sourcePath: "src/saas/SaaS-AI", vertical: "ai-saas", pageType: "product", tags: ["saas", "ai"] },
  { id: "finance-saas", title: "Finance SaaS", sourcePath: "src/saas/finance", vertical: "fintech-saas", pageType: "pricing", tags: ["saas", "finance"] },
  { id: "celestial-saas", title: "Celestial SaaS", sourcePath: "src/saas/CelestialSaaS", vertical: "saas", pageType: "home", tags: ["saas"] },
  { id: "ai-sales-app", title: "AI Sales App", sourcePath: "src/apps/AISales", vertical: "gtm-ai", pageType: "product", tags: ["app", "ai", "sales"] },
  { id: "chat-origin", title: "Chat Origin", sourcePath: "src/apps/chatorigin", vertical: "chat-app", pageType: "demo", tags: ["app", "chat"] },
  { id: "navigator", title: "Navigator", sourcePath: "src/apps/navigator", vertical: "productivity-app", pageType: "home", tags: ["app"] },
  { id: "traveler", title: "Traveler", sourcePath: "src/apps/traveler", vertical: "travel-app", pageType: "home", tags: ["app", "travel"] },
  { id: "law-fire", title: "Law Fire", sourcePath: "src/law/lawfire", vertical: "legal-services", pageType: "services", tags: ["law"] },
  { id: "law-group", title: "Law Group", sourcePath: "src/law/lawgroup", vertical: "legal-services", pageType: "services", tags: ["law"] },
  { id: "brick-property", title: "Brick Property", sourcePath: "src/realestate/brickproperty", vertical: "real-estate", pageType: "marketplace", tags: ["real-estate"] },
  { id: "project-africa", title: "Project Africa", sourcePath: "src/ngo/project-africa", vertical: "ngo", pageType: "campaign", tags: ["ngo"] },
  { id: "bistro-restaurant", title: "Bistro Restaurant", sourcePath: "src/restaurant/bistro", vertical: "restaurant", pageType: "local-service", tags: ["restaurant"] },
  { id: "nutrio-restaurant", title: "Nutrio Restaurant", sourcePath: "src/restaurant/nutrio", vertical: "restaurant-wellness", pageType: "local-service", tags: ["restaurant", "wellness"] },
  { id: "car-wash", title: "Car Wash", sourcePath: "src/others/carwash", vertical: "local-service", pageType: "services", tags: ["local-service"] },
  { id: "jamie-developer", title: "Jamie Developer", sourcePath: "src/portfolio/Jamie-portfolio", vertical: "portfolio", pageType: "portfolio", tags: ["portfolio", "developer"] },
  { id: "jrdev-portfolio", title: "JrDev Portfolio", sourcePath: "src/portfolio/jrdev", vertical: "portfolio", pageType: "portfolio", tags: ["portfolio", "developer"] },
  { id: "bella-youtuber", title: "Bella Youtuber", sourcePath: "src/portfolio/bella", vertical: "creator", pageType: "portfolio", tags: ["portfolio", "creator"] },
  { id: "notion-portfolio", title: "Notion Themed Portfolio", sourcePath: "src/portfolio/notion", vertical: "portfolio", pageType: "portfolio", tags: ["portfolio", "notion"] },
];

const linkedTechTemplates = [
  {
    id: "technology-saas-dashboard",
    title: "Technology SaaS Dashboard",
    vertical: "saas",
    pageType: "dashboard-landing",
    tags: ["saas", "dashboard", "software"],
    source: {
      repoUrl: "https://github.com/wonderfullandingpage/Technology-LandingPage",
      sourceCommit: "4b5120234122b5fd3c991505ab611fb55f54ce5f",
      sourcePath: "docs",
      sourceUrl: "https://github.com/wonderfullandingpage/Technology-LandingPage/tree/master/docs",
      license: "MIT",
      usageMode: "copied",
      vendorPath: "vendor/awesome-landing-page-sources/technology-landing-page/source",
      staticDir: "docs",
      staticRoot: "docs/index.html",
    },
  },
  {
    id: "scribbler-devtool",
    title: "Scribbler Devtool",
    vertical: "developer-tools",
    pageType: "docs-landing",
    tags: ["devtool", "docs", "software"],
    source: {
      repoUrl: "https://github.com/amiechen/codrops-scribbler",
      sourceCommit: "2bf453dd85103b080e486d795011e9eefe239b7a",
      sourcePath: "index.html",
      sourceUrl: "https://github.com/amiechen/codrops-scribbler",
      license: "Codrops template license",
      usageMode: "copied",
      vendorPath: "vendor/awesome-landing-page-sources/codrops-scribbler/source",
      staticDir: ".",
      staticRoot: "index.html",
    },
  },
  {
    id: "appkit-startup",
    title: "AppKit Startup",
    vertical: "startup-app",
    pageType: "app-landing",
    tags: ["app", "startup", "software"],
    source: {
      repoUrl: "https://github.com/xriley/AppKit-Landing-Theme",
      sourceCommit: "dc524f00008aa9ed0913e9389f472144eb4441b3",
      sourcePath: "index.html",
      sourceUrl: "https://github.com/xriley/AppKit-Landing-Theme",
      license: "Creative Commons Attribution 3.0",
      usageMode: "copied",
      vendorPath: "vendor/awesome-landing-page-sources/appkit-landing-theme/source",
      staticDir: ".",
      staticRoot: "index.html",
    },
  },
  {
    id: "tailwind-saas-landing",
    title: "Tailwind SaaS Landing",
    vertical: "saas",
    pageType: "product-landing",
    tags: ["saas", "tailwind", "software"],
    source: {
      repoUrl: "https://github.com/tailwindtoolbox/Landing-Page",
      sourceCommit: "545f89eb26e0997d7cdd15fe77dda35df73e575a",
      sourcePath: "index.html",
      sourceUrl: "https://github.com/tailwindtoolbox/Landing-Page",
      license: "MIT",
      usageMode: "copied",
      vendorPath: "vendor/awesome-landing-page-sources/tailwindtoolbox-landing-page/source",
      staticDir: ".",
      staticRoot: "index.html",
    },
  },
  {
    id: "new-age-app",
    title: "New Age App",
    vertical: "mobile-app",
    pageType: "app-landing",
    tags: ["app", "software", "startup"],
    source: {
      repoUrl: "https://github.com/StartBootstrap/startbootstrap-new-age",
      sourceCommit: "5f619773a873e44545b9e1e049d6565d3a9e81d7",
      sourcePath: "dist",
      sourceUrl: "https://github.com/StartBootstrap/startbootstrap-new-age/tree/master/dist",
      license: "MIT",
      usageMode: "copied",
      vendorPath: "vendor/awesome-landing-page-sources/startbootstrap-new-age/source",
      staticDir: "dist",
      staticRoot: "dist/index.html",
    },
  },
  {
    id: "coala-devtool",
    title: "coala Devtool",
    vertical: "developer-tools",
    pageType: "project-landing",
    tags: ["devtool", "code-quality", "software"],
    source: {
      repoUrl: "https://github.com/coala/landing-frontend",
      sourceCommit: "88f354e6be4ab4c53bcf34f358bc813464fc0679",
      sourcePath: "index.html",
      sourceUrl: "https://github.com/coala/landing-frontend",
      license: "AGPL-3.0",
      usageMode: "copied",
      vendorPath: "vendor/awesome-landing-page-sources/coala-landing-frontend/source",
      staticDir: ".",
      staticRoot: "index.html",
    },
  },
];

function urlFor(route) {
  return `${baseUrl.replace(/\/+$/g, "")}${route}`;
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildPreviewSvg(page) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="628" viewBox="0 0 1200 628" role="img" aria-label="${esc(page.title)} preview">
  <rect width="1200" height="628" fill="#f8fafc"/>
  <rect x="54" y="54" width="1092" height="520" rx="32" fill="#ffffff" stroke="#dbe3ef" stroke-width="4"/>
  <text x="96" y="142" fill="#0f766e" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="850">${esc(page.vertical)} · ${esc(page.pageType)}</text>
  <text x="96" y="330" fill="#0f172a" font-family="Inter, Arial, sans-serif" font-size="78" font-weight="900">${esc(page.title)}</text>
  <text x="96" y="404" fill="#475569" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="650">Actual vendored source HTML hosted as a clickable website.</text>
  <text x="96" y="500" fill="#64748b" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="650">${esc(page.source.sourcePath)}</text>
</svg>
`;
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function rewriteHtmlForCorpus(htmlPath, page) {
  const original = await readFile(htmlPath, "utf8");
  const marker = `\n<meta name="architect-corpus-id" content="${esc(page.id)}" />\n<meta name="architect-source-repo" content="${esc(page.source.repoUrl)}" />\n<meta name="architect-source-path" content="${esc(page.source.sourcePath)}" />`;
  const withoutPlaceholderAnalytics = original
    .replaceAll(/<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[\s\S]*?<\/script>/g, "")
    .replaceAll(/<script>\s*window\.dataLayer[\s\S]*?gtag\('config', 'G-'\);\s*<\/script>/g, "");
  const cleaned = page.requiresTailwindBuild
    ? withoutPlaceholderAnalytics
        .replaceAll(/<link\b[^>]*\bhref=["'][^"']*tailwind-runtime\.css["'][^>]*>/gi, "")
        .replaceAll(/<!--\s*<link rel="stylesheet" href="\.\/css\/tailwind-build\.css"\s*>\s*-->/gi, "")
        .replace(/<link rel="stylesheet" href="\.\/css\/index\.css"\s*\/?>/i, '<link rel="stylesheet" href="./css/tailwind-build.css" />\n        <link rel="stylesheet" href="./css/index.css" />')
    : withoutPlaceholderAnalytics;
  const withTailwind = !page.requiresTailwindBuild || cleaned.includes('href="./css/tailwind-build.css"')
    ? cleaned
    : cleaned.replace(/<\/head>/i, '<link rel="stylesheet" href="./css/tailwind-build.css" />\n</head>');
  const withBase = withTailwind.includes("<base ")
    ? withTailwind
    : withTailwind.replace(/<head([^>]*)>/i, `<head$1>\n<base href="/pages/${page.id}/">`);
  const withMarker = withBase.replace(/<\/head>/i, `${marker}\n</head>`);
  await writeFile(htmlPath, withMarker);
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(entryPath));
    } else {
      files.push(entryPath);
    }
  }
  return files;
}

async function selectPreviewImage(publicPath, page) {
  const files = await listFiles(publicPath);
  const imageFiles = files
    .filter((file) => /\.(png|jpe?g|webp|svg)$/i.test(file))
    .filter((file) => !file.endsWith("architect-preview.svg"))
    .map((file) => path.relative(publicPath, file).split(path.sep).join("/"));
  const ranked = imageFiles
    .map((file) => {
      const lower = file.toLowerCase();
      let score = 0;
      if (/(^|[-_/])og([._/-]|$)|open-graph/.test(lower)) score += 100;
      if (lower.includes("hero")) score += 90;
      if (lower.includes("dashboard")) score += 80;
      if (lower.includes("thumbnail")) score += 75;
      if (lower.includes("homepage")) score += 70;
      if (lower.includes("screenshot")) score += 65;
      if (lower.includes("home/")) score += 60;
      if (lower.includes("sample")) score += 50;
      if (lower.includes("logged_in/")) score += 45;
      if (lower.includes("headerimage")) score += 45;
      if (lower.includes("figure")) score += 40;
      if (lower.includes("feature")) score += 30;
      if (lower.includes("apple-touch")) score -= 90;
      if (lower.includes("favicon")) score -= 90;
      if (lower.includes("logo")) score -= 50;
      if (lower.includes("badge")) score -= 40;
      if (lower.includes("fontawesome")) score -= 80;
      if (lower.endsWith(".svg")) score -= 10;
      return { file, score };
    })
    .sort((a, b) => b.score - a.score || a.file.localeCompare(b.file));
  return ranked[0] ? `/pages/${page.id}/${ranked[0].file}` : `/pages/${page.id}/architect-preview.svg`;
}

function toPaulledemonPage(template, index) {
  const route = `/pages/${template.id}/`;
  const sourceUrl = `${paulledemonSource.repoUrl}/tree/main/${template.sourcePath}`;
  return {
    ...template,
    number: String(index + 1).padStart(2, "0"),
    route,
    url: urlFor(route),
    status: "source-backed",
    deployMode: "vendored-static-html",
    sourceType: "vendored-upstream-template-static-html",
    licenseStatus: paulledemonSource.license,
    previewImagePath: `${route}architect-preview.svg`,
    requiresTailwindBuild: true,
    source: {
      repoUrl: paulledemonSource.repoUrl,
      sourceCommit: paulledemonSource.sourceCommit,
      sourcePath: template.sourcePath,
      sourceUrl,
      license: paulledemonSource.license,
      usageMode: "copied",
      vendorPath: `${paulledemonSource.vendorRoot}/${template.sourcePath}`,
      staticDir: ".",
      staticRoot: "index.html",
    },
  };
}

function toLinkedTechPage(template, index) {
  const route = `/pages/${template.id}/`;
  return {
    ...template,
    number: String(index + 21).padStart(2, "0"),
    route,
    url: urlFor(route),
    status: "source-backed",
    deployMode: "vendored-static-html",
    sourceType: "vendored-awesome-landing-page-linked-static-html",
    licenseStatus: template.source.license,
    previewImagePath: `${route}architect-preview.svg`,
    requiresTailwindBuild: false,
  };
}

function manifestPage(page) {
  return {
    id: page.id,
    number: page.number,
    title: page.title,
    route: page.route,
    url: page.url,
    sourcePath: page.source.sourcePath,
    metadataPath: `pages/${page.id}/page.json`,
    licensePath: `pages/${page.id}/license-notes.md`,
    previewImage: urlFor(page.previewImagePath),
    previewImagePath: page.previewImagePath,
    vertical: page.vertical,
    pageType: page.pageType,
    tags: page.tags,
    status: page.status,
    deployMode: page.deployMode,
    sourceType: page.sourceType,
    licenseStatus: page.licenseStatus,
    source: page.source,
  };
}

function licenseNotes(page) {
  return `# ${page.title} License Notes

Status: Source-backed static HTML copied from vendored upstream source.

- Source repo: ${page.source.repoUrl}
- Source commit: ${page.source.sourceCommit}
- Source folder: ${page.source.sourcePath}
- Source URL: ${page.source.sourceUrl}
- Vendored path: ${page.source.vendorPath}
- Static root: ${page.source.staticRoot}
- License: ${page.source.license}
- Usage mode: ${page.source.usageMode}
- Deploy mode: ${page.deployMode}

The deployed corpus route at ${page.route} serves actual hostable upstream HTML/assets copied into this Vite/Cloudflare Worker host. No proxy pages or synthetic interaction sections are generated.
`;
}

async function writePage(page) {
  const vendorPath = path.join(root, page.source.vendorPath, page.source.staticDir ?? ".");
  const publicPath = path.join(root, "public", "pages", page.id);
  const metadataPath = path.join(root, "pages", page.id);

  await cp(vendorPath, publicPath, { recursive: true });
  await rewriteHtmlForCorpus(path.join(publicPath, "index.html"), page);
  await writeFile(path.join(publicPath, "architect-preview.svg"), buildPreviewSvg(page));
  page.previewImagePath = await selectPreviewImage(publicPath, page);

  await mkdir(metadataPath, { recursive: true });
  await writeJson(path.join(metadataPath, "page.json"), page);
  await writeFile(path.join(metadataPath, "license-notes.md"), licenseNotes(page));
}

await rm(path.join(root, "pages"), { recursive: true, force: true });
await rm(path.join(root, "public"), { recursive: true, force: true });
await rm(path.join(root, "src", "data", "generated-pages.js"), { force: true });
await mkdir(path.join(root, "pages"), { recursive: true });
await mkdir(path.join(root, "public", "pages"), { recursive: true });
await mkdir(path.join(root, "src", "data"), { recursive: true });

const paulledemonPages = paulledemonTemplates.map(toPaulledemonPage);
const linkedTechPages = linkedTechTemplates.map(toLinkedTechPage);
const pages = [...paulledemonPages, ...linkedTechPages];

for (const page of pages) await writePage(page);

const sources = [paulledemonSource, awesomeLandingPageSource];

await writeFile(
  path.join(root, "src", "data", "source-backed-pages.js"),
  `// Generated by scripts/generate-corpus.mjs. Do not edit by hand.\n` +
    `export const generatedAt = ${JSON.stringify(generatedAt)};\n` +
    `export const batch = ${JSON.stringify("source-backed-saas-tech-26")};\n` +
    `export const sources = ${JSON.stringify(sources, null, 2)};\n` +
    `export const pages = ${JSON.stringify(pages, null, 2)};\n`,
);

const manifest = {
  generatedAt,
  baseUrl,
  corpus: "landing-page-source-inspirations",
  runtime: "vite-react-tailwind-worker",
  batch: "source-backed-saas-tech-26",
  batches: sources.map((source) => source.batch),
  count: pages.length,
  sources,
  pages: pages.map(manifestPage),
};

await writeJson(path.join(root, "public", "manifest.json"), manifest);
await writeJson(path.join(root, "public", "manifest.paulledemon-vite-20.json"), {
  ...manifest,
  batch: paulledemonSource.batch,
  batches: [paulledemonSource.batch],
  count: paulledemonPages.length,
  sources: [paulledemonSource],
  pages: paulledemonPages.map(manifestPage),
});
await writeJson(path.join(root, "public", "manifest.awesome-landing-page-tech-6.json"), {
  ...manifest,
  batch: awesomeLandingPageSource.batch,
  batches: [awesomeLandingPageSource.batch],
  count: linkedTechPages.length,
  sources: [awesomeLandingPageSource],
  pages: linkedTechPages.map(manifestPage),
});

console.log(`Generated ${pages.length} vendored static HTML source pages`);
