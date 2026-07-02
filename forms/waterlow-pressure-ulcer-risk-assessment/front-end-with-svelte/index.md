# Waterlow — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Waterlow Pressure Ulcer Risk
Assessment: a single continuous single-page wizard plus a clinician dashboard,
sharing one pure Svelte 5 scoring engine.

- **Wizard** — five sections (context, patient, core risk categories,
  special-risk groups, and summary). The Waterlow score and risk band are
  computed live and on submit.
- **Dashboard** — a SVAR DataGrid of assessed patients with their engine-derived
  Waterlow score, risk band, existing-damage marker, and flag count.
- **Report** — a graded report with a printable / PDF export.

See the form root [`../index.md`](../index.md) and the living domain spec
[`../spec/index.md`](../spec/index.md) for the scoring model.

## Routes

- `/` — welcome page.
- `/waterlow-pressure-ulcer-risk-assessments` — clinician dashboard
  (`ssr = false`; SVAR DataGrid).
- `/waterlow-pressure-ulcer-risk-assessments/[id]` — the wizard
  (`new` for a fresh draft, or a sample id).
- `/waterlow-pressure-ulcer-risk-assessments/[id]/report` — the report.
- `/waterlow-pressure-ulcer-risk-assessments/[id]/report/pdf` — the
  server-side `pdfmake` PDF endpoint.

## Commands

```sh
pnpm install
pnpm run check     # svelte-check (0 errors, 0 warnings)
pnpm run build     # production build
pnpm exec vitest run   # engine unit tests
```
