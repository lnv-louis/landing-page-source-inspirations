import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Boxes,
  Check,
  ChevronRight,
  Code2,
  FileText,
  Layers3,
  Lock,
  Play,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import React from "react";
import { Badge } from "./ui/badge.jsx";
import { Button } from "./ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card.jsx";
import { cn } from "../lib/utils.js";

const layoutComponents = {
  "split-proof": SplitProofPage,
  "centered-terminal": CenteredTerminalPage,
  "sidebar-docs": SidebarDocsPage,
  "pricing-matrix": PricingMatrixPage,
  "comparison-ledger": ComparisonLedgerPage,
  "workflow-lane": WorkflowLanePage,
  "dashboard-first": DashboardFirstPage,
  "card-catalog": CardCatalogPage,
  "editorial-report": EditorialReportPage,
  "event-agenda": EventAgendaPage,
  "calculator-form": CalculatorFormPage,
  "case-study-narrative": CaseStudyNarrativePage,
  "developer-console": DeveloperConsolePage,
  "procurement-checklist": ProcurementChecklistPage,
  "marketplace-shelf": MarketplaceShelfPage,
  "migration-timeline": MigrationTimelinePage,
  "benchmark-grid": BenchmarkGridPage,
  "announcement-stack": AnnouncementStackPage,
  "industry-map": IndustryMapPage,
  "demo-form-panel": DemoFormPanelPage,
};

export function LandingPage({ page }) {
  const Layout = layoutComponents[page.layoutFamily] ?? SplitProofPage;

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-ink)]">
      <PageTheme page={page} />
      <Layout page={page} />
    </div>
  );
}

function PageTheme({ page }) {
  return (
    <style>
      {`:root {
        --page-bg: ${page.palette.bg};
        --page-ink: ${page.palette.ink};
        --page-accent: ${page.palette.accent};
        --page-soft: ${page.palette.soft};
        --page-line: ${page.palette.line};
      }`}
    </style>
  );
}

function TopNav({ page, mode = "default" }) {
  const links = ["Product", "Solutions", "Docs", "Pricing"];

  return (
    <header
      className={cn(
        "relative z-20 border-b border-[var(--page-line)] bg-white/85 px-4 py-3 backdrop-blur md:px-8",
        mode === "rail" && "md:grid md:grid-cols-[220px_minmax(0,1fr)_auto]",
        mode === "center" && "text-center",
      )}
      data-root-key="navigation"
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3",
          mode === "rail" && "contents",
        )}
      >
        <a className="flex min-w-0 items-center gap-2 font-black" href="/">
          <img
            alt=""
            className="h-8 w-auto rounded"
            src={page.assets.logo}
          />
          <span className="truncate">{page.company}</span>
        </a>
        <nav
          className={cn(
            "flex flex-wrap items-center gap-1 text-sm font-semibold text-slate-500",
            mode === "center" && "justify-center",
          )}
        >
          {links.map((link) => (
            <a
              className="rounded-md px-3 py-2 hover:bg-slate-100 hover:text-slate-950"
              href={`#${link.toLowerCase()}`}
              key={link}
            >
              {link}
            </a>
          ))}
        </nav>
        <Button asChild size="sm" variant="default">
          <a href="#conversion">{page.primaryCta}</a>
        </Button>
      </div>
    </header>
  );
}

function HeroCopy({ align = "left", eyebrow, page, title }) {
  return (
    <div
      className={cn(
        "grid max-w-3xl gap-5",
        align === "center" && "mx-auto justify-items-center text-center",
      )}
    >
      <Badge className="border-[var(--page-line)] bg-white/80 text-[var(--page-accent)]">
        {eyebrow ?? `${page.vertical} · ${page.archetype}`}
      </Badge>
      <h1 className="text-5xl font-black leading-[0.96] tracking-normal md:text-7xl">
        {title ?? page.tagline}.
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-slate-600">
        {page.company} is a SaaS landing-page fixture for canonicalisation and
        external analytics evals, with distinct roots, action targets, and
        local page assets.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="lg">
          <a href="#conversion">
            {page.primaryCta}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <a href="#product">{page.secondaryCta}</a>
        </Button>
      </div>
    </div>
  );
}

function PreviewImage({ page, type = "hero", className }) {
  return (
    <figure className={cn("min-w-0", className)}>
      <img
        alt={`${page.company} ${type} preview`}
        className="w-full rounded-lg border border-[var(--page-line)] bg-white object-cover shadow-2xl shadow-slate-900/10"
        src={type === "product" ? page.assets.product : page.assets.hero}
      />
    </figure>
  );
}

function ConversionPanel({ page, variant = "default" }) {
  return (
    <section
      className={cn(
        "grid gap-6 bg-slate-950 px-4 py-14 text-white md:px-8",
        variant === "inline" && "rounded-lg px-6 md:px-8",
      )}
      data-root-key="conversion"
      id="conversion"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-[minmax(0,1fr)_420px] md:items-center">
        <div>
          <p className="text-sm font-black uppercase text-teal-300">
            Conversion target
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-normal md:text-5xl">
            Route the right account to the right next action.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            This form and CTA neighborhood gives the eval harness clear action
            targets to bind back to a canonical root.
          </p>
        </div>
        <form className="grid gap-3 rounded-lg border border-white/10 bg-white p-4 text-slate-950">
          <input
            aria-label="Work email"
            className="h-11 rounded-md border border-slate-200 px-3 outline-none ring-teal-600 focus:ring-2"
            placeholder="name@company.com"
          />
          <select
            aria-label="Company size"
            className="h-11 rounded-md border border-slate-200 px-3 outline-none ring-teal-600 focus:ring-2"
          >
            <option>51-250 employees</option>
            <option>251-1000 employees</option>
            <option>1000+ employees</option>
          </select>
          <Button type="button" variant="accent">
            {page.primaryCta}
          </Button>
        </form>
      </div>
    </section>
  );
}

function SectionDeck({ page, tone = "cards" }) {
  const sections = page.sections.slice(1, 5);

  return (
    <section
      className="px-4 py-14 md:px-8"
      data-component-key={`${page.layoutFamily}-section-deck`}
      id="product"
    >
      <div
        className={cn(
          "mx-auto grid max-w-7xl gap-4",
          tone === "columns" && "md:grid-cols-4",
          tone === "cards" && "md:grid-cols-2 xl:grid-cols-4",
          tone === "stack" && "max-w-4xl",
        )}
      >
        {sections.map((section, index) => (
          <Card
            className={cn(
              "bg-white/88",
              tone === "stack" && "grid md:grid-cols-[180px_minmax(0,1fr)]",
            )}
            data-section-key={section}
            key={section}
          >
            <CardHeader>
              <Badge>{String(index + 1).padStart(2, "0")}</Badge>
              <CardTitle>{labelize(section)}</CardTitle>
              <CardDescription>
                {page.company} uses this root to test {page.archetype} page
                canonicalisation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--page-accent)]"
                href="#conversion"
              >
                Open action <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function SplitProofPage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section
          className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)] md:px-8"
          data-root-key="hero"
        >
          <HeroCopy page={page} />
          <PreviewImage page={page} />
        </section>
        <ProofBar page={page} />
        <SectionDeck page={page} />
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function CenteredTerminalPage({ page }) {
  return (
    <>
      <TopNav mode="center" page={page} />
      <main>
        <section className="px-4 py-16 text-center md:px-8" data-root-key="hero">
          <HeroCopy align="center" page={page} title={`Run ${page.company} from one command center`} />
          <div className="mx-auto mt-10 max-w-5xl rounded-lg border border-slate-800 bg-slate-950 p-4 text-left text-sm text-slate-100 shadow-2xl">
            <p className="text-teal-300">$ {page.company.toLowerCase()} observe --roots --actions</p>
            <pre className="mt-4 overflow-x-auto leading-7">{`navigation.root -> header.primary
hero.root -> ${page.heroKind}
conversion.root -> form.${page.primaryCta.toLowerCase().replaceAll(" ", "_")}`}</pre>
          </div>
        </section>
        <SectionDeck page={page} tone="columns" />
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function SidebarDocsPage({ page }) {
  return (
    <div className="grid min-h-screen md:grid-cols-[270px_minmax(0,1fr)]">
      <aside className="border-r border-[var(--page-line)] bg-white px-4 py-5" data-root-key="navigation">
        <a className="flex items-center gap-2 font-black" href="/">
          <img alt="" className="h-8 rounded" src={page.assets.logo} />
          {page.company}
        </a>
        <nav className="mt-8 grid gap-1 text-sm font-semibold text-slate-600">
          {["Quickstart", "API", "Components", "Security", "Examples"].map((item) => (
            <a className="rounded-md px-3 py-2 hover:bg-slate-100" href={`#${item.toLowerCase()}`} key={item}>
              {item}
            </a>
          ))}
        </nav>
      </aside>
      <main>
        <section className="grid gap-8 px-4 py-14 md:grid-cols-[minmax(0,1fr)_360px] md:px-8" data-root-key="hero">
          <HeroCopy eyebrow="Developer docs" page={page} title={`${page.company} implementation docs`} />
          <DocCard page={page} />
        </section>
        <CodeSection page={page} />
        <SectionDeck page={page} tone="stack" />
        <ConversionPanel page={page} />
      </main>
    </div>
  );
}

function PricingMatrixPage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="px-4 py-14 md:px-8" data-root-key="hero">
          <HeroCopy align="center" eyebrow="Pricing" page={page} title={`Plans for every ${page.vertical.replaceAll("-", " ")} motion`} />
          <div className="mx-auto mt-10 grid max-w-6xl gap-3 md:grid-cols-3">
            {["Starter", "Scale", "Enterprise"].map((plan, index) => (
              <Card
                className={cn(index === 1 && "border-[var(--page-accent)] shadow-xl")}
                data-section-key={page.sections[index + 1] ?? `pricing-${plan}`}
                key={plan}
              >
                <CardHeader>
                  <CardTitle>{plan}</CardTitle>
                  <CardDescription>{page.company} {page.archetype} package</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <p className="text-3xl font-black">—</p>
                  <Button variant={index === 1 ? "accent" : "secondary"}>Request quote</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <ComparisonTable page={page} />
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function ComparisonLedgerPage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="grid gap-8 px-4 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-8" data-root-key="hero">
          <HeroCopy eyebrow="Comparison" page={page} title={`${page.company} versus fragmented workflows`} />
          <ComparisonTable page={page} compact />
        </section>
        <SectionDeck page={page} tone="columns" />
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function WorkflowLanePage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="px-4 py-16 md:px-8" data-root-key="hero">
          <HeroCopy page={page} title={`A workflow lane for ${page.vertical.replaceAll("-", " ")}`} />
          <div className="mt-10 grid gap-3 md:grid-cols-4">
            {page.sections.slice(0, 4).map((section, index) => (
              <Card className="relative min-h-52" data-section-key={section} key={section}>
                <CardHeader>
                  <Workflow aria-hidden="true" className="h-5 w-5 text-[var(--page-accent)]" />
                  <CardTitle>{labelize(section)}</CardTitle>
                  <CardDescription>Step {index + 1} in the GTM workflow.</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function DashboardFirstPage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="grid gap-8 px-4 py-14 md:grid-cols-[0.7fr_1.3fr] md:px-8" data-root-key="hero">
          <HeroCopy page={page} title={`${page.company} starts with the operating dashboard`} />
          <div className="grid gap-3">
            <PreviewImage page={page} />
            <MetricStrip page={page} />
          </div>
        </section>
        <SectionDeck page={page} tone="cards" />
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function CardCatalogPage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="px-4 py-14 md:px-8" data-root-key="hero">
          <HeroCopy page={page} title={`${page.company} catalogues every buyer path`} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {page.sections.map((section) => (
              <Card data-section-key={section} key={section}>
                <CardHeader>
                  <Boxes aria-hidden="true" className="h-5 w-5 text-[var(--page-accent)]" />
                  <CardTitle>{labelize(section)}</CardTitle>
                  <CardDescription>{page.vertical} source fixture root.</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function EditorialReportPage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <article>
        <section className="mx-auto max-w-4xl px-4 py-16 md:px-8" data-root-key="hero">
          <Badge>Field report</Badge>
          <h1 className="mt-5 text-5xl font-black leading-none md:text-7xl">
            {page.tagline}.
          </h1>
          <p className="mt-6 text-xl leading-9 text-slate-600">
            This editorial layout exercises long-form SaaS pages, evidence
            blocks, inline links, and CTA neighborhoods.
          </p>
        </section>
        <section className="mx-auto grid max-w-5xl gap-5 px-4 pb-14 md:grid-cols-[220px_minmax(0,1fr)] md:px-8">
          <aside className="text-sm font-semibold text-slate-500">Report sections</aside>
          <div className="grid gap-6">
            {page.sections.slice(1, 5).map((section) => (
              <section className="border-t border-[var(--page-line)] pt-5" data-section-key={section} key={section}>
                <h2 className="text-3xl font-black">{labelize(section)}</h2>
                <p className="mt-3 leading-7 text-slate-600">{page.company} maps this narrative section to canonical roots for buyer education.</p>
              </section>
            ))}
          </div>
        </section>
        <ConversionPanel page={page} />
      </article>
      <Footer page={page} />
    </>
  );
}

function EventAgendaPage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="grid gap-8 bg-slate-950 px-4 py-16 text-white md:grid-cols-[0.8fr_1.2fr] md:px-8" data-root-key="hero">
          <HeroCopy eyebrow="Virtual event" page={page} title={`${page.company} field briefing`} />
          <div className="grid gap-3">
            {["Opening", "Customer panel", "Technical clinic"].map((item, index) => (
              <Card
                className="bg-white/10 text-white"
                data-section-key={page.sections[index + 1] ?? `agenda-${item}`}
                key={item}
              >
                <CardHeader>
                  <CardTitle>{String(9 + index)}:00 · {item}</CardTitle>
                  <CardDescription className="text-white/70">Agenda item for {page.vertical} teams.</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
        <SectionDeck page={page} />
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function CalculatorFormPage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="grid gap-8 px-4 py-16 md:grid-cols-[minmax(0,1fr)_420px] md:px-8" data-root-key="hero">
          <HeroCopy eyebrow="Calculator" page={page} title={`Estimate the ${page.company} impact`} />
          <Card>
            <CardHeader>
              <CardTitle>Impact inputs</CardTitle>
              <CardDescription>No fabricated result; this is an eval form shell.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {["Monthly visitors", "Qualified accounts", "Sales-assisted pages"].map((label) => (
                <label className="grid gap-1 text-sm font-semibold" key={label}>
                  {label}
                  <input className="h-10 rounded-md border border-slate-200 px-3" placeholder="—" />
                </label>
              ))}
              <Button variant="accent">Calculate</Button>
            </CardContent>
          </Card>
        </section>
        <SectionDeck page={page} tone="columns" />
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function CaseStudyNarrativePage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="grid gap-8 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8" data-root-key="hero">
          <HeroCopy eyebrow="Customer story" page={page} title={`${page.company} implementation narrative`} />
          <PreviewImage page={page} type="product" />
        </section>
        <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-14 md:px-8">
          {page.sections.slice(1, 5).map((section, index) => (
            <Card className="grid md:grid-cols-[140px_minmax(0,1fr)]" data-section-key={section} key={section}>
              <CardHeader>
                <Badge>Part {index + 1}</Badge>
              </CardHeader>
              <CardHeader>
                <CardTitle>{labelize(section)}</CardTitle>
                <CardDescription>{page.company} captures source-page hierarchy for story-led pages.</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function DeveloperConsolePage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="grid gap-8 px-4 py-16 md:grid-cols-[minmax(0,1fr)_minmax(340px,0.95fr)] md:px-8" data-root-key="hero">
          <HeroCopy eyebrow="Developer console" page={page} title={`Build on ${page.company}`} />
          <CodeSection page={page} framed />
        </section>
        <SectionDeck page={page} tone="columns" />
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function ProcurementChecklistPage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="grid gap-8 px-4 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-8" data-root-key="hero">
          <HeroCopy eyebrow="Procurement" page={page} title={`${page.company} for security and buying committees`} />
          <div className="grid gap-3">
            {["Security review", "Legal review", "Technical fit", "Rollout plan"].map((item, index) => (
              <Card
                className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 p-4"
                data-section-key={page.sections[index + 1] ?? `procurement-${item}`}
                key={item}
              >
                <Check aria-hidden="true" className="h-5 w-5 text-[var(--page-accent)]" />
                <span className="font-semibold">{item}</span>
              </Card>
            ))}
          </div>
        </section>
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function MarketplaceShelfPage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="px-4 py-16 md:px-8" data-root-key="hero">
          <HeroCopy page={page} title={`${page.company} marketplace shelf`} />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["CRM", "Warehouse", "Support", "Security"].map((item) => (
              <Card className="min-h-56" data-section-key={`integration-${item}`} key={item}>
                <CardHeader>
                  <Layers3 aria-hidden="true" className="h-5 w-5 text-[var(--page-accent)]" />
                  <CardTitle>{item}</CardTitle>
                  <CardDescription>Integration cluster for {page.company}.</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
        <SectionDeck page={page} />
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function MigrationTimelinePage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="px-4 py-16 md:px-8" data-root-key="hero">
          <HeroCopy page={page} title={`Migrate to ${page.company} without breaking motion`} />
          <ol className="mt-10 grid gap-4 border-l-2 border-[var(--page-accent)] pl-5">
            {page.sections.slice(1, 6).map((section) => (
              <li className="relative rounded-lg border border-[var(--page-line)] bg-white p-4" data-section-key={section} key={section}>
                <span className="absolute -left-[30px] top-5 h-3 w-3 rounded-full bg-[var(--page-accent)]" />
                <h2 className="text-xl font-black">{labelize(section)}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Timeline root with nested action and proof content.</p>
              </li>
            ))}
          </ol>
        </section>
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function BenchmarkGridPage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="px-4 py-16 md:px-8" data-root-key="hero">
          <HeroCopy align="center" eyebrow="Benchmark" page={page} title={`${page.company} benchmark workspace`} />
          <div className="mx-auto mt-10 grid max-w-6xl gap-3 md:grid-cols-3">
            {["Coverage", "Latency", "Evidence", "Controls", "Review", "Rollout"].map((item) => (
              <Card data-section-key={`benchmark-${item}`} key={item}>
                <CardHeader>
                  <BarChart3 aria-hidden="true" className="h-5 w-5 text-[var(--page-accent)]" />
                  <CardTitle>{item}</CardTitle>
                  <CardDescription>Metric placeholder to confirm.</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function AnnouncementStackPage({ page }) {
  return (
    <>
      <TopNav mode="center" page={page} />
      <main>
        <section className="mx-auto grid max-w-5xl gap-5 px-4 py-16 text-center md:px-8" data-root-key="hero">
          <Badge className="mx-auto bg-[var(--page-soft)] text-[var(--page-accent)]">
            New launch
          </Badge>
          <h1 className="text-5xl font-black leading-none md:text-7xl">
            {page.company} launches for {page.vertical.replaceAll("-", " ")} teams.
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">
            A stacked announcement page with central CTA, proof notes, and
            dense follow-up sections.
          </p>
          <Button asChild className="mx-auto" size="lg">
            <a href="#conversion">
              Watch overview <Play aria-hidden="true" className="h-4 w-4" />
            </a>
          </Button>
        </section>
        <SectionDeck page={page} tone="stack" />
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function IndustryMapPage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="grid gap-8 px-4 py-16 md:grid-cols-[0.85fr_1.15fr] md:px-8" data-root-key="hero">
          <HeroCopy page={page} title={`${page.company} maps the ${page.vertical.replaceAll("-", " ")} landscape`} />
          <div className="grid grid-cols-2 gap-3">
            {["Buyer", "Data", "Security", "Ops"].map((item, index) => (
              <Card
                className="min-h-40 p-4"
                data-section-key={page.sections[index + 1] ?? `industry-${item}`}
                key={item}
              >
                <Sparkles aria-hidden="true" className="h-5 w-5 text-[var(--page-accent)]" />
                <h2 className="mt-4 text-xl font-black">{item}</h2>
              </Card>
            ))}
          </div>
        </section>
        <SectionDeck page={page} />
        <ConversionPanel page={page} />
      </main>
      <Footer page={page} />
    </>
  );
}

function DemoFormPanelPage({ page }) {
  return (
    <>
      <TopNav page={page} />
      <main>
        <section className="grid gap-8 px-4 py-16 md:grid-cols-[minmax(0,1fr)_430px] md:px-8" data-root-key="hero">
          <HeroCopy eyebrow="Demo request" page={page} title={`See ${page.company} on your own website`} />
          <ConversionPanel page={page} variant="inline" />
        </section>
        <SectionDeck page={page} tone="columns" />
      </main>
      <Footer page={page} />
    </>
  );
}

function ProofBar({ page }) {
  return (
    <section className="border-y border-[var(--page-line)] bg-white px-4 py-6 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-3">
        {[
          ["ICP", page.vertical],
          ["Layout", page.layoutFamily],
          ["Hero", page.heroKind],
        ].map(([label, value]) => (
          <div className="grid gap-1" key={label}>
            <span className="text-xs font-black uppercase text-slate-400">{label}</span>
            <strong className="text-lg">{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function ComparisonTable({ page, compact = false }) {
  return (
    <Card className={cn("overflow-hidden", compact && "self-start")}>
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-[var(--page-soft)]">
          <tr>
            <th className="border-b border-[var(--page-line)] p-3">Capability</th>
            <th className="border-b border-[var(--page-line)] p-3">{page.company}</th>
            <th className="border-b border-[var(--page-line)] p-3">Manual path</th>
          </tr>
        </thead>
        <tbody>
          {["Canonical roots", "Action targets", "Evidence bundle"].map((row, index) => (
            <tr data-section-key={page.sections[index + 1] ?? `comparison-${row}`} key={row}>
              <td className="border-b border-[var(--page-line)] p-3 font-semibold">{row}</td>
              <td className="border-b border-[var(--page-line)] p-3">Structured</td>
              <td className="border-b border-[var(--page-line)] p-3 text-slate-500">Ad hoc</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function CodeSection({ page, framed = false }) {
  const content = `await stagehand.observe("find primary CTAs for ${page.company}");\nawait stagehand.extract({ schema: CanonicalPageSchema });`;

  return (
    <section
      className={cn("px-4 py-12 md:px-8", framed && "p-0")}
      data-section-key="developer-console"
    >
      <pre className="overflow-x-auto rounded-lg bg-slate-950 p-5 text-sm leading-7 text-slate-50 shadow-xl">
        <code>{content}</code>
      </pre>
    </section>
  );
}

function DocCard({ page }) {
  return (
    <Card>
      <CardHeader>
        <BookOpen aria-hidden="true" className="h-5 w-5 text-[var(--page-accent)]" />
        <CardTitle>Implementation guide</CardTitle>
        <CardDescription>
          Docs-heavy fixture for sidebars, quickstarts, and dense navigation.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm font-semibold">
        {["Install", "Configure", "Verify", "Ship"].map((item) => (
          <a className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2" href="#conversion" key={item}>
            {item}
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </a>
        ))}
      </CardContent>
    </Card>
  );
}

function MetricStrip({ page }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        ["Roots", page.sections.length],
        ["Nav", page.navKind],
        ["Density", page.density],
      ].map(([label, value]) => (
        <Card className="p-4" key={label}>
          <p className="text-xs font-black uppercase text-slate-400">{label}</p>
          <p className="mt-2 text-xl font-black">{value}</p>
        </Card>
      ))}
    </div>
  );
}

function Footer({ page }) {
  return (
    <footer className="border-t border-[var(--page-line)] bg-white px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <span>{page.company}</span>
        <span>{page.inspiration.label}</span>
        <a className="font-semibold text-slate-950" href="/manifest.json">
          Manifest
        </a>
      </div>
    </footer>
  );
}

function labelize(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
