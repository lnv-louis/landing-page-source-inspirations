# Landing Page Source Inspirations

Deployable source corpus for Architect page canonicalisation and external analytics evals.

This repo owns the hosted page corpus and now serves **actual vendored landing page source folders**, not JSON-recreated landing pages.

```txt
landing-page-source-inspirations
  src/                         # Vite + React index app only
  src/data/source-backed-pages.js
  vendor/paulledemon-awesome-landing-pages/source/
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

The default public corpus is the `paulledemon-vite-20` batch:

- 20 manifest entries.
- 20 source-backed routes.
- Each route serves copied upstream static HTML/CSS/JS from the vendored PaulleDemon template folder.
- React is used for the root index page, not to recreate the landing pages.

Each page bundle has:

- `pages/<page-id>/page.json` with source, route, vertical, page type, and provenance metadata.
- `pages/<page-id>/license-notes.md` with license and usage notes.
- `public/pages/<page-id>/index.html` copied from the upstream template folder and lightly transformed for corpus hosting.
- `public/pages/<page-id>/architect-preview.svg` for index/manifest preview display.
- A route at `/pages/<page-id>/` served as the actual static source page by Cloudflare Worker assets.

`/manifest.json` and `/manifest.paulledemon-vite-20.json` currently contain the same 20-page source-backed corpus.

## Source Provenance

The upstream source repo is vendored once at:

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

## HTML Transformations

Generation copies each selected upstream folder into `public/pages/<page-id>/` and applies only hosting-safe changes:

- Injects `<base href="/pages/<page-id>/">` so relative assets resolve correctly.
- Injects corpus provenance meta tags.
- Removes placeholder Google Analytics snippets from copied templates.
- Adds `architect-preview.svg`.

The original upstream folders remain available under `vendor/` for review and provenance.

## Validation Checks

`npm run validate` checks:

- 20 manifest entries.
- Every entry is `source-backed`.
- Every entry deploys as `vendored-static-html`.
- Every entry points to the PaulleDemon GitHub repo and MIT license.
- Every vendored source folder and copied `public/pages/<page-id>/index.html` exists.
- Every copied HTML page has corpus meta markers and a route-local `<base>` tag.
- Placeholder Google Analytics snippets are removed.
- The root React index renders and links to `/manifest.json`.

## Live URL

The intended Worker project is:

```txt
https://architect-canon-evals-worker.architect-analytics-eval.workers.dev/
```
