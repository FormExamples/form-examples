# Plan: static HTML wizard

## Status

Scaffolded 2026-05-18. No implementation yet.

## Build order

1. [ ] `index.html` shell with Tailwind via CDN, Alpine.js init, 14-step
       navigation skeleton.
2. [ ] `lpa-store.js` — Alpine.js global store with the `LpaApplication`
       shape and step navigation state.
3. [ ] `engine/types.js` — JSDoc-typed shared types.
4. [ ] `engine/donor-rules.js`, `engine/attorney-rules.js`,
       `engine/certificate-provider-rules.js`,
       `engine/signature-order-rules.js`, `engine/instruction-rules.js`.
5. [ ] `engine/composite-validator.js` — `calculateLpaValidity()` entry.
6. [ ] `engine/flagged-issues.js` — non-statutory warning generator.
7. [ ] `steps/step-01.html` through `steps/step-14.html`.
8. [ ] `pdf-export.js` — `pdfmake` LP1H PDF builder.
9. [ ] Accessibility audit pass (axe-core via CDN).
10. [ ] Cross-browser smoke test (Chrome, Firefox, Safari, Edge).

## Why static HTML

A static deployment runs on the file system or any HTTP server without a
build step. Aimed at low-friction usage by solicitors, Age UK volunteers,
and IMCAs who often work on locked-down laptops.

## Known limitations

- No autosave to durable storage; in-memory state only. LocalStorage
  autosave is a future enhancement.
- No FHIR / XML export from the static build; those are produced by the
  SvelteKit and Loco implementations from the same engine output.
