# Return to Work — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily Design System Svelte
headless. Vitest for the grading engine. SVAR DataGrid for the dashboard.

This is the gold consolidated `front-end-with-svelte/`: a single project
holding the clinician wizard, the review dashboard, the report, and the PDF
endpoint. RESTful routes: `/return-to-work-records/` (dashboard) and
`/return-to-work-records/[id]` (wizard), plus `[id]/report` and
`[id]/report/pdf`.

See parent [`../index.md`](../index.md) for the full form specification (the
12-step wizard table, fitness determination, restriction-priority grade, and
safety flags).

## Engine

- `src/lib/engine/types.ts` — `AssessmentData` and grading types.
- `src/lib/engine/restriction-rules.ts` — declarative restriction rules, each
  graded 1 (routine) → 4 (high-risk); `countAdjustments` helper.
- `src/lib/engine/flagged-issues.ts` — safety flags for occupational health.
- `src/lib/engine/rtw-grader.ts` — `calculateReturnToWork(data)` →
  `{ fitnessStatement, computedFitness, overridden, restrictionPriority,
  firedRules, additionalFlags, timestamp }`. Restriction priority uses the
  max-grade rule; the clinician may override the computed fitness statement.
- `src/lib/engine/utils.ts` — label/colour helpers (Lily tokens only).
- `src/lib/engine/rtw-grader.test.ts` — Vitest coverage of the engine.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
