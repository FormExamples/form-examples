# UK LPA for Health and Care Decisions — static HTML wizard — Agent Instructions

Single-page static HTML implementation of the 14-step LP1H wizard. Alpine.js
drives the reactive store; the validity engine is a vanilla ES module.

## Files

- `index.html` — wizard shell, Tailwind via CDN, Alpine.js init
- `engine/types.js` — JSDoc-typed `LpaApplication`
- `engine/composite-validator.js` — `calculateLpaValidity()` entry point
- `engine/donor-rules.js`, `engine/attorney-rules.js`,
  `engine/certificate-provider-rules.js`,
  `engine/signature-order-rules.js`, `engine/instruction-rules.js`
- `engine/flagged-issues.js` — non-statutory warnings
- `steps/step-01.html` … `steps/step-14.html` — step fragments included
  via Alpine.js `x-include`
- `lpa-store.js` — Alpine.js global store
- `pdf-export.js` — `pdfmake` builder for the OPG-ready PDF

## Conventions

- Plain JavaScript (no TypeScript) with JSDoc types.
- Module pattern; engine modules expose pure functions.
- Empty string `''` for unanswered text / enum fields; `null` for unanswered
  numeric fields.
- No network calls beyond CDN assets.
- No build step; deploy by copying the directory.

## Validity engine

The engine is identical in shape to the SvelteKit version — same function
signature, same `FiredRule` and `AdditionalFlag` types, same rule
identifiers. The two implementations are kept in sync.

## Accessibility

WCAG 2.2 AA target. Tested with NVDA and VoiceOver. Keyboard-only
navigation of every step. ARIA-live announcements on validity changes.

## Lily Design System HTML headless

This form conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for
the shared vocabulary (`.field`, `.fieldset`, `.text-input`, `.step-list`,
`.error-summary`, `.button[data-variant]`, etc.), the page-shell template,
validation pattern, and accessibility commitments.
