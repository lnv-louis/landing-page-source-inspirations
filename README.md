# Landing Page Source Inspirations

Deployable source corpus for Architect page canonicalisation and external analytics evals.

This repo owns a hosted corpus of **real, clickable landing-page websites copied from open-source projects**. It does not generate proxy pages for missing CMS/framework refs and does not add synthetic interaction sections.

```txt
landing-page-source-inspirations
  src/                         # Vite + React index app only
  src/data/source-backed-pages.js
  vendor/paulledemon-awesome-landing-pages/source/
  vendor/awesome-landing-page-sources/
  pages/<page-id>/page.json
  pages/<page-id>/license-notes.md
  public/pages/<page-id>/index.html
  public/pages/<page-id>/{css,assets,scripts,...}
  public/manifest.json
  dist/
  wrangler.toml
```

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

The default public corpus is `source-backed-saas-tech-26`:

- 26 manifest entries.
- 20 PaulleDemon hosted static templates.
- 6 SaaS/tech/software pages selected from projects linked by `nordicgiant2/awesome-landing-page`.
- Each route hosts real upstream HTML/assets that can be clicked directly.
- React is used for the root index page, not to recreate the source pages.

Single source-of-truth manifest:

- `/manifest.json` — all 26 pages.

Do not add batch-specific public manifests; consumers should read only `/manifest.json`.

## Source Provenance

### PaulleDemon awesome landing pages

- Source repo: `https://github.com/PaulleDemon/awesome-landing-pages`
- Vendored commit: `e98eb80c593b8cd28d1f39556ccdda160a932581`
- Vendored path: `vendor/paulledemon-awesome-landing-pages/source`
- License: MIT

### Awesome Landing Page linked repos

Candidate list reviewed from:

```txt
https://github.com/nordicgiant2/awesome-landing-page
```

Only directly hostable SaaS / app / developer-tool / software pages were added. Framework starters requiring CMS/content generation or missing refs were skipped.

Vendored under:

```txt
vendor/awesome-landing-page-sources/
```

Added linked repos:

1. `wonderfullandingpage/Technology-LandingPage` — SaaS/admin-dashboard React build output from `docs/`.
2. `amiechen/codrops-scribbler` — developer-tool/docs static landing page.
3. `xriley/AppKit-Landing-Theme` — app/startup static landing page.
4. `tailwindtoolbox/Landing-Page` — Tailwind SaaS/product static landing page.
5. `StartBootstrap/startbootstrap-new-age` — app/product static build output from `dist/`.
6. `coala/landing-frontend` — developer-tool project static landing page.

## HTML Transformations

Generation copies each selected static root into `public/pages/<page-id>/` and applies only hosting-safe changes:

- Injects `<base href="/pages/<page-id>/">` so relative assets resolve correctly.
- Injects corpus provenance meta tags.
- Removes placeholder Google Analytics snippets from copied templates.
- For PaulleDemon pages only, fixes the local Tailwind CSS link where the copied page referenced a runtime placeholder.
- Adds `architect-preview.svg` fallback previews and prefers real copied public images for manifest/index previews.

The original upstream folders remain available under `vendor/` for review and provenance.

## Validation Checks

`npm run validate` checks:

- 26 manifest entries.
- Every entry is `source-backed` and `vendored-static-html`.
- Every entry points to a GitHub source repo and vendored source path.
- Every copied public route has an `index.html` with corpus provenance metadata.
- No synthetic interaction sections are present.
- Placeholder Google Analytics snippets are removed.
- The root React index renders and links to `/manifest.json`.

## Live URL

The intended Worker project is:

```txt
https://architect-canon-evals-worker.architect-analytics-eval.workers.dev/
```
