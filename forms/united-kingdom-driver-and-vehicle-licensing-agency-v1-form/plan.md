# Plan: UK DVLA V1 Form

## Current status

SvelteKit patient front-end implemented. DVLA V1 general confidential medical information (vision) — 14-step wizard, 40 validation rules, Snellen 6/12 standard, monocular / glaucoma / retinitis pigmentosa / blepharospasm / diplopia branches.

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
- Add internationalisation (i18n) support
- User acceptance testing with domain stakeholders
