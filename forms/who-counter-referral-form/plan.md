# Plan: WHO Counter-Referral Form

## Current status

SvelteKit patient front-end implemented. WHO standardized counter-referral (SBAR) — 7-step wizard, follow-up timeframe (urgent <24h to >2 weeks), status flags (cognitive impairment, carer-dependent, palliative care), conditional informed-explanation, 28 tests.

Remaining work:

- Build front-end-with-svelte (SVAR DataGrid)
- Build back-end-with-loco Rust backend (axum + Loco +
  Loco JSON API)
- PDF report generation via SvelteKit server endpoint
- End-to-end Playwright tests
- Clinical safety case documentation

See [AGENTS.md](AGENTS.md) for the form's design spec and step list.

## Future enhancements

- Add input validation with Zod schemas
- Add accessibility audit (axe-core)
- Add form autosave to localStorage
- Add internationalization (i18n) support
- User acceptance testing with domain stakeholders
