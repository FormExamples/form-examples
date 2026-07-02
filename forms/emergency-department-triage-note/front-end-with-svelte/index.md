# Emergency Department Triage Note — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Emergency Department Triage Note: a
single continuous single-page wizard plus a clinician dashboard, styled with the
Lily Design System (Svelte headless) and powered by a pure Svelte 5
classification engine.

- **Wizard** — `/emergency-department-triage-notes/[id]`: eight sections (triage
  context, arrival, patient identification, presenting complaint, triage vital
  signs, pain score, Manchester Triage System discriminators, review/sign-off).
  Live per-parameter NEWS2 subscore pills and a live priority-level classification.
- **Dashboard** — `/emergency-department-triage-notes`: SVAR DataGrid with the
  engine-derived MTS priority level, category, target time, supporting NEWS2
  aggregate, and flag count; filter by priority level and care setting.
- **Report** — `/emergency-department-triage-notes/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Classification engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `ed-triage-rules.ts`,
`ed-triage-grader.ts`, `flagged-issues.ts`. Ported faithfully from the tested
HTML front-end. This is a **classification**, not an additive score: the engine
evaluates the Manchester Triage System discriminators (boolean flags plus
derived findings — ACVPU, SpO2 < 92%, pain-score bands), computes a supporting
NEWS2 aggregate (seven parameters scored 0-3, Scale 1), applies NEWS2 escalation
(aggregate ≥ 7 or any single parameter 3 → at least Level 2; 5-6 → at least
Level 3), and assigns `priorityLevel` = the most urgent (lowest) level any
finding justifies. Colour, name, and target time (0 / 10 / 60 / 120 / 240 min)
derive from the level. Missing vital signs never lower the category. Tests in
`ed-triage-grader.test.ts`.

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
