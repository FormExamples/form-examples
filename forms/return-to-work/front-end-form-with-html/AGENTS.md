# Return to Work — static HTML form Agent Instructions

Plain-HTML alternative to the SvelteKit wizard, intended for sites
without a Node.js build pipeline. See [`index.md`](./index.md) for
the overview.

## Stack

- Single-file HTML5.
- Tailwind CSS 4 via CDN.
- Alpine.js 3.14.8.
- Plain ES modules for the engine.

## Conventions

- One continuous page; all 12 step sections rendered sequentially
  with anchor links and `x-show` for collapsed sections.
- The engine is a *port* of the TypeScript code in
  `../front-end-form-with-svelte/src/lib/engine/`. Keep them in
  sync; the TypeScript version is the source of truth.
- camelCase identifiers in JS (matching the TypeScript shape).

## Running

```sh
python3 -m http.server 8080
# open http://localhost:8080/index.html
```
