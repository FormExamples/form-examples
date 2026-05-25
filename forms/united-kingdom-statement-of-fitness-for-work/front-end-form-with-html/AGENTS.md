# HTML Fit-Note Wizard — Agent Instructions

Single-page static HTML + vanilla JavaScript implementation of the UK fit
note ten-step wizard. No build step, no framework, no CDN dependencies.

## Stack

- HTML5 + CSS3 + vanilla JavaScript (ES2020).
- No node_modules, no server, no bundler.
- Classic `<script>` tags only (no ES modules) so the form runs from
  `file://` for air-gapped GP workstations.
- Each script is wrapped in an IIFE and publishes its public symbols on
  `window.FitNote`.

## Files

- `index.html` — page shell, sticky progress bar, aria-live report region.
- `css/style.css` — mobile-first stylesheet (no framework dependencies).
- `js/types.js` — empty fit-note factory and shared constants.
- `js/grader.js` — validity, adaptation, period, and safety rule sets;
  entry point `gradeFitNote(data)`.
- `js/app.js` — wizard renderer, persistence, report generation.

## Persistence

Form state autosaves to `localStorage` under the key
`united-kingdom-statement-of-fitness-for-work.front-end-form-with-html.v1`.
State is merged over a fresh empty fit-note object on load so newly-added
fields default correctly.

## Engine parity

The engine mirrors the SvelteKit `src/lib/grading/*.ts` files 1:1. Rule
IDs (`R-VALID-*`, `R-ADAPT-*`, `R-PERIOD-*`, `R-SAFE-*`) and flag IDs
(`F-INVALID-*`, `F-AUTO-DISABILITY-*`, etc.) are identical to the
canonical TypeScript source.

## Accessibility

- Semantic landmark structure (`<header>`, `<main>`, `<footer>`).
- All inputs have associated `<label>` elements.
- Sticky progress bar is announced via `role="progressbar"` and
  `aria-valuenow`.
- Report region uses `role="region"` and `aria-live="polite"`.
- Skip link at top of page.
- WCAG 2.2 AA colour contrast.

## Verify

Open `index.html` in any modern browser. Complete the form, click "Submit
and view report", and verify the rendered fit note matches the data
entered.

## Lily Design System HTML headless

This form conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for
the shared vocabulary (`.field`, `.fieldset`, `.text-input`, `.step-list`,
`.error-summary`, `.button[data-variant]`, etc.), the page-shell template,
validation pattern, and accessibility commitments.
