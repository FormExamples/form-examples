# HTML clinician wizard — Agent Instructions

Single-page static HTML + vanilla JavaScript implementation of the 16-step
clinician wizard. No build step, no framework, no CDN dependencies.

## Stack

- HTML5 + CSS3 + vanilla JavaScript (ES2020).
- No build step, no node_modules, no server, no bundler.
- Classic `<script>` tags only (no ES modules) so the form runs from
  `file://` for air-gapped clinic workstations.
- Each script is wrapped in an IIFE and publishes its public symbols on
  `window.PreOperativeAssessmentByClinician`.

## Files

- `index.html` — page shell, sticky progress bar, aria-live report region.
- `css/style.css` — mobile-first stylesheet (no framework dependencies).
- `js/types.js` — empty-assessment factory, BMI, ASA grade ordering.
- `js/asa-rules.js` — ASA Physical Status rule catalogue.
- `js/composite-grader.js` — Mallampati / RCRI / STOP-BANG / CFS rules
  plus the composite-risk algorithm; entry point `calculateASA(data)`.
- `js/flagged-issues.js` — additional safety-flag detection.
- `js/app.js` — wizard renderer, persistence, and report generation.

## Persistence

Form state autosaves to localStorage under the key
`pre-operative-assessment-by-clinician.front-end-form-with-html.v1`. State
is merged over a fresh empty assessment on load so newly-added fields
default correctly.

## Engine parity

The engine mirrors the SvelteKit `src/lib/engine/*.ts` files 1:1. Rule IDs
(`R-ASA-*`, `R-MP-*`, `R-RCRI-*`, `R-SB-*`, `R-CFS-*`) and flag IDs
(`F-DIFFICULT-AIRWAY`, `F-SEVERE-CARDIAC`, etc.) are identical to the
canonical TypeScript source. The composite-risk algorithm is the same.

## Accessibility

- Semantic landmark structure (`<header>`, `<main>`, `<footer>`).
- All inputs have associated `<label>` elements.
- Sticky progress bar is announced via `role="progressbar"` and
  `aria-valuenow`.
- Report region uses `role="region"` and `aria-live="polite"`.
- Skip link at top of page.
- WCAG 2.2 AA colour contrast.
