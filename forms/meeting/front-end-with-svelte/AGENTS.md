# Meeting — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily Design System Svelte
headless. Vitest for the validation engine. SVAR DataGrid for the dashboard.

This is the gold consolidated front-end: a single-page wizard at
`/meetings/[id]` plus a dashboard at `/meetings/`, a welcome page, a themed
layout, an id-keyed reactive store, the shared validation engine, and a PDF
report endpoint.

See parent [`../index.md`](../index.md) for the full form specification.

## Structure

- `src/lib/engine/` — `types.ts`, `meeting-validator.ts` (pure validation
  engine), `utils.ts` (label/colour helpers), `meeting-validator.test.ts`.
- `src/lib/stores/meeting.svelte.ts` — id-keyed reactive store
  (`meeting`), in-place `deepAssign` deep-merge, localStorage key
  `meeting.front-end-with-svelte.<id>.v1`, `createDefaultMeeting()`.
- `src/lib/config/steps.ts` — the ten wizard steps.
- `src/lib/data/sample-reports.ts` — four sample meetings spanning the
  health range plus engine-derived dashboard rows.
- `src/lib/components/steps/` — `StepNName.svelte` (1–10).
- `src/lib/components/ui/` — Lily Svelte headless components.
- `src/lib/report/pdf-builder.ts` — pdfmake document.
- `src/routes/meetings/` — `+page.svelte` (SVAR dashboard) + `+page.ts`
  (`ssr = false`), `[id]/+page.svelte` (wizard), `[id]/report/+page.svelte`,
  `[id]/report/pdf/+server.ts`.

## Validation engine

Non-clinical: there is no numeric grade. `validateMeeting(data)` returns
counts (duration, participants, accepted, attended, agenda, action items,
open actions, outputs, outcomes), a `completionStatus`
(planned / in-progress / complete / incomplete), an `overallHealth`
(green / amber / red), a list of fired rules, and non-blocking flags.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
