# Landing Page Source Inspirations

Deployable source corpus for Architect page canonicalisation and external analytics evals.

This repo owns the hosted page corpus and serves **source-backed landing page/starter references**, not JSON-recreated landing pages.

```txt
landing-page-source-inspirations
  src/                         # Vite + React index app only
  src/data/source-backed-pages.js
  vendor/paulledemon-awesome-landing-pages/source/
  vendor/bcms-starters/source/
  pages/<page-id>/page.json
  pages/<page-id>/license-notes.md
  public/pages/<page-id>/index.html
  public/pages/<page-id>/{css,assets,scripts,...}
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

The default public corpus is `source-backed-landing-pages-30`:

- 30 manifest entries.
- 20 PaulleDemon source-backed static HTML routes.
- 10 BCMS Astro starter source routes.
- Each hosted route includes a neutral `#source-interactions` fixture set with many buttons, links, form fields, selects, radios, checkboxes, tabs, and disclosures for canonical mapping / external analytics extraction.
- React is used for the root index page, not to recreate the source pages.

Each page bundle has:

- `pages/<page-id>/page.json` with source, route, vertical, page type, and provenance metadata.
- `pages/<page-id>/license-notes.md` with license and usage notes.
- `public/pages/<page-id>/index.html` for the hosted corpus route.
- `public/pages/<page-id>/architect-preview.svg` fallback preview.
- Real copied preview assets where available, referenced by `previewImagePath` in the manifest.
- A route at `/pages/<page-id>/` served by Cloudflare Worker assets.

Available manifests:

- `/manifest.json` — all 30 pages.
- `/manifest.paulledemon-vite-20.json` — the 20 PaulleDemon pages.
- `/manifest.bcms-astro-starters-10.json` — the 10 BCMS Astro starter pages.

## Source Provenance

### PaulleDemon awesome landing pages

Vendored path:

```txt
vendor/paulledemon-awesome-landing-pages/source
```

Source repo:

```txt
https://github.com/PaulleDemon/awesome-landing-pages
```

Vendored commit:

```txt
e98eb80c593b8cd28d1f39556ccdda160a932581
```

License:

```txt
MIT
```

Selected template folders:

1. `src/saas/pixaai` — Pixa AI
2. `src/saas/SaaSyDark` — SaaSy Dark
3. `src/saas/SaaS-AI` — SaaS AI
4. `src/saas/finance` — Finance SaaS
5. `src/saas/CelestialSaaS` — Celestial SaaS
6. `src/apps/AISales` — AI Sales App
7. `src/apps/chatorigin` — Chat Origin
8. `src/apps/navigator` — Navigator
9. `src/apps/traveler` — Traveler
10. `src/law/lawfire` — Law Fire
11. `src/law/lawgroup` — Law Group
12. `src/realestate/brickproperty` — Brick Property
13. `src/ngo/project-africa` — Project Africa
14. `src/restaurant/bistro` — Bistro Restaurant
15. `src/restaurant/nutrio` — Nutrio Restaurant
16. `src/others/carwash` — Car Wash
17. `src/portfolio/Jamie-portfolio` — Jamie Developer
18. `src/portfolio/jrdev` — JrDev Portfolio
19. `src/portfolio/bella` — Bella Youtuber
20. `src/portfolio/notion` — Notion Themed Portfolio

### BCMS starters

Vendored path:

```txt
vendor/bcms-starters/source
```

Source repo:

```txt
https://github.com/bcms/starters
```

Vendored commit:

```txt
fef4e1f24043a72418679b3cccc43a9d522f1055
```

Usage mode:

```txt
stored-source
```

The BCMS Astro starters require BCMS content/type generation before they can build as full applications. This corpus stores the real upstream starter source and hosts a static source/provenance preview page using copied starter public assets plus the shared interaction fixture set.

Selected starter folders:

1. `astro/agency` — BCMS Astro Agency
2. `astro/blog` — BCMS Astro Blog
3. `astro/conference` — BCMS Astro Conference
4. `astro/e-commerce` — BCMS Astro E-commerce
5. `astro/job-board` — BCMS Astro Job Board
6. `astro/personal` — BCMS Astro Personal
7. `astro/podcast` — BCMS Astro Podcast
8. `astro/recipes` — BCMS Astro Recipes
9. `astro/restaurant` — BCMS Astro Restaurant
10. `astro/simple-blog` — BCMS Astro Simple Blog

## HTML Transformations

Generation copies source-backed content into `public/pages/<page-id>/` and applies hosting/eval-safe changes:

- Injects corpus provenance meta tags.
- Injects `<base href="/pages/<page-id>/">` for PaulleDemon static HTML so relative assets resolve correctly.
- Removes placeholder Google Analytics snippets from copied templates.
- Removes external script and external stylesheet tags from copied templates.
- Forces local `./css/tailwind-build.css` for PaulleDemon pages where needed.
- Adds a neutral `#source-interactions` fixture section to every hosted page so sparse inspiration pages still have enough trackable interactions.
- Adds `architect-preview.svg` fallback previews and real copied preview images where available.

The original upstream folders remain available under `vendor/` for review and provenance.

## Validation Checks

`npm run validate` checks:

- 30 manifest entries across both source batches.
- Every entry is `source-backed`.
- Every entry points to a vendored upstream source path.
- Every generated page has page metadata and license notes.
- Every hosted page has corpus meta markers.
- Placeholder Google Analytics snippets are removed.
- External script and external stylesheet tags are removed.
- Every page includes `#source-interactions` with many `data-corpus-event` and `data-canonical-action` targets.
- The root React index renders and links to `/manifest.json`.

## Live URL

The intended Worker project is:

```txt
https://architect-canon-evals-worker.architect-analytics-eval.workers.dev/
```
