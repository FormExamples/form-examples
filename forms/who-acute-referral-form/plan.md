# Plan: WHO Acute Referral Form

## Current status

SvelteKit patient front-end implemented. WHO standardised acute referral (SBAR) — 8-step wizard, two-party completion (initiating facility steps 1–7, receiving facility step 8), 28 validation rules, clinical flags for SpO2<90, GCS≤8, hypotension, hypertension, infectious-disease precaution.

Remaining work:

- Build front-end-dashboard-with-svelte (SVAR DataGrid)
- Build back-end-with-loco Rust backend (axum + Loco +
  Tera + HTMX + Alpine.js)
- PDF report generation via SvelteKit server endpoint
- End-to-end Playwright tests
- Clinical safety case documentation

See [AGENTS.md](AGENTS.md) for the form's design spec and step list.

## Future enhancements

- Add input validation with Zod schemas
- Add accessibility audit (axe-core)
- Add form autosave to localStorage
- Add internationalisation (i18n) support
- User acceptance testing with domain stakeholders
