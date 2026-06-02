# Plan: WHO Emergency Unit Form: Trauma

## Current status

SvelteKit patient front-end implemented. WHO emergency unit trauma documentation — 17-step wizard with triage-driven required fields (RED ratchet), dead-on-arrival path, FAST/E exam, 35 rules, 25+ clinical flags; 41 tests.

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
