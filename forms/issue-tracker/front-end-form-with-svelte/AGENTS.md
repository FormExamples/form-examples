# Issue Tracker — front-end form with SvelteKit

SvelteKit single-page issue-reporting wizard with the canonical
class-based reactive store, Tailwind CSS 4 styling, and a `pdfmake`
PDF report endpoint at `/report/pdf`.

## Status

Scaffold only. Step components, scoring engine, and report rendering
still need to be authored.

## Stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for server-side PDF
- Vitest for engine unit tests
- SVAR Svelte Core for the reusable UI primitives

## Conventions

- Single-page wizard; ten step components named `Step01ChiefComplaint.svelte`
  through `Step10ScoreAndSignOff.svelte`.
- Class-based reactive store at
  `src/lib/stores/assessment.svelte.ts` (no `writable`).
- Pure scoring engine in `src/lib/scoring/`, matching the file layout
  used by `pre-operative-assessment-by-clinician`.

See [`AGENTS/front-end-with-sveltekit-tailwind-svar.md`](../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md)
for the full conventions.
