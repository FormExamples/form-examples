# Employee Satisfaction Survey — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

A single SvelteKit app combining the anonymous employee survey wizard and the
HR dashboard:

- `/` — welcome page with links to the survey and the dashboard.
- `/employee-satisfaction-surveys` — HR dashboard (SVAR DataGrid), client-only.
- `/employee-satisfaction-surveys/[id]` — single-page survey wizard (ten steps).
- `/employee-satisfaction-surveys/[id]/report` — graded report + PDF download.

The shared pure scoring engine lives in `src/lib/engine/` (`types.ts`,
`rules.ts`, `grader.ts`, `flagged-issues.ts`, `utils.ts`) with Vitest tests in
`grader.test.ts`. Each 1–5 Likert domain is normalised to 0–100 (mean × 20)
and averaged into a composite; eNPS uses the 0–10 promoter / passive /
detractor bands.

See parent [`../index.md`](../index.md) for the full form specification.
