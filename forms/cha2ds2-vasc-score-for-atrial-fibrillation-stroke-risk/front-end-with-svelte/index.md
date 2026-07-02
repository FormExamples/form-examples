# CHA2DS2-VASc Score — SvelteKit front-end

Consolidated SvelteKit front-end for the CHA2DS2-VASc Score for Atrial
Fibrillation Stroke Risk: a single continuous single-page wizard plus a
clinician dashboard, sharing one pure scoring engine.

## What it does

- Collects the eight weighted CHA2DS2-VASc criteria across six wizard sections
  (context, identification, cardiac history, metabolic / thromboembolic history,
  age criterion, and summary).
- Grades a total of 0–9 with the shared engine, derives the risk band, the
  estimated annual stroke rate, and an anticoagulation recommendation, and raises
  clinician-facing flagged issues.
- Renders a printable report and a downloadable PDF.
- Presents a SVAR DataGrid dashboard of assessed patients, computed by the same
  engine so the form and dashboard never diverge.

## Routes

- `/` — welcome page.
- `/cha2ds2-vasc-assessments` — clinician dashboard (`ssr = false`).
- `/cha2ds2-vasc-assessments/new` — new assessment wizard.
- `/cha2ds2-vasc-assessments/[id]` — edit an existing assessment (seeded from a
  sample or a saved draft).
- `/cha2ds2-vasc-assessments/[id]/report` — graded report.
- `/cha2ds2-vasc-assessments/[id]/report/pdf` — PDF endpoint.

## Develop

```sh
pnpm install
pnpm run dev            # dev server
pnpm run check          # svelte-check (type-check)
pnpm run build          # production build
pnpm exec vitest run    # engine unit tests
```

## Persistence

In-progress drafts are stored in `localStorage` under
`cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk.front-end-with-svelte.<id>.v1`,
keyed by assessment id so each record edits independently.

See [`AGENTS.md`](./AGENTS.md) for the layout and engine details, and
[`../spec/index.md`](../spec/index.md) for the living domain spec.
