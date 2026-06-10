# JrDev Portfolio License Notes

Status: Source-backed static HTML copied from a vendored MIT template.

- Source repo: https://github.com/PaulleDemon/awesome-landing-pages
- Source commit: e98eb80c593b8cd28d1f39556ccdda160a932581
- Source folder: src/portfolio/jrdev
- Source URL: https://github.com/PaulleDemon/awesome-landing-pages/tree/main/src/portfolio/jrdev
- Vendored path: vendor/paulledemon-awesome-landing-pages/source/src/portfolio/jrdev
- License: MIT
- Usage mode: copied
- Deploy mode: vendored-static-html

The deployed corpus route at /pages/jrdev-portfolio/ serves the actual upstream template folder copied into this Vite/Cloudflare Worker host. The only HTML transformations are corpus metadata injection, a base URL for stable relative assets, removal of placeholder Google Analytics snippets, and route-local Tailwind CSS correction where required.
