# Endocrinology Assessment — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily Design System (Svelte
headless) + SVAR DataGrid. Vitest for the grading engine.

Single-page wizard (`/endocrinology-assessments/[id]`) + clinician dashboard
(`/endocrinology-assessments`). The pure engine in `src/lib/engine/` grades
each endocrine axis and is covered by `endocrine-grader.test.ts`.

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
