# Plan: HTML LPA dashboard

## Status

Scaffolded 2026-05-18. No implementation yet.

## Build order

1. [ ] `index.html` table shell with Tailwind via CDN.
2. [ ] `sample.js` — fallback dataset for offline / standalone use.
3. [ ] `api.js` — `fetch` wrapper with sample-data fallback when the
       back-end is unreachable.
4. [ ] Alpine.js sorting and filtering controls.
5. [ ] Inline drilldown row showing fired rules and flags per LPA.
6. [ ] Print stylesheet for case-file printout.

## Why static HTML

Solicitors and case-managers running the Loco backend on a local machine
benefit from a dashboard they can open without installing Node or pnpm.
The static dashboard also serves as the visual reference for the
SvelteKit dashboard build.
