# Plan: Psychology Assessment

## Current status

SvelteKit patient front-end implemented. DASS-21 patient form (8-step wizard, 3 subscales, severity per subscale, suicidal-ideation safety flag).

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
