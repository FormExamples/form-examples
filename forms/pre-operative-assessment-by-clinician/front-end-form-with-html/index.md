# Pre-operative Assessment by Clinician — static HTML wizard

Single-page static HTML implementation of the clinician data-entry wizard,
built with plain HTML, CSS, and vanilla JavaScript — no framework, no build
step, no CDN. Produces an in-browser report and a printable PDF via the
browser's Print function.

## Stack

- HTML5 + CSS3 + vanilla JavaScript
- No server, no database — ideal for an air-gapped clinic workstation
- Each script is an IIFE publishing public symbols on
  `window.PreOperativeAssessmentByClinician`
- Form state autosaves to localStorage and is restored on reload

## Running

```sh
# From this directory:
python3 -m http.server 8080
```

Open <http://localhost:8080>.

The form also runs directly from the filesystem; just open `index.html` in
a modern browser.

## Files

- `index.html` — single-page wizard shell
- `css/style.css` — mobile-first stylesheet (no framework dependencies)
- `js/types.js` — empty-assessment factory and shared utilities
- `js/asa-rules.js` — ASA Physical Status rules
- `js/composite-grader.js` — Mallampati, RCRI, STOP-BANG, CFS, composite risk
- `js/flagged-issues.js` — additional safety-flag detection
- `js/app.js` — wizard renderer, persistence, and report

## Engine parity with the SvelteKit version

Rule IDs, flag IDs, and the composite-risk algorithm match
`../front-end-form-with-svelte/src/lib/engine/` exactly.
