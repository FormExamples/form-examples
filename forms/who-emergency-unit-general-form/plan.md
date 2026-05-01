# Plan: WHO Emergency Unit Form: General

## Current status

SvelteKit patient front-end implemented. WHO emergency unit general (non-trauma) clinical documentation — 16-step wizard with ABCD primary survey, ROS over 14 systems, PE over 11 systems, diagnostics, interventions, reassessment, disposition; 27 tests.

Remaining work:

- Build front-end-dashboard-with-svelte (SVAR DataGrid)
- Build full-stack-with-loco-tera-htmx-alpine Rust backend (axum + Loco +
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
