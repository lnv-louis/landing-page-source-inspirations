import { Grid2X2, List, Search } from "lucide-react";
import React from "react";
import { useMemo, useState } from "react";
import { Badge } from "./ui/badge.jsx";
import { Button } from "./ui/button.jsx";
import { Card, CardContent } from "./ui/card.jsx";
import { SegmentedControl } from "./ui/tabs.jsx";
import { cn } from "../lib/utils.js";

export function RootIndex({ pages }) {
  const [view, setView] = useState("grid");
  const [query, setQuery] = useState("");

  const filteredPages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return pages;

    return pages.filter((page) =>
      [
        page.title,
        page.vertical,
        page.pageType,
        page.source.sourcePath,
        page.source.repoUrl,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [pages, query]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5">
        <header className="grid gap-4 border-b border-slate-200 pb-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="grid gap-2">
            <Badge className="border-teal-200 bg-teal-50 text-teal-800">
              Architect eval corpus
            </Badge>
            <h1 className="max-w-4xl text-3xl font-semibold tracking-normal sm:text-5xl">
              {pages.length} source-backed SaaS/tech landing-page inspirations
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600">
              Vite + React + Tailwind source host for page canonicalisation and
              external analytics evals. Each route serves an actual hostable SaaS/tech/software landing page copied from vendored upstream source with provenance metadata.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="secondary">
              <a href="/manifest.json">Manifest</a>
            </Button>
            <SegmentedControl
              options={[
                { label: <Grid2X2 aria-hidden="true" className="h-4 w-4" />, value: "grid" },
                { label: <List aria-hidden="true" className="h-4 w-4" />, value: "list" },
              ]}
              onChange={setView}
              value={view}
            />
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <label className="relative block">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              className="h-11 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none ring-teal-600 transition focus:ring-2"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by company, vertical, layout, source..."
              value={query}
            />
          </label>
          <p className="text-sm font-medium text-slate-500">
            Showing {filteredPages.length} of {pages.length}
          </p>
        </section>

        <section
          className={cn(
            view === "grid"
              ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
              : "grid gap-2",
          )}
        >
          {filteredPages.map((page) => (
            <CorpusCard key={page.id} page={page} view={view} />
          ))}
        </section>
      </div>
    </main>
  );
}

function CorpusCard({ page, view }) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition hover:border-slate-300 hover:shadow-md",
        view === "list" && "grid grid-cols-[112px_minmax(0,1fr)]",
      )}
    >
      <a
        aria-label={`Open ${page.title}`}
        className={cn(
          "group relative block overflow-hidden bg-slate-100",
          view === "list" ? "h-full border-r border-slate-200" : "aspect-[1.91/1] border-b border-slate-200",
        )}
        href={page.route}
      >
        <iframe
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-50 border-0 bg-white transition duration-300 group-hover:scale-[0.52]",
            view === "list" && "h-[260%] w-[360%] scale-[0.28] group-hover:scale-[0.3]",
          )}
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          src={page.route}
          title={`${page.title} live preview`}
        />
        <span className="absolute inset-0 bg-gradient-to-t from-slate-950/10 via-transparent to-white/10 opacity-80 transition group-hover:opacity-40" />
      </a>
      <CardContent className="grid gap-3 p-4">
        <div className="grid gap-1">
          <a
            className="truncate text-base font-semibold leading-tight hover:underline"
            href={page.route}
          >
            {page.number}. {page.title}
          </a>
          <p className="line-clamp-2 text-sm leading-6 text-slate-500">
            {page.source.sourcePath}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge>{page.vertical}</Badge>
          <Badge>{page.pageType}</Badge>
          <Badge>{page.deployMode}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
