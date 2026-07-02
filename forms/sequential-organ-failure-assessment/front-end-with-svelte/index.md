# SOFA — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

This is the consolidated Svelte front-end for the **Sequential Organ Failure
Assessment (SOFA)** score: a single continuous single-page wizard that records
objective physiology and laboratory findings for six organ systems, plus a
SVAR-powered clinician dashboard. Both surfaces share the same pure scoring
engine.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the SOFA specification and scoring thresholds. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure scoring engine:
  - `types.ts` — `AssessmentData`, `SubScores`, `GradingResult`, `FiredRule`, `FlaggedIssue`.
  - `utils.ts` — label + Lily-token colour helpers (mortality band, sub-score, priority, roles, etc.).
  - `sofa-rules.ts` — the six per-system 0-4 threshold scorers + the `systemScorers` registry.
  - `sofa-grader.ts` — orchestration: sub-scores → total (0-24) → delta-SOFA → mortality band → Sepsis-3.
  - `flagged-issues.ts` — severe single-organ, multi-organ, rising-SOFA, marked-deterioration, high-risk, improving, incomplete.
  - `sofa-grader.test.ts` — Vitest boundary tests per system + totals, delta, bands, and flags.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence (`sequential-organ-failure-assessment.front-end-with-svelte.<id>.v1`),
  in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (context, baseline, respiration, coagulation, liver, cardiovascular, CNS, renal, summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — four sample records spanning the mortality
  bands + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/sequential-organ-failure-assessments/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Scoring engine

Each of the six organ systems is scored 0-4 from its objective input(s) using
the published thresholds (see [`../index.md`](../index.md) §Scoring system):

- **Respiration** — PaO2/FiO2 ratio (mmHg); sub-scores 3-4 require respiratory support.
- **Coagulation** — platelet count (x10^9/L).
- **Liver** — total bilirubin (umol/L).
- **Cardiovascular** — the max of the MAP band and the vasopressor band.
- **CNS** — Glasgow Coma Scale total.
- **Renal** — the max of the creatinine band and the urine-output band.

The six sub-scores sum to a total of 0-24. Delta-SOFA is the change from the
recorded baseline; the total is banded for mortality risk (0-6 low, 7-9
moderate, 10-12 high, 13-14 very high, 15-24 extreme); the Sepsis-3 flag is set
when suspected infection accompanies a delta-SOFA of &ge; 2. A missing input
yields a `null` sub-score and an incomplete-assessment flag — the engine never
guesses.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
