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
  { key: "gofullpage", label: "GoFullPage capture extension", url: "https://github.com/mrcoles/full-page-screen-capture-chrome-extension" },
  { key: "pesticide", label: "Pesticide without hover bar", url: "https://github.com/michaelkolesidis/pesticide-without-hover-bar" },
  { key: "stagehand", label: "Stagehand v3", url: "https://docs.stagehand.dev/v3/basics/observe" },
  { key: "kernel-stagehand", label: "Kernel Stagehand integration", url: "https://www.kernel.sh/docs/integrations/stagehand" },
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
  ["WebhookBase", "webhook reliability for automation teams", "webhooks"],
  ["OpsNarrative", "operating narratives for executive teams", "ops"],
  ["RevenueLens", "revenue intelligence for sales-led SaaS", "revenue"],
  ["PortalKit", "customer portal operations for B2B platforms", "portal"],
  ["DataHarbor", "warehouse activation for GTM teams", "data"],
  ["SyncTower", "system sync controls for business apps", "sync"],
  ["DemoRoute", "demo routing for complex buyer journeys", "demo-routing"],
  ["SecurePath", "security review automation for vendors", "security-review"],
  ["ProofKit", "proof collection for enterprise buyers", "buyer-proof"],
  ["SpendPilot", "spend workflows for finance teams", "finance"],
  ["EnableDesk", "enablement desk for account teams", "enablement"],
  ["ChurnRadar", "retention signals for customer teams", "retention"],
  ["IntentMap", "intent map routing for marketers", "intent"],
  ["FormBridge", "form enrichment for sales funnels", "enrichment"],
  ["ReleaseLedger", "release evidence for product orgs", "release-ledger"],
  ["QueryPilot", "self-serve analytics query copilots", "query"],
  ["InsightRelay", "insight delivery for Slack-first analytics", "insights"],
  ["ControlRoom", "operations control rooms for SaaS teams", "control"],
  ["GraphSuite", "account graph workspaces for B2B teams", "account-graph"],
  ["DocsPilot", "docs insights for developer marketing", "developer-docs"],
  ["FieldBridge", "field team workflows for sales engineers", "field"],
  ["ScoreLayer", "lead score governance for RevOps", "scoring"],
  ["WorkspaceIQ", "workspace intelligence for knowledge teams", "workspace"],
  ["BuyerDeck", "buyer enablement rooms for enterprise sales", "buyer-room"],
  ["SignalCloud", "signal cloud for product-led growth", "plg"],
  ["RunwayOps", "runway planning for finance leaders", "planning"],
  ["ClaimCheck", "claims review for compliance teams", "claims"],
  ["MetricLake", "metrics lake for operating reviews", "metrics-lake"],
  ["ContractFlow", "contract workflow automation", "contracts"],
  ["AnswerGrid", "answer analytics for support portals", "support-analytics"],
  ["TrustBeacon", "trust center automation for SaaS vendors", "trust-center"],
  ["JourneyKit", "journey orchestration for lifecycle teams", "journey"],
  ["LaunchField", "field launch operations", "field-launch"],
  ["QuotaDeck", "quota planning and territory design", "territory"],
  ["SecureRelay", "secure customer data exchange", "secure-exchange"],
  ["PipelineOS", "pipeline operations for revenue teams", "pipeline-os"],
  ["WorkflowBase", "workflow base layer for SaaS ops", "workflow"],
  ["EnableGraph", "enablement graph for account teams", "enablement-graph"],
  ["IntentHive", "intent hive for buying committees", "intent-hive"],
  ["SegmentDesk", "segment operations desk", "segments"],
  ["CompliancePad", "compliance workspace for startups", "startup-compliance"],
  ["DataProof", "data proof rooms for analytics teams", "data-proof"],
  ["RevenueRoot", "revenue root cause analysis", "revenue-root"],
  ["OpsAtlas", "ops atlas for SaaS leadership", "ops-atlas"],
  ["ConversionKit", "conversion intelligence for marketing sites", "conversion"],
  ["EvidenceFlow", "evidence workflows for regulated SaaS", "evidence"],
  ["KernelDesk", "browser automation desk for agents", "browser-agents"],
  ["AuditBridge", "audit bridge for governance teams", "governance"],
  ["DemoSignal", "demo signal scoring for sales engineering", "demo-signal"],
  ["BuyerPath", "buyer path analytics for B2B websites", "buyer-path"],
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
  { bg: "#f8fafc", ink: "#111827", accent: "#0f766e", soft: "#ccfbf1", line: "#dbe3ef" },
  { bg: "#fff7ed", ink: "#2f1600", accent: "#c2410c", soft: "#fed7aa", line: "#fed7aa" },
  { bg: "#f0f9ff", ink: "#082f49", accent: "#0369a1", soft: "#bae6fd", line: "#bae6fd" },
  { bg: "#f7fee7", ink: "#1a2e05", accent: "#4d7c0f", soft: "#d9f99d", line: "#d9f99d" },
  { bg: "#fff1f2", ink: "#4c0519", accent: "#e11d48", soft: "#fecdd3", line: "#fecdd3" },
  { bg: "#ecfdf5", ink: "#052e16", accent: "#059669", soft: "#a7f3d0", line: "#a7f3d0" },
  { bg: "#f8fafc", ink: "#0f172a", accent: "#475569", soft: "#e2e8f0", line: "#cbd5e1" },
  { bg: "#fdf4ff", ink: "#4a044e", accent: "#a21caf", soft: "#f5d0fe", line: "#f5d0fe" },
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


const paulledemonSource = {
  batch: "paulledemon-vite-20",
  repoUrl: "https://github.com/PaulleDemon/awesome-landing-pages",
  sourceCommit: "e98eb80c593b8cd28d1f39556ccdda160a932581",
  vendorRoot: "vendor/paulledemon-awesome-landing-pages/source",
  license: "MIT",
};

const paulledemonTemplates = [
  { id: "pixa-ai", title: "Pixa AI", sourcePath: "src/saas/pixaai", vertical: "ai-saas", archetype: "home", layoutFamily: "split-proof", heroKind: "split-dashboard", navKind: "mega-menu", tagline: "All your AI models and creative tools in one Vite landing page" },
  { id: "saasy-dark", title: "SaaSy Dark", sourcePath: "src/saas/SaaSyDark", vertical: "saas", archetype: "home", layoutFamily: "centered-terminal", heroKind: "centered-proof", navKind: "minimal-wordmark", tagline: "Dark-mode SaaS positioning with sharp product proof" },
  { id: "saas-ai", title: "SaaS AI", sourcePath: "src/saas/SaaS-AI", vertical: "ai-saas", archetype: "product", layoutFamily: "dashboard-first", heroKind: "dashboard-hero", navKind: "simple-top", tagline: "AI product landing flow with dashboard-led conversion" },
  { id: "finance-saas", title: "Finance SaaS", sourcePath: "src/saas/finance", vertical: "fintech-saas", archetype: "pricing", layoutFamily: "pricing-matrix", heroKind: "pricing-led", navKind: "utility-bar", tagline: "Financial operations SaaS page with plan and trust structure" },
  { id: "celestial-saas", title: "Celestial SaaS", sourcePath: "src/saas/CelestialSaaS", vertical: "saas", archetype: "home", layoutFamily: "announcement-stack", heroKind: "launch-note", navKind: "centered-tabs", tagline: "Atmospheric SaaS launch page with stacked proof sections" },
  { id: "ai-sales-app", title: "AI Sales App", sourcePath: "src/apps/AISales", vertical: "gtm-ai", archetype: "product", layoutFamily: "workflow-lane", heroKind: "workflow-board", navKind: "product-switcher", tagline: "AI sales workflow page for outbound and account teams" },
  { id: "chat-origin", title: "Chat Origin", sourcePath: "src/apps/chatorigin", vertical: "chat-app", archetype: "demo-request", layoutFamily: "demo-form-panel", heroKind: "demo-room", navKind: "simple-top", tagline: "Conversational app landing page with direct demo action" },
  { id: "navigator", title: "Navigator", sourcePath: "src/apps/navigator", vertical: "productivity-app", archetype: "use-case", layoutFamily: "card-catalog", heroKind: "market-map", navKind: "anchor-strip", tagline: "Navigator app landing page with catalogued feature paths" },
  { id: "traveler", title: "Traveler", sourcePath: "src/apps/traveler", vertical: "travel-app", archetype: "home", layoutFamily: "industry-map", heroKind: "market-map", navKind: "simple-top", tagline: "Travel app page with destination-led discovery structure" },
  { id: "law-fire", title: "Law Fire", sourcePath: "src/law/lawfire", vertical: "legal-services", archetype: "services", layoutFamily: "procurement-checklist", heroKind: "procurement-brief", navKind: "utility-bar", tagline: "Legal service page with buyer-proof and intake structure" },
  { id: "law-group", title: "Law Group", sourcePath: "src/law/lawgroup", vertical: "legal-services", archetype: "case-study", layoutFamily: "case-study-narrative", heroKind: "customer-story", navKind: "mega-menu", tagline: "Law firm landing page with narrative practice-area sections" },
  { id: "brick-property", title: "Brick Property", sourcePath: "src/realestate/brickproperty", vertical: "real-estate", archetype: "marketplace", layoutFamily: "marketplace-shelf", heroKind: "integration-cloud", navKind: "product-switcher", tagline: "Real estate landing page with listing and inquiry structure" },
  { id: "project-africa", title: "Project Africa", sourcePath: "src/ngo/project-africa", vertical: "ngo", archetype: "campaign", layoutFamily: "editorial-report", heroKind: "asymmetric-editorial", navKind: "simple-top", tagline: "NGO campaign page with editorial impact narrative" },
  { id: "bistro-restaurant", title: "Bistro Restaurant", sourcePath: "src/restaurant/bistro", vertical: "restaurant", archetype: "local-service", layoutFamily: "event-agenda", heroKind: "event-poster", navKind: "minimal-wordmark", tagline: "Restaurant landing page with menu, booking, and event rhythm" },
  { id: "nutrio-restaurant", title: "Nutrio Restaurant", sourcePath: "src/restaurant/nutrio", vertical: "restaurant-wellness", archetype: "local-service", layoutFamily: "calculator-form", heroKind: "form-first", navKind: "anchor-strip", tagline: "Nutrition restaurant page with wellness-led conversion form" },
  { id: "car-wash", title: "Car Wash", sourcePath: "src/others/carwash", vertical: "local-service", archetype: "pricing", layoutFamily: "comparison-ledger", heroKind: "comparison-first", navKind: "simple-top", tagline: "Local service landing page with package comparison structure" },
  { id: "jamie-developer", title: "Jamie Developer", sourcePath: "src/portfolio/Jamie-portfolio", vertical: "portfolio", archetype: "developer", layoutFamily: "developer-console", heroKind: "api-console", navKind: "docs-rail", tagline: "Developer portfolio page adapted into a Vite route" },
  { id: "jrdev-portfolio", title: "JrDev Portfolio", sourcePath: "src/portfolio/jrdev", vertical: "portfolio", archetype: "developer", layoutFamily: "sidebar-docs", heroKind: "docs-shell", navKind: "sidebar", tagline: "Junior developer portfolio with docs-style navigation" },
  { id: "bella-youtuber", title: "Bella Youtuber", sourcePath: "src/portfolio/bella", vertical: "creator", archetype: "home", layoutFamily: "benchmark-grid", heroKind: "metric-wall", navKind: "centered-tabs", tagline: "Creator portfolio landing page with content proof blocks" },
  { id: "notion-portfolio", title: "Notion Themed Portfolio", sourcePath: "src/portfolio/notion", vertical: "portfolio", archetype: "docs", layoutFamily: "migration-timeline", heroKind: "docs-shell", navKind: "left-rail", tagline: "Notion-themed portfolio page with document-style structure" },
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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

function buildCases() {
  return companies.map((base, index) => {
    const number = String(index + 1).padStart(3, "0");
    const archetype = archetypes[index % archetypes.length];
    const layoutFamily = layoutFamilies[(index * 7 + Math.floor(index / 10)) % layoutFamilies.length];
    const heroKind = heroKinds[(index * 11 + Math.floor(index / 5)) % heroKinds.length];
    const navKind = navKinds[(index * 3 + Math.floor(index / 8)) % navKinds.length];
    const inspiration = sourceReferences[index % sourceReferences.length];
    const id = `${number}-${slugify(base[0])}-${slugify(layoutFamily)}`;
    const route = routeFor(id);
    const sections = makeSections(index, archetype, layoutFamily);
    const previewImagePath = `${route}assets/hero.svg`;
    return {
      id,
      number,
      company: base[0],
      tagline: base[1],
      vertical: base[2],
      archetype,
      route,
      url: urlFor(route),
      sourceType: "architect-owned-generated-react-source",
      licenseStatus: "architect-owned",
      inspiration,
      layoutFamily,
      heroKind,
      navKind,
      palette: palettes[index % palettes.length],
      density: ["compact", "balanced", "longform", "dense"][index % 4],
      sections,
      layoutSignature: [layoutFamily, heroKind, navKind, sections.join("|")].join("::"),
      primaryCta: ["Book demo", "Start trial", "Explore product", "See pricing", "Talk to sales"][index % 5],
      secondaryCta: ["Read docs", "View comparison", "Watch overview", "Download brief", "See examples"][index % 5],
      previewImagePath,
      assets: {
        logo: `${route}assets/logo.svg`,
        hero: `${route}assets/hero.svg`,
        product: `${route}assets/product.svg`,
      },
    };
  });
}

function buildPaulledemonCases() {
  return paulledemonTemplates.map((template, index) => {
    const number = String(index + 101);
    const route = routeFor(template.id);
    const sections = makeSections(index + 100, template.archetype, template.layoutFamily);
    const sourceUrl = `${paulledemonSource.repoUrl}/tree/main/${template.sourcePath}`;
    const source = {
      repoUrl: paulledemonSource.repoUrl,
      sourceCommit: paulledemonSource.sourceCommit,
      sourcePath: template.sourcePath,
      sourceUrl,
      license: paulledemonSource.license,
      usageMode: "adapted",
      vendorPath: `${paulledemonSource.vendorRoot}/${template.sourcePath}`,
    };

    return {
      id: template.id,
      number,
      title: template.title,
      company: template.title,
      tagline: template.tagline,
      vertical: template.vertical,
      archetype: template.archetype,
      route,
      url: urlFor(route),
      status: "source-backed",
      deployMode: "vite-react-route",
      sourceType: "vendored-upstream-template-adapted-to-vite-react-route",
      licenseStatus: "MIT",
      source,
      inspiration: {
        key: paulledemonSource.batch,
        label: `${template.title} · PaulleDemon awesome landing pages`,
        url: sourceUrl,
      },
      layoutFamily: template.layoutFamily,
      heroKind: template.heroKind,
      navKind: template.navKind,
      palette: palettes[(index + 2) % palettes.length],
      density: ["compact", "balanced", "longform", "dense"][index % 4],
      sections,
      layoutSignature: [template.layoutFamily, template.heroKind, template.navKind, template.sourcePath, sections.join("|")].join("::"),
      primaryCta: ["View template", "Open source", "Run eval", "Inspect page"][index % 4],
      secondaryCta: ["Source folder", "Manifest entry", "Preview route", "License notes"][index % 4],
      previewImagePath: `${route}assets/hero.svg`,
      assets: {
        logo: `${route}assets/logo.svg`,
        hero: `${route}assets/hero.svg`,
        product: `${route}assets/product.svg`,
      },
    };
  });
}

function buildSourceBackedLicenseNotes(testCase) {
  return `# ${testCase.title} License Notes

Status: Source-backed Vite React route adapted from a vendored MIT template.

- Source repo: ${testCase.source.repoUrl}
- Source commit: ${testCase.source.sourceCommit}
- Source folder: ${testCase.source.sourcePath}
- Source URL: ${testCase.source.sourceUrl}
- Vendored path: ${testCase.source.vendorPath}
- License: ${testCase.source.license}
- Usage mode: ${testCase.source.usageMode}
- Deploy mode: ${testCase.deployMode}

The upstream template source is vendored for provenance. The deployed corpus route is a Vite/React page fixture adapted from the selected template folder metadata and category so it can run under the Cloudflare Worker host without per-template build tooling.
`;
}

function buildAssetSvg(testCase, kind) {
  const { bg, ink, accent, soft, line } = testCase.palette;
  const title = esc(testCase.company);
  const subtitle = esc(kind === "hero" ? testCase.tagline : `${testCase.layoutFamily} · ${testCase.archetype}`);
  const seed = Number.parseInt(testCase.number, 10) || [...testCase.id].reduce((total, char) => total + char.charCodeAt(0), 0);
  const shapes = Array.from({ length: 8 }, (_, i) => {
    const x = 70 + ((i * 137 + seed * 19) % 850);
    const y = 92 + ((i * 83 + seed * 11) % 390);
    const w = 80 + ((i * 47 + seed) % 170);
    const h = 42 + ((i * 61 + seed) % 120);
    const rx = 6 + ((i + seed) % 18);
    const fill = i % 3 === 0 ? accent : i % 3 === 1 ? soft : "#ffffff";
    const opacity = i % 3 === 0 ? "0.2" : i % 3 === 1 ? "0.78" : "0.92";
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" opacity="${opacity}" stroke="${line}" stroke-width="2"/>`;
  }).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="628" viewBox="0 0 1200 628" role="img" aria-labelledby="title desc">
  <title id="title">${title} ${kind}</title>
  <desc id="desc">${subtitle}</desc>
  <rect width="1200" height="628" fill="${bg}"/>
  <rect x="44" y="44" width="1112" height="540" rx="26" fill="#ffffff" stroke="${line}" stroke-width="4"/>
  ${shapes}
  <text x="86" y="122" fill="${accent}" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="850">${esc(testCase.inspiration.key)}</text>
  <text x="86" y="458" fill="${ink}" font-family="Inter, Arial, sans-serif" font-size="68" font-weight="900">${title}</text>
  <text x="86" y="518" fill="${ink}" opacity="0.72" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="650">${subtitle}</text>
</svg>
`;
}

function buildLogoSvg(testCase) {
  const { ink, accent, soft } = testCase.palette;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120" role="img" aria-label="${esc(testCase.company)} logo">
  <rect width="320" height="120" rx="18" fill="#ffffff"/>
  <circle cx="58" cy="60" r="30" fill="${soft}"/>
  <path d="M44 60h28M58 46v28" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
  <text x="104" y="71" fill="${ink}" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="900">${esc(testCase.company)}</text>
</svg>
`;
}

function buildLicenseNotes(testCase) {
  return `# ${testCase.company} License Notes

Status: Architect-owned generated React fixture.

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
await mkdir(path.join(root, "public", "pages"), { recursive: true });
await mkdir(path.join(root, "src", "data"), { recursive: true });

const cases = buildCases();
const paulledemonCases = buildPaulledemonCases();

async function writePageArtifacts(testCase, licenseNotes) {
  const pageRoot = path.join(root, "pages", testCase.id);
  const publicAssetRoot = path.join(root, "public", "pages", testCase.id, "assets");
  await mkdir(pageRoot, { recursive: true });
  await mkdir(publicAssetRoot, { recursive: true });

  await writeJson(path.join(pageRoot, "page.json"), {
    id: testCase.id,
    number: testCase.number,
    title: testCase.title ?? testCase.company,
    company: testCase.company,
    tagline: testCase.tagline,
    vertical: testCase.vertical,
    archetype: testCase.archetype,
    route: testCase.route,
    url: testCase.url,
    status: testCase.status ?? "generated-placeholder",
    deployMode: testCase.deployMode ?? "vite-react-route",
    sourceType: testCase.sourceType,
    licenseStatus: testCase.licenseStatus,
    source: testCase.source,
    inspiration: testCase.inspiration,
    layoutFamily: testCase.layoutFamily,
    heroKind: testCase.heroKind,
    navKind: testCase.navKind,
    density: testCase.density,
    sections: testCase.sections,
    layoutSignature: testCase.layoutSignature,
    sourcePath: testCase.source ? testCase.source.sourcePath : "src/data/generated-pages.js",
    assets: testCase.assets,
  });
  await writeFile(path.join(pageRoot, "license-notes.md"), licenseNotes(testCase));
  await writeFile(path.join(publicAssetRoot, "logo.svg"), buildLogoSvg(testCase));
  await writeFile(path.join(publicAssetRoot, "hero.svg"), buildAssetSvg(testCase, "hero"));
  await writeFile(path.join(publicAssetRoot, "product.svg"), buildAssetSvg(testCase, "product"));
}

function manifestPage(testCase) {
  return {
    id: testCase.id,
    number: testCase.number,
    title: testCase.title ?? testCase.company,
    company: testCase.company,
    tagline: testCase.tagline,
    route: testCase.route,
    url: testCase.url,
    sourcePath: testCase.source ? testCase.source.sourcePath : `src/data/generated-pages.js#${testCase.id}`,
    metadataPath: `pages/${testCase.id}/page.json`,
    licensePath: `pages/${testCase.id}/license-notes.md`,
    previewImage: urlFor(testCase.previewImagePath),
    previewImagePath: testCase.previewImagePath,
    localAssets: [
      testCase.assets.logo,
      testCase.assets.hero,
      testCase.assets.product,
    ],
    vertical: testCase.vertical,
    archetype: testCase.archetype,
    layoutFamily: testCase.layoutFamily,
    heroKind: testCase.heroKind,
    navKind: testCase.navKind,
    density: testCase.density,
    sections: testCase.sections,
    layoutSignature: testCase.layoutSignature,
    status: testCase.status ?? "generated-placeholder",
    deployMode: testCase.deployMode ?? "vite-react-route",
    sourceType: testCase.sourceType,
    licenseStatus: testCase.licenseStatus,
    inspiration: testCase.inspiration,
    ...(testCase.source ? { source: testCase.source } : {}),
  };
}

await rm(path.join(root, "pages"), { recursive: true, force: true });
await rm(path.join(root, "public"), { recursive: true, force: true });
await mkdir(path.join(root, "pages"), { recursive: true });
await mkdir(path.join(root, "public", "pages"), { recursive: true });
await mkdir(path.join(root, "src", "data"), { recursive: true });

for (const testCase of cases) {
  await writePageArtifacts(testCase, buildLicenseNotes);
}

for (const testCase of paulledemonCases) {
  await writePageArtifacts(testCase, buildSourceBackedLicenseNotes);
}

await writeFile(
  path.join(root, "src", "data", "generated-pages.js"),
  `// Generated by scripts/generate-corpus.mjs. Do not edit by hand.\n` +
    `export const generatedAt = ${JSON.stringify(generatedAt)};\n` +
    `export const baseUrl = ${JSON.stringify(baseUrl)};\n` +
    `export const sourceReferences = ${JSON.stringify(sourceReferences, null, 2)};\n` +
    `export const pages = ${JSON.stringify(cases, null, 2)};\n`,
);

await writeFile(
  path.join(root, "src", "data", "source-backed-pages.js"),
  `// Generated by scripts/generate-corpus.mjs. Do not edit by hand.\n` +
    `export const generatedAt = ${JSON.stringify(generatedAt)};\n` +
    `export const batch = ${JSON.stringify(paulledemonSource.batch)};\n` +
    `export const source = ${JSON.stringify(paulledemonSource, null, 2)};\n` +
    `export const pages = ${JSON.stringify(paulledemonCases, null, 2)};\n`,
);

await writeJson(path.join(root, "public", "manifest.json"), {
  generatedAt,
  baseUrl,
  corpus: "landing-page-source-inspirations",
  runtime: "vite-react-tailwind-worker",
  count: cases.length,
  sourceReferences,
  pages: cases.map(manifestPage),
});

await writeJson(path.join(root, "public", "manifest.paulledemon-vite-20.json"), {
  generatedAt,
  baseUrl,
  corpus: "landing-page-source-inspirations",
  runtime: "vite-react-tailwind-worker",
  batch: paulledemonSource.batch,
  count: paulledemonCases.length,
  source: paulledemonSource,
  pages: paulledemonCases.map(manifestPage),
});

console.log(`Generated ${cases.length} React landing-page source fixtures and ${paulledemonCases.length} PaulleDemon Vite routes`);
