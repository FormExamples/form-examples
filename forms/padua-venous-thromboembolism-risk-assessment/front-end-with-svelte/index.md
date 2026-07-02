# Padua VTE — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Padua Venous Thromboembolism Risk
Assessment (Padua Prediction Score): a single continuous single-page wizard plus
a clinician dashboard, styled with the Lily Design System (Svelte headless) and
powered by a pure Svelte 5 scoring engine.

- **Wizard** — `/padua-venous-thromboembolism-risk-assessments/[id]`: eight
  sections (context, patient identification, oncology and thrombosis history,
  mobility and recent events, cardiorespiratory and acute illness, metabolic and
  treatment factors, bleeding-risk check, summary). Live per-section factor point
  pills and a running Padua score.
- **Dashboard** — `/padua-venous-thromboembolism-risk-assessments`: SVAR DataGrid
  with the engine-derived Padua score, risk band, and prophylaxis recommendation;
  filter by care setting and risk band.
- **Report** — `/padua-venous-thromboembolism-risk-assessments/[id]/report` with
  a server-generated PDF (`pdfmake`).

## Scoring engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `padua-rules.ts`, `padua-grader.ts`,
`flagged-issues.ts`. Additive weighted: eleven factors — active cancer (3),
previous VTE (3), reduced mobility (3), known thrombophilia (3), recent
trauma/surgery (2), age ≥ 70 (1), heart/respiratory failure (1), acute MI or
ischaemic stroke (1), acute infection/rheumatological (1), obesity BMI ≥ 30 (1),
ongoing hormonal treatment (1). Total 0-20; Padua ≥ 4 is high risk. The
bleeding-risk fields gate the prophylaxis recommendation but never change the
score. Tests in `padua-grader.test.ts`.

## Stack

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Vitest. SVAR DataGrid for the
dashboard. See [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)
for the Lily Svelte headless component contract.

## Commands

```sh
pnpm install
pnpm run check       # svelte-check: 0 errors, 0 warnings
pnpm run build       # production build
pnpm exec vitest run # engine unit tests
```
