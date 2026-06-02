# Plan: WHO Prehospital Form

## Current status

SvelteKit patient front-end implemented. WHO prehospital EMS clinical documentation — 16-step wizard, reassessments modeled as array (0–3) with add/remove, SAMPLE history, injury-flag-gated mechanism/intent, 33 tests.

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
