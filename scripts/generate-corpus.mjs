#!/usr/bin/env node
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl =
  process.env.CORPUS_BASE_URL ?? "https://architect-canon-evals-worker.architect-analytics-eval.workers.dev";
const generatedAt = process.env.CORPUS_GENERATED_AT ?? "2026-06-09T00:00:00.000Z";

const sourceReferences = [
  { key: "paulle-awesome", label: "PaulleDemon awesome landing pages", url: "https://github.com/PaulleDemon/awesome-landing-pages" },
  { key: "paulle-gallery", label: "Awesome landing pages gallery", url: "https://awesome-landingpages.vercel.app/" },
  { key: "nordic-awesome", label: "nordicgiant2 awesome landing page", url: "https://github.com/nordicgiant2/awesome-landing-page" },
  { key: "htmlrev", label: "HTMLrev templates", url: "https://htmlrev.com/" },
  { key: "next-shadcn", label: "next-shadcn-landing", url: "https://github.com/redpangilinan/next-shadcn-landing" },
  { key: "linkify", label: "Linkify", url: "https://github.com/Shreyas-29/linkify" },
  { key: "launch-ui", label: "Launch UI", url: "https://github.com/launch-ui/launch-ui" },
  { key: "convertfast", label: "ConvertFast UI", url: "https://github.com/ObservedObserver/convertfast-ui" },
  { key: "shadcn-landing", label: "shadcn landing page", url: "https://github.com/leoMirandaa/shadcn-landing-page" },
];

const companies = [
  ["TemporalGrid", "durable execution for platform teams", "dev-infra"],
  ["GladPath", "AI service operations for enterprise support", "cx"],
  ["Compwise", "continuous compliance automation", "compliance"],
  ["ChaosDeck", "reliability drills for critical systems", "reliability"],
  ["IntentBase", "buyer-intent routing for revenue teams", "revintel"],
  ["SignalRoom", "product analytics for activation teams", "product-analytics"],
  ["Billwise", "usage billing for modern SaaS", "billing"],
  ["SearchPilot", "AI search across customer knowledge", "ai-search"],
  ["DealForge", "sales-assist workflows for complex deals", "sales"],
  ["Workflowly", "workflow automation for operations teams", "automation"],
  ["SuccessHub", "customer success workspace intelligence", "success"],
  ["CloudLedger", "FinOps controls for cloud spend", "finops"],
  ["KnowledgeKit", "docs and support answer orchestration", "knowledge"],
  ["FormSync", "secure form intake for regulated teams", "forms"],
  ["AccessForge", "identity governance for SaaS sprawl", "identity"],
  ["PipelineAtlas", "pipeline intelligence for B2B marketing", "pipeline"],
  ["ProofLayer", "security proof rooms for buyers", "security"],
  ["IncidentLoop", "incident learning for engineering leaders", "incident"],
  ["QueryLake", "analytics warehouse search for operators", "analytics"],
  ["DemoDesk", "demo enablement for sales engineers", "demo"],
  ["VectorOps", "feature flag governance for releases", "release"],
  ["NorthstarCRM", "CRM hygiene for multi-threaded deals", "crm"],
  ["LaunchGuard", "launch readiness command center", "launch"],
  ["MetricBridge", "board-ready metrics from source systems", "metrics"],
  ["TrustDock", "vendor trust automation", "trust"],
  ["ReplyPilot", "support reply automation with controls", "support"],
  ["UsageMeter", "metering infrastructure for AI products", "metering"],
  ["PolicyHub", "policy lifecycle for compliance teams", "policy"],
  ["SegmentFlow", "self-serve audience operations", "segmentation"],
  ["BuyerGraph", "account intelligence for buying committees", "buyer"],
  ["RunbookAI", "runbook automation for SRE teams", "sre"],
  ["DocsRelay", "developer docs delivery analytics", "docs"],
  ["CloudSpend", "procurement-aware cloud planning", "procurement"],
  ["AuditNest", "audit evidence workspace", "audit"],
  ["RouteSignal", "routing intelligence for go-to-market teams", "routing"],
  ["StackPilot", "internal developer platform insights", "platform"],
  ["ControlPlane", "fleet controls for cloud operations", "cloud"],
  ["QualifyKit", "lead qualification for sales-assisted funnels", "qualification"],
  ["NexusDesk", "service desk workflow intelligence", "service-desk"],
  ["TraceRoot", "distributed trace explanations", "observability"],
  ["LinkLedger", "partner link attribution", "partners"],
  ["HandoffHQ", "handoff automation for implementation teams", "handoff"],
  ["RiskCanvas", "risk review workspace", "risk"],
  ["QuotaWise", "sales capacity planning", "quota"],
  ["AnswerLoop", "customer-answer analytics", "answers"],
  ["ScribeOps", "technical writing operations", "scribe"],
  ["AtlasBoard", "executive dashboard automation", "dashboard"],
  ["SignalForge", "signal scoring for outbound teams", "outbound"],
  ["LaunchOps", "launch operations planning", "launchops"],
  ["TrustMatrix", "third-party risk workspace", "vendor-risk"],
];

const suffixCompanies = [
  "WebhookBase", "OpsNarrative", "RevenueLens", "PortalKit", "DataHarbor", "SyncTower", "DemoRoute", "SecurePath",
  "ProofKit", "SpendPilot", "EnableDesk", "ChurnRadar", "IntentMap", "FormBridge", "ReleaseLedger", "QueryPilot",
  "InsightRelay", "ControlRoom", "GraphSuite", "DocsPilot", "FieldBridge", "ScoreLayer", "WorkspaceIQ", "BuyerDeck",
  "SignalCloud", "RunwayOps", "ClaimCheck", "MetricLake", "ContractFlow", "AnswerGrid", "TrustBeacon", "JourneyKit",
  "LaunchField", "QuotaDeck", "SecureRelay", "PipelineOS", "WorkflowBase", "EnableGraph", "IntentHive", "SegmentDesk",
  "CompliancePad", "DataProof", "RevenueRoot", "OpsAtlas", "ConversionKit", "EvidenceFlow", "KernelDesk", "AuditBridge",
  "DemoSignal", "BuyerPath",
];

const verticals = [
  "dev-infra", "cx", "compliance", "reliability", "revintel", "product-analytics", "billing", "ai-search", "sales",
  "automation", "success", "finops", "knowledge", "forms", "identity", "pipeline", "security", "incident", "analytics",
  "demo", "release", "crm", "launch", "metrics", "trust",
];

const archetypes = [
  "home", "product", "pricing", "comparison", "docs", "security", "integrations", "event", "calculator", "case-study",
  "developer", "agent-workflow", "procurement", "use-case", "marketplace", "migration", "benchmark", "launch",
  "solutions", "demo-request",
];

const layoutFamilies = [
  "split-proof", "centered-terminal", "sidebar-docs", "pricing-matrix", "comparison-ledger", "workflow-lane",
  "dashboard-first", "card-catalog", "editorial-report", "event-agenda", "calculator-form", "case-study-narrative",
  "developer-console", "procurement-checklist", "marketplace-shelf", "migration-timeline", "benchmark-grid",
  "announcement-stack", "industry-map", "demo-form-panel",
];

const navKinds = [
  "simple-top", "mega-menu", "sidebar", "left-rail", "centered-tabs", "utility-bar", "product-switcher", "docs-rail",
  "minimal-wordmark", "anchor-strip",
];

const heroKinds = [
  "split-dashboard", "centered-proof", "terminal-window", "asymmetric-editorial", "form-first", "pricing-led",
  "comparison-first", "docs-shell", "event-poster", "customer-story", "market-map", "workflow-board", "api-console",
  "metric-wall", "security-room", "integration-cloud", "launch-note", "calculator-panel", "procurement-brief", "demo-room",
];

const palettes = [
  ["#f8fafc", "#111827", "#0f766e", "#dbe3ef"],
  ["#fff7ed", "#2f1600", "#c2410c", "#fed7aa"],
  ["#f0f9ff", "#082f49", "#0369a1", "#bae6fd"],
  ["#f7fee7", "#1a2e05", "#4d7c0f", "#d9f99d"],
  ["#f5f3ff", "#2e1065", "#7c3aed", "#ddd6fe"],
  ["#fff1f2", "#4c0519", "#e11d48", "#fecdd3"],
  ["#ecfdf5", "#052e16", "#059669", "#a7f3d0"],
  ["#f8fafc", "#0f172a", "#475569", "#cbd5e1"],
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function routeFor(id) {
  return `/pages/${id}/`;
}

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

function buildCases() {
  return Array.from({ length: 100 }, (_, index) => {
    const number = String(index + 1).padStart(3, "0");
    const base = companies[index] ?? [
      suffixCompanies[index - companies.length],
      `${verticals[index % verticals.length].replaceAll("-", " ")} operations for B2B teams`,
      verticals[index % verticals.length],
    ];
    const archetype = archetypes[index % archetypes.length];
    const layoutFamily = layoutFamilies[(index * 7 + Math.floor(index / 10)) % layoutFamilies.length];
    const heroKind = heroKinds[(index * 11 + Math.floor(index / 5)) % heroKinds.length];
    const navKind = navKinds[(index * 3 + Math.floor(index / 8)) % navKinds.length];
    const source = sourceReferences[index % sourceReferences.length];
    const id = `${number}-${slugify(base[0])}-${slugify(layoutFamily)}`;
    const route = routeFor(id);
    const sections = makeSections(index, archetype, layoutFamily);
    return {
      id,
      number,
      company: base[0],
      tagline: base[1],
      vertical: base[2],
      archetype,
      route,
      url: urlFor(route),
      assetBase: `${route}assets/`,
      sourceType: "architect-owned-generated-source",
      licenseStatus: "architect-owned",
      inspiration: source,
      layoutFamily,
      heroKind,
      navKind,
      paletteIndex: index % palettes.length,
      density: ["compact", "balanced", "longform", "dense"][index % 4],
      sections,
      layoutSignature: [layoutFamily, heroKind, navKind, sections.join("|")].join("::"),
      primaryCta: ["Book demo", "Start trial", "Explore product", "See pricing", "Talk to sales"][index % 5],
      secondaryCta: ["Read docs", "View comparison", "Watch overview", "Download brief", "See examples"][index % 5],
    };
  });
}

function makeSections(index, archetype, layoutFamily) {
  const banks = [
    ["logo-cloud", "pain-grid", "product-proof", "customer-logos", "cta-band"],
    ["feature-tabs", "workflow-steps", "role-cards", "security-note", "demo-form"],
    ["pricing-table", "plan-cards", "faq-accordion", "procurement-note", "cta-band"],
    ["competitor-table", "switcher-panel", "proof-quotes", "migration-steps", "demo-form"],
    ["docs-sidebar", "api-table", "quickstart-code", "changelog-list", "developer-cta"],
    ["trust-center", "control-grid", "audit-timeline", "policy-links", "security-form"],
    ["integration-grid", "marketplace-filters", "partner-cards", "webhook-panel", "signup-form"],
    ["event-hero", "agenda-list", "speaker-grid", "registration-form", "sponsor-row"],
    ["roi-calculator", "benchmark-bars", "input-form", "results-table", "download-cta"],
    ["case-masthead", "before-after", "metric-row", "story-timeline", "quote-wall"],
  ];
  const selected = banks[index % banks.length];
  const rotation = index % selected.length;
  const rotated = selected.slice(rotation).concat(selected.slice(0, rotation));
  return [`${archetype}-hero`, `${layoutFamily}-anchor`, ...rotated.slice(0, 3 + (index % 3))];
}

function buildAssetSvg(testCase, kind) {
  const [bg, ink, accent, border] = palettes[testCase.paletteIndex];
  const title = esc(testCase.company);
  const subtitle = esc(kind === "hero" ? testCase.tagline : `${testCase.layoutFamily} · ${testCase.archetype}`);
  const shapes = Array.from({ length: 5 }, (_, i) => {
    const x = 80 + ((i * 173 + testCase.number) % 760);
    const y = 130 + ((i * 89 + testCase.number) % 280);
    const w = 90 + ((i * 37) % 130);
    const h = 56 + ((i * 53) % 100);
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${i % 2 ? border : accent}" opacity="${i % 2 ? "0.8" : "0.2"}"/>`;
  }).join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" role="img" aria-labelledby="title desc">
  <title id="title">${title} ${kind}</title>
  <desc id="desc">${subtitle}</desc>
  <rect width="1200" height="720" fill="${bg}"/>
  <rect x="52" y="52" width="1096" height="616" rx="30" fill="#ffffff" stroke="${border}" stroke-width="4"/>
  ${shapes}
  <text x="96" y="138" fill="${accent}" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="800">${esc(testCase.inspiration.key)}</text>
  <text x="96" y="524" fill="${ink}" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="850">${title}</text>
  <text x="96" y="588" fill="${ink}" opacity="0.72" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="650">${subtitle}</text>
</svg>
`;
}

function buildLogoSvg(testCase) {
  const [, ink, accent] = palettes[testCase.paletteIndex];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120" role="img" aria-label="${esc(testCase.company)} logo">
  <rect width="320" height="120" rx="24" fill="#ffffff"/>
  <circle cx="62" cy="60" r="28" fill="${accent}"/>
  <path d="M48 62h28M62 46v28" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
  <text x="108" y="71" fill="${ink}" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="850">${esc(testCase.company)}</text>
</svg>
`;
}

function sectionHtml(section, testCase, index) {
  if (/pricing|table|comparison|benchmark|api/.test(section)) {
    return `<section class="section table-section" data-section-key="${esc(section)}">
      <div><p class="eyebrow">${esc(section)}</p><h2>${esc(testCase.company)} turns scattered signals into a scored plan.</h2></div>
      <table>
        <thead><tr><th>Signal</th><th>${esc(testCase.company)}</th><th>Manual path</th></tr></thead>
        <tbody><tr><td>Root mapping</td><td>Structured</td><td>Ad hoc</td></tr><tr><td>Action targets</td><td>Bound</td><td>Unclear</td></tr><tr><td>Evidence</td><td>Replayable</td><td>Missing</td></tr></tbody>
      </table>
    </section>`;
  }
  if (/form|registration|signup|demo/.test(section)) {
    return `<section class="section form-section" data-section-key="${esc(section)}">
      <div><p class="eyebrow">${esc(section)}</p><h2>Route a buyer to the right next step.</h2><p>Fields and submit controls help the canonicaliser bind action targets inside the correct root.</p></div>
      <form><input aria-label="Work email" placeholder="name@company.com"/><select aria-label="Company size"><option>51-250 employees</option><option>251-1000 employees</option><option>1000+ employees</option></select><button type="button">${esc(testCase.primaryCta)}</button></form>
    </section>`;
  }
  if (/docs|code|quickstart|developer/.test(section)) {
    return `<section class="section code-section" data-section-key="${esc(section)}">
      <aside><p class="eyebrow">${esc(section)}</p><h2>Ship with a documented path.</h2><p>Docs pages stress side navigation, code surfaces, and dense link groups.</p></aside>
      <pre>curl https://api.${slugify(testCase.company)}.example/v1/events \\
  -H "Authorization: Bearer $TOKEN"</pre>
    </section>`;
  }
  if (/grid|cards|marketplace|logos|speaker|partner|role/.test(section)) {
    return `<section class="section card-section" data-section-key="${esc(section)}">
      <header><p class="eyebrow">${esc(section)}</p><h2>Designed for ${esc(testCase.vertical.replaceAll("-", " "))} buying committees.</h2></header>
      <div class="cards">${["Operators", "Admins", "Executives"].map((label, i) => `<article><strong>${label}</strong><span>${esc(testCase.sections[(index + i) % testCase.sections.length])}</span><a href="#conversion">Open path</a></article>`).join("")}</div>
    </section>`;
  }
  return `<section class="section narrative-section" data-section-key="${esc(section)}">
    <p class="eyebrow">${esc(section)}</p>
    <h2>${esc(testCase.layoutFamily)} for ${esc(testCase.vertical.replaceAll("-", " "))} teams.</h2>
    <p>${esc(testCase.company)} uses this section to create a distinct DOM root and target neighborhood for canonicalisation evals.</p>
    <a class="text-link" href="#conversion">${esc(testCase.secondaryCta)}</a>
  </section>`;
}

function buildPageHtml(testCase) {
  const [bg, ink, accent, border] = palettes[testCase.paletteIndex];
  const navLinks = ["Product", "Customers", "Docs", "Pricing"];
  const sections = testCase.sections.map((section, index) => sectionHtml(section, testCase, index)).join("\n");
  const bodyClass = `layout-${slugify(testCase.layoutFamily)} nav-${slugify(testCase.navKind)} density-${testCase.density}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${esc(testCase.company)} · ${esc(testCase.archetype)} corpus page</title>
  <meta name="description" content="${esc(testCase.tagline)}"/>
  <style>
    :root { --bg: ${bg}; --ink: ${ink}; --accent: ${accent}; --border: ${border}; --card: #ffffff; --muted: #64748b; --radius: ${6 + (Number(testCase.number) % 4) * 2}px; }
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; overflow-x: clip; }
    body { background: var(--bg); color: var(--ink); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    a { color: inherit; } h1, h2, h3, p { margin-top: 0; } h1, h2, h3 { font-style: normal; letter-spacing: 0; }
    .site-nav { align-items: center; background: rgb(255 255 255 / 92%); border-bottom: 1px solid var(--border); display: flex; gap: 24px; justify-content: space-between; padding: 18px clamp(18px, 4vw, 72px); position: sticky; top: 0; z-index: 10; }
    .brand { align-items: center; display: flex; gap: 10px; font-weight: 900; text-decoration: none; } .brand img { height: 34px; width: auto; }
    .site-nav nav { display: flex; flex-wrap: wrap; gap: 18px; } .site-nav nav a { color: var(--muted); font-size: 14px; font-weight: 800; text-decoration: none; }
    .button { background: var(--ink); border: 1px solid var(--ink); border-radius: var(--radius); color: white; display: inline-flex; font-weight: 850; min-height: 44px; padding: 10px 18px; text-decoration: none; white-space: nowrap; }
    .button.secondary { background: transparent; color: var(--ink); }
    .hero { display: grid; gap: 40px; grid-template-columns: ${Number(testCase.number) % 3 === 0 ? "minmax(0, .75fr) minmax(320px, 1fr)" : "minmax(0, 1.05fr) minmax(320px, .95fr)"}; min-height: ${560 + (Number(testCase.number) % 5) * 28}px; padding: ${58 + (Number(testCase.number) % 4) * 12}px clamp(18px, 5vw, 80px); }
    .hero-copy { align-self: center; max-width: 860px; } .eyebrow { color: var(--accent); font-size: 13px; font-weight: 900; text-transform: uppercase; }
    h1 { font-size: ${52 + (Number(testCase.number) % 4) * 6}px; line-height: .98; margin-bottom: 20px; overflow-wrap: anywhere; }
    h2 { font-size: ${30 + (Number(testCase.number) % 4) * 3}px; line-height: 1.06; margin-bottom: 12px; }
    .hero p, .section p { color: var(--muted); font-size: 18px; line-height: 1.65; }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
    .hero-media { align-self: center; } .hero-media img { border: 1px solid var(--border); border-radius: calc(var(--radius) * 2); box-shadow: 0 30px 80px rgb(15 23 42 / 14%); display: block; width: 100%; }
    .section { border-top: 1px solid var(--border); padding: ${46 + (Number(testCase.number) % 5) * 8}px clamp(18px, 5vw, 80px); }
    .table-section, .code-section, .form-section { display: grid; gap: 28px; grid-template-columns: minmax(0, .72fr) minmax(320px, 1fr); }
    table { background: white; border-collapse: collapse; border-radius: var(--radius); overflow: hidden; width: 100%; } th, td { border: 1px solid var(--border); padding: 14px; text-align: left; } th { background: var(--bg); }
    form { background: white; border: 1px solid var(--border); border-radius: calc(var(--radius) * 1.5); display: grid; gap: 12px; padding: 20px; } input, select { border: 1px solid var(--border); border-radius: var(--radius); font: inherit; min-height: 46px; padding: 0 12px; }
    form button { background: var(--accent); border: 0; border-radius: var(--radius); color: white; font: inherit; font-weight: 850; min-height: 46px; }
    pre { background: var(--ink); border-radius: calc(var(--radius) * 1.5); color: white; line-height: 1.65; margin: 0; overflow-x: auto; padding: 22px; }
    .cards { display: grid; gap: 14px; grid-template-columns: repeat(${2 + (Number(testCase.number) % 2)}, minmax(0, 1fr)); } .cards article { background: white; border: 1px solid var(--border); border-radius: var(--radius); display: grid; gap: 12px; min-height: 170px; padding: 18px; } .cards span { color: var(--muted); }
    .narrative-section { max-width: ${Number(testCase.number) % 2 ? "880px" : "none"}; }
    .conversion { background: var(--ink); color: white; display: grid; gap: 24px; grid-template-columns: minmax(0, 1fr) minmax(300px, .5fr); padding: 64px clamp(18px, 5vw, 80px); } .conversion p { color: rgb(255 255 255 / 72%); }
    .footer { align-items: center; display: flex; justify-content: space-between; padding: 24px clamp(18px, 5vw, 80px); }
    .layout-centered-terminal .hero, .layout-announcement-stack .hero { grid-template-columns: minmax(0, 920px); justify-content: center; text-align: center; }
    .layout-sidebar-docs .site-nav, .layout-docs-shell .site-nav { align-items: flex-start; }
    .layout-card-catalog .section, .layout-marketplace-shelf .section { background: rgb(255 255 255 / 35%); }
    @media (max-width: 860px) { h1 { font-size: 42px; } .hero, .table-section, .code-section, .form-section, .conversion { grid-template-columns: 1fr; } .site-nav { align-items: flex-start; flex-direction: column; } .cards { grid-template-columns: 1fr; } }
  </style>
</head>
<body class="${bodyClass}" data-page-id="${esc(testCase.id)}">
  <header class="site-nav" data-root-key="navigation">
    <a class="brand" href="/"><img src="assets/logo.svg" alt=""/>${esc(testCase.company)}</a>
    <nav>${navLinks.map((link) => `<a href="#${slugify(link)}">${link}</a>`).join("")}</nav>
    <a class="button" href="#conversion">${esc(testCase.primaryCta)}</a>
  </header>
  <main>
    <section class="hero hero-${esc(testCase.heroKind)}" data-root-key="hero">
      <div class="hero-copy">
        <p class="eyebrow">${esc(testCase.vertical)} · ${esc(testCase.layoutFamily)}</p>
        <h1>${esc(testCase.tagline)}.</h1>
        <p>${esc(testCase.company)} is an ICP-shaped source page for canonicalisation and external analytics evals. It has local assets, distinct roots, and real action targets.</p>
        <div class="hero-actions"><a class="button" href="#conversion">${esc(testCase.primaryCta)}</a><a class="button secondary" href="#product">${esc(testCase.secondaryCta)}</a></div>
      </div>
      <figure class="hero-media"><img src="assets/hero.svg" alt="${esc(testCase.company)} product preview"/></figure>
    </section>
    ${sections}
    <section class="conversion" id="conversion" data-root-key="conversion">
      <div><p class="eyebrow">Conversion</p><h2>Evaluate ${esc(testCase.company)} with stable roots and action targets.</h2><p>The harness should observe this form, CTA, and surrounding component hierarchy.</p></div>
      <form><input aria-label="Email" placeholder="work@email.com"/><button type="button">${esc(testCase.primaryCta)}</button></form>
    </section>
  </main>
  <footer class="footer"><span>${esc(testCase.company)}</span><a href="/manifest.json">Manifest</a></footer>
</body>
</html>
`;
}

function buildRootIndex(cases) {
  const links = cases.map((testCase) => `<a class="case" href="${testCase.route}"><img src="${testCase.route}assets/hero.svg" alt=""/><span><strong>${testCase.number}. ${esc(testCase.company)}</strong><small>${esc(testCase.layoutFamily)} · ${esc(testCase.vertical)}</small></span></a>`).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Landing Page Source Inspirations</title>
  <style>
    * { box-sizing: border-box; } html, body { margin: 0; overflow-x: clip; } body { background: #f8fafc; color: #111827; font-family: Inter, ui-sans-serif, system-ui, sans-serif; padding: 32px; }
    header { border-bottom: 1px solid #dbe3ef; display: flex; gap: 24px; justify-content: space-between; padding-bottom: 24px; } h1 { font-size: 44px; line-height: 1; margin: 0 0 12px; } p { color: #64748b; margin: 0; max-width: 820px; }
    .actions { display: flex; gap: 10px; } .actions a { background: #111827; border-radius: 8px; color: white; font-weight: 800; padding: 12px 16px; text-decoration: none; white-space: nowrap; }
    .grid { display: grid; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); padding-top: 24px; }
    .case { align-items: center; background: white; border: 1px solid #dbe3ef; border-radius: 8px; color: inherit; display: grid; gap: 12px; grid-template-columns: 96px minmax(0, 1fr); padding: 10px; text-decoration: none; }
    .case img { aspect-ratio: 1.91 / 1; border: 1px solid #dbe3ef; border-radius: 6px; object-fit: cover; width: 100%; } .case span { display: grid; gap: 4px; min-width: 0; } .case strong, .case small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .case small { color: #64748b; }
    @media (max-width: 760px) { body { padding: 18px; } header { flex-direction: column; } h1 { font-size: 34px; } }
  </style>
</head>
<body>
  <header><div><h1>100 landing-page source inspirations</h1><p>Deployable corpus for Architect page canonicalisation evals. Each route has local source, local assets, metadata, and license notes.</p></div><nav class="actions"><a href="/manifest.json">Manifest</a></nav></header>
  <main class="grid">${links}</main>
</body>
</html>
`;
}

function buildLicenseNotes(testCase) {
  return `# ${testCase.company} License Notes

Status: Architect-owned generated fixture.

This page is an original generated source fixture for page canonicalisation and external analytics evals. It is inspired by public SaaS landing-page patterns and the recorded inspiration reference below, but it does not copy upstream template code, images, text, or brand assets.

- Inspiration key: ${testCase.inspiration.key}
- Inspiration URL: ${testCase.inspiration.url}
- Source type: ${testCase.sourceType}
- License status: ${testCase.licenseStatus}

If this bundle is replaced with copied or cloned upstream source, update this file with the upstream license, commit SHA or download URL, and audit decision before deploying it.
`;
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

await rm(path.join(root, "pages"), { recursive: true, force: true });
await rm(path.join(root, "public"), { recursive: true, force: true });
await mkdir(path.join(root, "pages"), { recursive: true });
await mkdir(path.join(root, "public"), { recursive: true });

const cases = buildCases();

for (const testCase of cases) {
  const pageRoot = path.join(root, "pages", testCase.id);
  const sourceRoot = path.join(pageRoot, "source");
  const assetRoot = path.join(sourceRoot, "assets");
  await mkdir(assetRoot, { recursive: true });
  await writeJson(path.join(pageRoot, "page.json"), {
    id: testCase.id,
    number: testCase.number,
    company: testCase.company,
    tagline: testCase.tagline,
    vertical: testCase.vertical,
    archetype: testCase.archetype,
    route: testCase.route,
    url: testCase.url,
    sourceType: testCase.sourceType,
    licenseStatus: testCase.licenseStatus,
    inspiration: testCase.inspiration,
    layoutFamily: testCase.layoutFamily,
    heroKind: testCase.heroKind,
    navKind: testCase.navKind,
    density: testCase.density,
    sections: testCase.sections,
    layoutSignature: testCase.layoutSignature,
    assets: ["assets/logo.svg", "assets/hero.svg", "assets/product.svg"],
  });
  await writeFile(path.join(pageRoot, "license-notes.md"), buildLicenseNotes(testCase));
  await writeFile(path.join(sourceRoot, "index.html"), buildPageHtml(testCase));
  await writeFile(path.join(assetRoot, "logo.svg"), buildLogoSvg(testCase));
  await writeFile(path.join(assetRoot, "hero.svg"), buildAssetSvg(testCase, "hero"));
  await writeFile(path.join(assetRoot, "product.svg"), buildAssetSvg(testCase, "product"));
}

await writeFile(path.join(root, "public", "index.html"), buildRootIndex(cases));
await writeJson(path.join(root, "public", "manifest.json"), {
  generatedAt,
  baseUrl,
  corpus: "landing-page-source-inspirations",
  count: cases.length,
  sourceReferences,
  pages: cases.map((testCase) => ({
    id: testCase.id,
    number: testCase.number,
    company: testCase.company,
    route: testCase.route,
    url: testCase.url,
    sourcePath: `pages/${testCase.id}/source/index.html`,
    metadataPath: `pages/${testCase.id}/page.json`,
    licensePath: `pages/${testCase.id}/license-notes.md`,
    previewImage: urlFor(`${testCase.route}assets/hero.svg`),
    localAssets: [
      `${testCase.route}assets/logo.svg`,
      `${testCase.route}assets/hero.svg`,
      `${testCase.route}assets/product.svg`,
    ],
    vertical: testCase.vertical,
    archetype: testCase.archetype,
    layoutFamily: testCase.layoutFamily,
    heroKind: testCase.heroKind,
    navKind: testCase.navKind,
    density: testCase.density,
    sections: testCase.sections,
    layoutSignature: testCase.layoutSignature,
    sourceType: testCase.sourceType,
    licenseStatus: testCase.licenseStatus,
    inspiration: testCase.inspiration,
  })),
});

console.log(`Generated ${cases.length} landing-page source bundles`);
