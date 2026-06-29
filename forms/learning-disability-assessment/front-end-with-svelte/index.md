# Learning Disability Assessment — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 (Lily Design System Svelte
headless). Vitest for unit tests.

A single continuous ten-step wizard that captures a learning-disability
annual health check and adaptive-functioning assessment, then grades it with
a pure engine into a DSM-5-TR aligned severity category (Mild / Moderate /
Severe / Profound) with a mean adaptive-support score and clinician-facing
flags. A SVAR DataGrid clinician dashboard lists assessed patients with their
engine-derived severity, IQ band, communication need, and mental-capacity
status.

- Wizard + report: `/learning-disability-assessments/[id]`,
  `/learning-disability-assessments/[id]/report`
- Dashboard: `/learning-disability-assessments/`
- Engine: `src/lib/engine/` (`types.ts`, `defaults.ts`, `ld-rules.ts`,
  `ld-grader.ts`, `flagged-issues.ts`, `utils.ts`, `ld-grader.test.ts`)

See parent [`../index.md`](../index.md) for the full form specification.
