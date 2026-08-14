# Plan: UK DVLA M1 Form

## Current status

SvelteKit patient front-end implemented. DVLA M1 confidential medical information (mental health) — 6-step wizard with Q1=No early-stop branch, 16 validation rules, suicidal-thoughts and schizophrenia/psychosis escalation.

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
