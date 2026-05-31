# Medical Operation Note — static HTML wizard

Single-page static HTML implementation of the 12-step operating-team
op-note wizard, built with plain HTML, CSS, and vanilla JavaScript — no
framework, no build step. Produces an in-browser report and a
downloadable PDF via `pdfmake` (loaded from a CDN).

## Stack

- HTML5 + CSS3 + vanilla JavaScript
- No server, no database — runs on any air-gapped clinic workstation
  (after `pdfmake` is cached or vendored locally)
- Each script is an IIFE publishing public symbols on
  `window.MedicalOperationNote`
- Form state autosaves to localStorage and is restored on reload

## Running

```sh
# From this directory:
python3 -m http.server 8080
```

Open <http://localhost:8080>.

The form also runs directly from the filesystem; open `index.html` in
a modern browser.

## Files

- `index.html` — single-page wizard shell
- `css/style.css` — mobile-first stylesheet (no framework dependencies)
- `js/types.js` — empty-op-note factory, enums, shared utilities
- `js/utils.js` — small pure helpers (escape, format, max-grade)
- `js/clavien-dindo-rules.js` — Clavien-Dindo classification rules
- `js/blood-loss-rules.js` — EBL band classification
- `js/count-rules.js` — swab/needle/instrument count rules
- `js/never-event-rules.js` — wrong-site / retained-item / wrong-implant
- `js/anaesthetic-event-rules.js` — failed intubation, anaphylaxis, etc.
- `js/composite-grader.js` — max-grade engine; entry `calculateOperationGrade(data)`
- `js/flagged-issues.js` — additional safety-flag detection
- `js/wizard.js` — wizard state, navigation, validation, persistence
- `js/report.js` — HTML report preview and pdfmake PDF generation

## Engine parity with the SvelteKit version

Rule IDs (`R-CD-*`, `R-EBL-*`, `R-COUNT-*`, `R-NE-*`, `R-AE-*`) and
flag IDs (`F-INCORRECT-COUNT`, `F-RETAINED-ITEM`, `F-NEVER-EVENT`, etc.)
match the canonical TypeScript source 1:1.
