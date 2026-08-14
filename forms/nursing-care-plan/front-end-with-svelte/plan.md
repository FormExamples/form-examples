# Plan — Nursing Care Plan SvelteKit front-end

## Status: built

Greenfield SvelteKit front-end mirroring the completed sibling
`medication-reconciliation/front-end-with-svelte`, adapted for a MULTI-TABLE
relational documentation form: a parent care-plan header plus a repeating
**problem** list, each problem carrying nested **goal** and **intervention**
arrays and an inline evaluation (ADPIE). The engine grades completeness per
problem and rolls it up to a plan status — not a numeric score.

## Done

- [x] Scaffold from the sibling template (configs, `app.css`, `app.html`,
      themes, UI component set including generic `Badge` / `ListEditor`,
      `Form.svelte` with `novalidate`).
- [x] Port the engine to TypeScript: `types.ts`, `utils.ts`,
      `nursing-care-plan-rules.ts`, `nursing-care-plan-grader.ts`,
      `flagged-issues.ts`.
- [x] Model `problems[]` where each problem has `goals[]` + `interventions[]` +
      inline evaluation; `createDefaultAssessment()` initializes `problems` to
      `[]`; `createDefaultProblem()` / `createDefaultGoal()` /
      `createDefaultIntervention()` build fresh rows with unique ids.
- [x] Generic `ListEditor.svelte` repeating-row editor: a problem list (step 4)
      and nested goal (step 5) + intervention (step 6) editors per problem.
- [x] Eight step components; live-status readout (`LiveStatus.svelte`) showing
      status, completeness percent, and per-problem class counts.
- [x] RESTful routes under `/nursing-care-plans/` (dashboard `ssr=false`,
      `[id]` wizard, `[id]/report`, `[id]/report/pdf`), plus welcome + layout.
- [x] Four sample care plans with populated problem / goal / intervention arrays
      spanning complete / partial / incomplete (and a high-flag partial), and
      engine-derived dashboard rows.
- [x] PDF builder (`pdfmake`): plan context, patient, per-problem detail, flags.
- [x] Vitest engine tests (local `createDefaultCarePlan` fixture; no store
      import): per-problem class, plan roll-up (including the high-flag gate),
      completeness percent (0 / 33 / 100), and each flag category + sorting.

## Verify

- `pnpm run check` — 0 errors, 0 warnings.
- `pnpm run build` — succeeds.
- `pnpm exec vitest run` — all engine tests pass.
