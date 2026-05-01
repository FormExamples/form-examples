# Plan: UK DVLA B1 Form

## Current status

SvelteKit patient front-end implemented. DVLA B1 confidential medical information (neurological) — 13-step wizard, 41 validation rules, conditional epilepsy declaration, clinically-flagged issues for missing declaration / drowsy meds / uncontrolled diplopia.

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
