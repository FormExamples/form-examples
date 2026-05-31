# Plan: HTML operation-note wizard

- [x] Single-page HTML with 12 step sections rendered by vanilla JS.
- [x] IIFE-wrapped classic `<script>` files publishing on
      `window.MedicalOperationNote`.
- [x] Sticky progress bar and step-list ToC.
- [x] localStorage autosave under
      `medical-operation-note.front-end-form-with-html.v1`.
- [x] Composite-risk grading engine
      (`Routine / Complicated / High-risk / Critical`) implementing
      the max-grade algorithm, ported 1:1 from the SvelteKit
      `src/lib/engine/*.ts` files (identical rule IDs).
- [x] Clavien-Dindo, EBL, count, never-event, and anaesthetic-event
      sub-rule catalogues.
- [x] Safety-flag detection (incorrect count, retained item, never-event,
      massive haemorrhage, conversion to open, intra-op arrest,
      anaesthetic incident, implant registry pending, specimen
      labelling issue, equipment problem, documentation gap).
- [x] Surgeon override on step 12 with documented reason.
- [x] aria-live report region with fired-rule table and flag list.
- [x] PDF download via `pdfmake` (CDN).
- [ ] Offline-first service worker (future).
- [ ] FHIR R5 Procedure-bundle download (future).
