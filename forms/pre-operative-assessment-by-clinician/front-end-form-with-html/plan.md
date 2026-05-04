# Plan: HTML clinician wizard

- [x] Single-page HTML with 16 step sections rendered by vanilla JS.
- [x] IIFE-wrapped classic `<script>` files publishing on
      `window.PreOperativeAssessmentByClinician`.
- [x] Sticky progress bar with `aria-valuenow`.
- [x] localStorage autosave under
      `pre-operative-assessment-by-clinician.front-end-form-with-html.v1`.
- [x] Pure ASA / Mallampati / RCRI / STOP-BANG / CFS engine ported from
      the SvelteKit `src/lib/engine/*.ts` files (identical rule IDs).
- [x] Composite-risk computation matching the SvelteKit version.
- [x] Additional safety-flag detection matching the SvelteKit version.
- [x] aria-live report region with fired-rule table and flag list.
- [x] Browser print-to-PDF via `window.print()`.
- [ ] Offline-first service worker (future).
