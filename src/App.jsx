import React from "react";
import { RootIndex } from "./components/root-index.jsx";
import { LandingPage } from "./components/landing-page.jsx";
import { pages as generatedPages } from "./data/generated-pages.js";
import { pages as sourceBackedPages } from "./data/source-backed-pages.js";

const pages = [...generatedPages, ...sourceBackedPages];

function pageIdFromPath(pathname) {
  const match = pathname.match(/^\/pages\/([^/]+)\/?$/);
  return match?.[1] ?? null;
}

export function App({ pathname = window.location.pathname }) {
  const pageId = pageIdFromPath(pathname);
  const page = pageId ? pages.find((candidate) => candidate.id === pageId) : null;

  if (pageId && page) {
    return <LandingPage page={page} />;
  }

  if (pageId && !page) {
    return (
      <main className="mx-auto grid min-h-screen max-w-2xl place-items-center px-5 text-center">
        <div>
          <p className="text-sm font-semibold uppercase text-slate-500">
            Missing page
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-normal">
            This corpus route does not exist.
          </h1>
          <a
            className="mt-6 inline-flex h-10 items-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white"
            href="/"
          >
            Back to corpus
          </a>
        </div>
      </main>
    );
  }

  return <RootIndex pages={pages} />;
}
