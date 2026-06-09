# Landing Page Source Inspirations

Deployable source corpus for Architect page canonicalisation evals.

This repo owns the hosted page corpus:

```txt
landing-page-source-inspirations
  pages/<page-id>/source/index.html
  pages/<page-id>/source/assets/*
  pages/<page-id>/page.json
  pages/<page-id>/license-notes.md
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
npm run deploy
```

## Corpus Contract

Each page bundle has:

- `page.json` with source, ICP, route, layout, and asset metadata.
- `license-notes.md` with provenance and usage notes.
- `source/index.html` as the runnable page.
- `source/assets/` containing page-local images/SVGs.

The current corpus is Architect-owned generated source inspired by public landing-page patterns. It does not vendor third-party templates yet. If we clone or copy upstream template source later, the page bundle should record the upstream URL, license, and audit status before it is included in the deployed manifest.

## Live URL

The intended Worker project is:

```txt
https://architect-canon-evals-worker.architect-analytics-eval.workers.dev/
```
