# Plan: Eye Prescription — HTML Front-End Form

## Build order

1. Author `index.html` with eleven `<section>` blocks (one per step) and
   a single Alpine.js component (`x-data`) holding the prescription.
2. Author `assets/rules.js` with the refractive-rules, complexity-grader,
   and flagged-issues engines as plain JS functions (no module bundler).
3. Author `assets/script.js` with the Alpine.js component setup,
   `x-effect` recomputation, and form validation.
4. Author `assets/pdf.js` with the pdfmake document definition.
5. Smoke-test in a browser; iterate on layout.

## Design principles

- Mirror the SvelteKit form's UX and visual design.
- No build step; CDN-hosted Tailwind + Alpine + pdfmake.
- Same sign-convention discipline (cylinder ≤ 0).
- Same 0.25 D snap, same axis 1–180 rule.

## Out of scope

- LocalStorage autosave (deferred).
- Bilingual UI (deferred).
