# First Aid Training Checklist — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

A UK HSE First Aid at Work (FAW) competency assessment, aligned with the
St John Ambulance syllabus. The examiner completes a single continuous
ten-step wizard; the shared engine grades each life-saving skill and returns
a Pass / Needs Development / Fail outcome with flagged issues.

- Welcome page at `/`.
- Examiner checklist wizard at `/first-aid-training-checklists/[id]` (and `/new`).
- Training coordinator SVAR DataGrid dashboard at `/first-aid-training-checklists`.
- Per-assessment report at `/first-aid-training-checklists/[id]/report` (+ PDF).

The pure grading engine lives in `src/lib/engine/` (`types.ts`,
`faw-rules.ts`, `first-aid-grader.ts`, `flagged-issues.ts`, `utils.ts`) with
Vitest tests in `first-aid-grader.test.ts`.
