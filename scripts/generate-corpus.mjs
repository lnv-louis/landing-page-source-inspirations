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

const bcmsSource = {
  batch: "bcms-astro-starters-10",
  repoUrl: "https://github.com/bcms/starters",
  sourceCommit: "fef4e1f24043a72418679b3cccc43a9d522f1055",
  vendorRoot: "vendor/bcms-starters/source",
  license: "upstream-repository-license",
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

const bcmsTemplates = [
  { id: "bcms-astro-agency", title: "BCMS Astro Agency", sourcePath: "astro/agency", vertical: "agency", pageType: "starter", tags: ["bcms", "astro", "agency"] },
  { id: "bcms-astro-blog", title: "BCMS Astro Blog", sourcePath: "astro/blog", vertical: "blog", pageType: "starter", tags: ["bcms", "astro", "blog"] },
  { id: "bcms-astro-conference", title: "BCMS Astro Conference", sourcePath: "astro/conference", vertical: "conference", pageType: "starter", tags: ["bcms", "astro", "event"] },
  { id: "bcms-astro-e-commerce", title: "BCMS Astro E-commerce", sourcePath: "astro/e-commerce", vertical: "e-commerce", pageType: "starter", tags: ["bcms", "astro", "commerce"] },
  { id: "bcms-astro-job-board", title: "BCMS Astro Job Board", sourcePath: "astro/job-board", vertical: "job-board", pageType: "starter", tags: ["bcms", "astro", "jobs"] },
  { id: "bcms-astro-personal", title: "BCMS Astro Personal", sourcePath: "astro/personal", vertical: "portfolio", pageType: "starter", tags: ["bcms", "astro", "personal"] },
  { id: "bcms-astro-podcast", title: "BCMS Astro Podcast", sourcePath: "astro/podcast", vertical: "podcast", pageType: "starter", tags: ["bcms", "astro", "podcast"] },
  { id: "bcms-astro-recipes", title: "BCMS Astro Recipes", sourcePath: "astro/recipes", vertical: "recipes", pageType: "starter", tags: ["bcms", "astro", "recipes"] },
  { id: "bcms-astro-restaurant", title: "BCMS Astro Restaurant", sourcePath: "astro/restaurant", vertical: "restaurant", pageType: "starter", tags: ["bcms", "astro", "restaurant"] },
  { id: "bcms-astro-simple-blog", title: "BCMS Astro Simple Blog", sourcePath: "astro/simple-blog", vertical: "blog", pageType: "starter", tags: ["bcms", "astro", "simple-blog"] },
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
  <text x="96" y="404" fill="#475569" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="650">Vendored source-backed corpus page for analytics evaluation.</text>
  <text x="96" y="500" fill="#64748b" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="650">${esc(page.sourcePath)}</text>
</svg>
`;
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function buildInteractionSurface(page) {
  const eventPrefix = page.id.replaceAll("-", "_");
  return `<section id="source-interactions" data-interaction-surface="source-page-fixtures" style="margin:48px auto;max-width:1120px;padding:24px;border:1px solid #dbe3ef;border-radius:24px;background:#f8fafc;color:#0f172a;font-family:Inter,Arial,sans-serif;box-sizing:border-box;">
  <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px;">
    <div><p style="margin:0 0 6px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#0f766e;">Interaction fixtures</p><h2 style="margin:0;font-size:clamp(24px,4vw,42px);line-height:1.05;font-weight:900;">Trackable actions for ${esc(page.title)}</h2><p style="margin:10px 0 0;max-width:720px;color:#475569;line-height:1.6;">Extra buttons, links, forms, tabs, choices, and disclosures so canonical mappings can be attached consistently across sparse source pages.</p></div>
    <a href="/manifest.json" data-corpus-event="${eventPrefix}_manifest_open" data-canonical-action="open_manifest" style="display:inline-flex;min-height:44px;align-items:center;border-radius:999px;background:#0f172a;color:white;padding:0 18px;text-decoration:none;font-weight:800;">Open manifest</a>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:18px;">
    <button type="button" data-corpus-event="${eventPrefix}_primary_cta" data-canonical-action="primary_cta" style="min-height:46px;border:0;border-radius:14px;background:#0f766e;color:white;font-weight:900;cursor:pointer;">Start evaluation</button>
    <button type="button" data-corpus-event="${eventPrefix}_secondary_cta" data-canonical-action="secondary_cta" style="min-height:46px;border:1px solid #cbd5e1;border-radius:14px;background:white;color:#0f172a;font-weight:900;cursor:pointer;">Compare source</button>
    <button type="button" data-corpus-event="${eventPrefix}_demo_toggle" data-canonical-action="toggle_demo" aria-pressed="false" onclick="this.setAttribute('aria-pressed', this.getAttribute('aria-pressed') === 'true' ? 'false' : 'true')" style="min-height:46px;border:1px solid #cbd5e1;border-radius:14px;background:white;color:#0f172a;font-weight:900;cursor:pointer;">Toggle demo</button>
    <button type="button" data-corpus-event="${eventPrefix}_copy_source" data-canonical-action="copy_source" onclick="navigator.clipboard && navigator.clipboard.writeText('${esc(page.source.sourceUrl)}')" style="min-height:46px;border:1px solid #cbd5e1;border-radius:14px;background:white;color:#0f172a;font-weight:900;cursor:pointer;">Copy source URL</button>
  </div>
  <form data-corpus-event="${eventPrefix}_lead_form" data-canonical-action="lead_form_submit" onsubmit="event.preventDefault(); this.dataset.submitted = 'true';" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:18px;">
    <label style="display:grid;gap:6px;font-size:13px;font-weight:800;">Work email<input name="email" type="email" placeholder="name@company.com" data-corpus-event="${eventPrefix}_email_input" data-canonical-action="email_input" style="min-height:42px;border:1px solid #cbd5e1;border-radius:12px;padding:0 12px;" /></label>
    <label style="display:grid;gap:6px;font-size:13px;font-weight:800;">Company size<select name="company_size" data-corpus-event="${eventPrefix}_company_size_select" data-canonical-action="company_size_select" style="min-height:42px;border:1px solid #cbd5e1;border-radius:12px;padding:0 12px;background:white;"><option>1-50</option><option>51-250</option><option>251-1000</option><option>1000+</option></select></label>
    <label style="display:grid;gap:6px;font-size:13px;font-weight:800;">Use case<input name="use_case" placeholder="Analytics mapping" data-corpus-event="${eventPrefix}_use_case_input" data-canonical-action="use_case_input" style="min-height:42px;border:1px solid #cbd5e1;border-radius:12px;padding:0 12px;" /></label>
    <button type="submit" data-corpus-event="${eventPrefix}_form_submit" data-canonical-action="submit_form" style="align-self:end;min-height:44px;border:0;border-radius:12px;background:#0f172a;color:white;font-weight:900;cursor:pointer;">Submit</button>
  </form>
  <fieldset style="display:flex;flex-wrap:wrap;gap:12px;margin:0 0 18px;padding:14px;border:1px solid #dbe3ef;border-radius:14px;background:white;"><legend style="font-weight:900;">Plan options</legend>
    <label><input type="radio" name="plan_${eventPrefix}" data-corpus-event="${eventPrefix}_plan_free" data-canonical-action="choose_free_plan" /> Free</label>
    <label><input type="radio" name="plan_${eventPrefix}" data-corpus-event="${eventPrefix}_plan_growth" data-canonical-action="choose_growth_plan" /> Growth</label>
    <label><input type="checkbox" data-corpus-event="${eventPrefix}_newsletter" data-canonical-action="toggle_newsletter" /> Newsletter</label>
    <label><input type="checkbox" data-corpus-event="${eventPrefix}_demo_request" data-canonical-action="toggle_demo_request" /> Request demo</label>
  </fieldset>
  <div role="tablist" aria-label="Interaction segments" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">
    <button type="button" role="tab" aria-selected="true" data-corpus-event="${eventPrefix}_tab_overview" data-canonical-action="select_overview_tab" style="min-height:40px;border:1px solid #99f6e4;border-radius:999px;background:#ccfbf1;color:#115e59;padding:0 14px;font-weight:800;cursor:pointer;">Overview</button>
    <button type="button" role="tab" aria-selected="false" data-corpus-event="${eventPrefix}_tab_pricing" data-canonical-action="select_pricing_tab" style="min-height:40px;border:1px solid #cbd5e1;border-radius:999px;background:white;color:#0f172a;padding:0 14px;font-weight:800;cursor:pointer;">Pricing</button>
    <button type="button" role="tab" aria-selected="false" data-corpus-event="${eventPrefix}_tab_docs" data-canonical-action="select_docs_tab" style="min-height:40px;border:1px solid #cbd5e1;border-radius:999px;background:white;color:#0f172a;padding:0 14px;font-weight:800;cursor:pointer;">Docs</button>
    <button type="button" role="tab" aria-selected="false" data-corpus-event="${eventPrefix}_tab_security" data-canonical-action="select_security_tab" style="min-height:40px;border:1px solid #cbd5e1;border-radius:999px;background:white;color:#0f172a;padding:0 14px;font-weight:800;cursor:pointer;">Security</button>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;">
    <details data-corpus-event="${eventPrefix}_faq_source" data-canonical-action="expand_source_faq" style="border:1px solid #cbd5e1;border-radius:14px;background:white;padding:14px;"><summary style="cursor:pointer;font-weight:900;">Where is the source?</summary><p style="color:#475569;line-height:1.6;">${esc(page.source.sourcePath)}</p></details>
    <details data-corpus-event="${eventPrefix}_faq_license" data-canonical-action="expand_license_faq" style="border:1px solid #cbd5e1;border-radius:14px;background:white;padding:14px;"><summary style="cursor:pointer;font-weight:900;">What is the license?</summary><p style="color:#475569;line-height:1.6;">${esc(page.source.license)} copied from the vendored upstream folder.</p></details>
    <a href="${esc(page.source.sourceUrl)}" data-corpus-event="${eventPrefix}_source_link" data-canonical-action="open_source_repo" style="display:block;border:1px solid #cbd5e1;border-radius:14px;background:white;padding:14px;color:#0f172a;text-decoration:none;font-weight:900;">Open upstream source ↗</a>
  </div>
</section>`;
}

async function rewriteHtmlForCorpus(htmlPath, page) {
  const original = await readFile(htmlPath, "utf8");
  const marker = `\n<meta name="architect-corpus-id" content="${esc(page.id)}" />\n<meta name="architect-source-repo" content="${esc(page.source.repoUrl)}" />\n<meta name="architect-source-path" content="${esc(page.sourcePath)}" />`;
  const cleaned = original
    .replaceAll(/<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[\s\S]*?<\/script>/g, "")
    .replaceAll(/<script>\s*window\.dataLayer[\s\S]*?gtag\('config', 'G-'\);\s*<\/script>/g, "")
    .replaceAll(/<script\b[^>]*\bsrc=["']https?:\/\/[^"']+["'][^>]*><\/script>/gi, "")
    .replaceAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']https?:\/\/[^"']+["'][^>]*>/gi, "")
    .replaceAll(/<link\b[^>]*\bhref=["'][^"']*tailwind-runtime\.css["'][^>]*>/gi, "")
    .replaceAll(/<!--\s*<link rel="stylesheet" href="\.\/css\/tailwind-build\.css"\s*>\s*-->/gi, "")
    .replace(/<link rel="stylesheet" href="\.\/css\/index\.css"\s*\/?>/i, '<link rel="stylesheet" href="./css/tailwind-build.css" />\n        <link rel="stylesheet" href="./css/index.css" />');
  const withTailwind = cleaned.includes('href="./css/tailwind-build.css"')
    ? cleaned
    : cleaned.replace(/<\/head>/i, '<link rel="stylesheet" href="./css/tailwind-build.css" />\n</head>');
  const withBase = withTailwind.includes("<base ")
    ? withTailwind
    : withTailwind.replace(/<head([^>]*)>/i, `<head$1>\n<base href="/pages/${page.id}/">`);
  const withMarker = withBase.replace(/<\/head>/i, `${marker}\n</head>`);
  const interactions = buildInteractionSurface(page);
  const withInteractions = /<\/body>/i.test(withMarker)
    ? withMarker.replace(/<\/body>/i, `${interactions}\n</body>`)
    : `${withMarker}\n${interactions}`;
  await writeFile(htmlPath, withInteractions);
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
      if (lower.includes("thumbnail")) score += 110;
      if (lower.includes("og")) score += 100;
      if (lower.includes("hero")) score += 90;
      if (lower.includes("dashboard")) score += 80;
      if (lower.includes("homepage")) score += 70;
      if (lower.includes("home/")) score += 60;
      if (lower.includes("sample")) score += 50;
      if (lower.includes("logo")) score -= 30;
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
    source: {
      repoUrl: paulledemonSource.repoUrl,
      sourceCommit: paulledemonSource.sourceCommit,
      sourcePath: template.sourcePath,
      sourceUrl,
      license: paulledemonSource.license,
      usageMode: "copied",
      vendorPath: `${paulledemonSource.vendorRoot}/${template.sourcePath}`,
    },
  };
}

function toBcmsPage(template, index) {
  const route = `/pages/${template.id}/`;
  const sourceUrl = `${bcmsSource.repoUrl}/tree/main/${template.sourcePath}`;
  return {
    ...template,
    number: String(index + 21).padStart(2, "0"),
    route,
    url: urlFor(route),
    status: "source-backed",
    deployMode: "stored-starter-source",
    sourceType: "vendored-bcms-astro-starter-source",
    licenseStatus: bcmsSource.license,
    previewImagePath: `${route}architect-preview.svg`,
    source: {
      repoUrl: bcmsSource.repoUrl,
      sourceCommit: bcmsSource.sourceCommit,
      sourcePath: template.sourcePath,
      sourceUrl,
      license: bcmsSource.license,
      usageMode: "stored-source",
      vendorPath: `${bcmsSource.vendorRoot}/${template.sourcePath}`,
      buildNotes: "BCMS Astro starters require BCMS content/type generation before a full app build; this route stores the source and exposes a static preview with interaction fixtures.",
    },
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

Status: Source-backed page from vendored upstream source.

- Source repo: ${page.source.repoUrl}
- Source commit: ${page.source.sourceCommit}
- Source folder: ${page.source.sourcePath}
- Source URL: ${page.source.sourceUrl}
- Vendored path: ${page.source.vendorPath}
- License: ${page.source.license}
- Usage mode: ${page.source.usageMode}
- Deploy mode: ${page.deployMode}

The deployed corpus route at ${page.route} serves stored source-backed content with provenance metadata and a neutral interaction fixture set for analytics/canonicalization evaluation.
`;
}

function buildBcmsStoredSourceHtml(page) {
  const previewMarkup = page.previewImagePath.endsWith("architect-preview.svg")
    ? `<div style="min-height:360px;border-radius:24px;border:1px solid #dbe3ef;background:linear-gradient(135deg,#ecfeff,#f8fafc);display:grid;place-items:center;padding:32px;text-align:center;"><strong style="font-size:42px;line-height:1.05;">${esc(page.title)}</strong></div>`
    : `<img src="${esc(page.previewImagePath.replace(page.route, "./"))}" alt="${esc(page.title)} starter thumbnail" style="width:100%;border-radius:24px;border:1px solid #dbe3ef;box-shadow:0 24px 80px rgba(15,23,42,.16);" />`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(page.title)}</title>
  <meta name="description" content="Stored source-backed BCMS Astro starter page for external analytics evaluation." />
  <meta name="architect-corpus-id" content="${esc(page.id)}" />
  <meta name="architect-source-repo" content="${esc(page.source.repoUrl)}" />
  <meta name="architect-source-path" content="${esc(page.source.sourcePath)}" />
</head>
<body style="margin:0;background:#f8fafc;color:#0f172a;font-family:Inter,Arial,sans-serif;">
  <main style="max-width:1180px;margin:0 auto;padding:48px 20px;">
    <header style="display:grid;gap:18px;margin-bottom:28px;">
      <p style="margin:0;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#0f766e;">BCMS Astro starter source</p>
      <h1 style="margin:0;font-size:clamp(42px,8vw,88px);line-height:.95;letter-spacing:-.06em;">${esc(page.title)}</h1>
      <p style="margin:0;max-width:760px;color:#475569;font-size:19px;line-height:1.7;">This corpus route stores the upstream BCMS starter source at <code>${esc(page.source.sourcePath)}</code>. The starter needs BCMS content/type generation to build as a complete app, so this hosted page presents the stored source provenance, local starter preview asset, and interaction fixtures.</p>
      <div style="display:flex;flex-wrap:wrap;gap:10px;">
        <a href="${esc(page.source.sourceUrl)}" style="display:inline-flex;min-height:44px;align-items:center;border-radius:999px;background:#0f172a;color:white;padding:0 18px;text-decoration:none;font-weight:900;">Open source folder</a>
        <a href="/manifest.json" style="display:inline-flex;min-height:44px;align-items:center;border-radius:999px;background:white;color:#0f172a;border:1px solid #cbd5e1;padding:0 18px;text-decoration:none;font-weight:900;">Manifest</a>
      </div>
    </header>
    ${previewMarkup}
    ${buildInteractionSurface(page)}
  </main>
</body>
</html>`;
}

async function writeBcmsStoredSourcePage(page) {
  const vendorPath = path.join(root, page.source.vendorPath);
  const publicPath = path.join(root, "public", "pages", page.id);
  const metadataPath = path.join(root, "pages", page.id);
  await mkdir(publicPath, { recursive: true });
  await mkdir(metadataPath, { recursive: true });

  const vendorPublicPath = path.join(vendorPath, "public");
  try {
    await cp(vendorPublicPath, path.join(publicPath, "assets"), { recursive: true });
    page.previewImagePath = await selectPreviewImage(publicPath, page);
  } catch {
    page.previewImagePath = `${page.route}architect-preview.svg`;
  }

  await writeFile(path.join(publicPath, "architect-preview.svg"), buildPreviewSvg(page));
  await writeFile(path.join(publicPath, "index.html"), buildBcmsStoredSourceHtml(page));
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
const bcmsPages = bcmsTemplates.map(toBcmsPage);
const pages = [...paulledemonPages, ...bcmsPages];

for (const page of paulledemonPages) {
  const vendorPath = path.join(root, page.source.vendorPath);
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

for (const page of bcmsPages) {
  await writeBcmsStoredSourcePage(page);
}

await writeFile(
  path.join(root, "src", "data", "source-backed-pages.js"),
  `// Generated by scripts/generate-corpus.mjs. Do not edit by hand.\n` +
    `export const generatedAt = ${JSON.stringify(generatedAt)};\n` +
    `export const batch = ${JSON.stringify("source-backed-landing-pages-30")};\n` +
    `export const sources = ${JSON.stringify([paulledemonSource, bcmsSource], null, 2)};\n` +
    `export const pages = ${JSON.stringify(pages, null, 2)};\n`,
);

const manifest = {
  generatedAt,
  baseUrl,
  corpus: "landing-page-source-inspirations",
  runtime: "vite-react-tailwind-worker",
  batch: "source-backed-landing-pages-30",
  batches: [paulledemonSource.batch, bcmsSource.batch],
  count: pages.length,
  sources: [paulledemonSource, bcmsSource],
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
await writeJson(path.join(root, "public", "manifest.bcms-astro-starters-10.json"), {
  ...manifest,
  batch: bcmsSource.batch,
  batches: [bcmsSource.batch],
  count: bcmsPages.length,
  sources: [bcmsSource],
  pages: bcmsPages.map(manifestPage),
});

console.log(`Generated ${paulledemonPages.length} PaulleDemon static pages and ${bcmsPages.length} BCMS stored-source pages`);
