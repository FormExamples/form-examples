# Plan: UK MAT B1 Maternity Certificate

## Current status

SvelteKit patient front-end implemented. DWP MAT B1 maternity certificate — 4-step wizard, doctor-stamp vs midwife NMC-PIN issuer branch, pre-confinement vs post-confinement certificate branch, >20-weeks-pre-EWC and expired-NMC flags.

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
