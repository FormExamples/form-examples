# Renal Assessment — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily Design System Svelte
headless. SVAR DataGrid dashboard. Vitest for the grading engine.

RESTful routes: `/renal-assessments/` (dashboard) + `/renal-assessments/[id]`
(wizard) + `/renal-assessments/[id]/report` (+ `report/pdf`). The KDIGO
classification engine lives in `src/lib/engine/` (`types.ts`, `kdigo-rules.ts`,
`kdigo-grader.ts`, `flagged-issues.ts`, `utils.ts`; tested in
`kdigo-grader.test.ts`).

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
