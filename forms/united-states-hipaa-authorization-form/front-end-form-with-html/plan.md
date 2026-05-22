# Plan: front-end-form-with-html

Static single-page wizard for the 9-step HIPAA authorization. Loads
with no build step and persists draft state to `localStorage`.

## Build order

1. [x] Static HTML skeleton (`index.html`) with 9 stepped sections.
2. [x] Stylesheet (`css/style.css`) with print-friendly variant.
3. [x] Engine modules under `js/` mirroring the SvelteKit engine.
4. [x] Validity panel that re-runs on every change.
5. [ ] PDF download via `pdfmake` CDN.
6. [ ] Sensitive-category banner that surfaces 42 CFR Part 2 and
       state-specific HIV consent language when those categories are
       included.
7. [ ] Print stylesheet matching the Tennessee HS-2557 paper layout.
