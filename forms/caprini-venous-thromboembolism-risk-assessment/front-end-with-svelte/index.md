# Caprini VTE — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Caprini Venous Thromboembolism Risk
Assessment: a single continuous single-page wizard plus a clinician dashboard,
sharing one pure Svelte 5 scoring engine.

- **Wizard** — eight sections (context, patient, the 1-/2-/3-/5-point risk
  factors, bleeding risk, and summary). The Caprini score, risk band, and
  recommended prophylaxis are computed live and on submit.
- **Dashboard** — a SVAR DataGrid of assessed patients with their engine-derived
  Caprini score, risk band, recommended prophylaxis, and flag count.
- **Report** — a graded report with a printable / PDF export.

See the form root [`../index.md`](../index.md) and the living domain spec
[`../spec/index.md`](../spec/index.md) for the scoring model.

## Routes

- `/` — welcome page.
- `/caprini-venous-thromboembolism-risk-assessments` — clinician dashboard
  (`ssr = false`; SVAR DataGrid).
- `/caprini-venous-thromboembolism-risk-assessments/[id]` — the wizard
  (`new` for a fresh draft, or a sample id).
- `/caprini-venous-thromboembolism-risk-assessments/[id]/report` — the report.
- `/caprini-venous-thromboembolism-risk-assessments/[id]/report/pdf` — the
  server-side `pdfmake` PDF endpoint.

## Commands

```sh
pnpm install
pnpm run check     # svelte-check (0 errors, 0 warnings)
pnpm run build     # production build
pnpm exec vitest run   # engine unit tests
```
