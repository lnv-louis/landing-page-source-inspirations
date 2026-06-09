# Landing Page Source Inspirations

Deployable source corpus for Architect page canonicalisation evals.

This repo owns the hosted page corpus:

```txt
landing-page-source-inspirations
  src/                         # Vite + React + Tailwind + shadcn-style renderer
  src/data/generated-pages.js   # Generated page specs consumed by the app
  pages/<page-id>/page.json
  pages/<page-id>/license-notes.md
  public/pages/<page-id>/assets/*
  public/manifest.json
  dist/
  wrangler.toml
```

The companion eval harness lives in:

```txt
experiments-and-data/page-canonicalisation-eval-corpus
```

That harness should consume this repo's deployed `/manifest.json`, run Stagehand, and store outputs/reports/scores.

## Commands

```sh
npm install
npm run generate
npm run validate
npm run build
npm run dev
npm run deploy
```

## Corpus Contract

Each page bundle has:

- `page.json` with ICP, route, layout, source, and asset metadata.
- `license-notes.md` with provenance and usage notes.
- React source rendered by `src/components/landing-page.jsx` from `src/data/generated-pages.js`.
- `public/pages/<page-id>/assets/` containing page-local images/SVGs.
- A route at `/pages/<page-id>/` served by the Cloudflare Worker SPA fallback.

The current corpus is Architect-owned generated React source inspired by public landing-page patterns. It does not vendor third-party templates yet. If we clone or copy upstream template source later, the page bundle should record the upstream URL, license, and audit status before it is included in the deployed manifest.

Validation checks:

- 100 manifest entries.
- 100 unique layout signatures.
- 100 unique server-rendered React page snapshots.
- Page-local logo, hero, and product assets.
- No legacy `pages/<page-id>/source/index.html` files.

## Live URL

The intended Worker project is:

```txt
https://architect-canon-evals-worker.architect-analytics-eval.workers.dev/
```
