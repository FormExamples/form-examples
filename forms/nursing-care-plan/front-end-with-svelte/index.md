# Nursing Care Plan — SvelteKit front-end

SvelteKit 2 + Svelte 5 (runes) + Tailwind CSS 4 implementation of the nursing
care plan wizard and clinician dashboard, sharing one pure completeness engine.
A documentation-and-completeness form: the engine grades each problem
**Complete / Partial / Incomplete**, rolls that up to a plan **status**, reports
a **completeness percent**, and raises flagged issues — not a numeric score.

This is a MULTI-TABLE relational form: a parent care-plan record plus an array of
**problem** rows, each carrying its own arrays of **goal** and **intervention**
rows plus an inline evaluation (the ADPIE nursing process).

## Surfaces

- **Welcome** (`/`) — overview and links to the two working surfaces.
- **Wizard** (`/nursing-care-plans/[id]`) — one continuous single-page form of
  eight sections, including a repeating **problem** editor (step 4) and, per
  problem, **nested** repeating editors for goals (step 5) and interventions
  (step 6).
- **Report** (`/nursing-care-plans/[id]/report`) — status banner with completeness
  percent, per-problem completeness classes, goals / interventions / evaluation,
  and flagged issues; PDF via `report/pdf` (`pdfmake`).
- **Dashboard** (`/nursing-care-plans`) — SVAR DataGrid of care plans with
  engine-derived status, completeness percent, problem count, and flag count
  (`ssr = false`).

## Layout

- `src/lib/engine/` — pure engine: `types.ts`, `utils.ts` (labels + colours +
  row factories: `createDefaultProblem` / `createDefaultGoal` /
  `createDefaultIntervention` / `createDefaultRiskGroup`),
  `nursing-care-plan-rules.ts`, `nursing-care-plan-grader.ts`,
  `flagged-issues.ts`, and `nursing-care-plan-grader.test.ts` (Vitest).
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence (`nursing-care-plan.front-end-with-svelte.<id>.v1`), in-place
  `deepAssign` deep-merge (arrays replaced wholesale so seeded problem / goal /
  intervention rows reach the editors), `createDefaultAssessment()`.
- `src/lib/components/ui/ListEditor.svelte` — generic repeating-row editor (add /
  remove) driving the problem list and each problem's nested goal / intervention
  lists via a `row` snippet.
- `src/lib/components/steps/StepNName.svelte` — the eight wizard sections.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample care plans (populated problem / goal /
  intervention arrays) + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.

## Engine

The engine is ported from the HTML front-end (`front-end-with-html/js/`):
`classifyProblem(p)` grades one problem; `gradeCarePlan(plan)` rolls the
per-problem classes up to a plan status, computes the completeness percent,
builds the fired-rule audit trail, and attaches flagged issues (spec §4–§5) with
a timestamp. `detectFlaggedIssues(plan)` raises the flags independently.

## Verify

```sh
pnpm install
pnpm run check      # svelte-check: 0 errors, 0 warnings
pnpm run build
pnpm exec vitest run
```

See the form root [`../index.md`](../index.md), [`../AGENTS.md`](../AGENTS.md),
and [`../spec/index.md`](../spec/index.md).
