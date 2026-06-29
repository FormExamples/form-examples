# Hospital Discharge — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4, Lily Svelte headless contract,
SVAR DataGrid dashboard. Vitest for unit tests.

Single consolidated front-end: a continuous single-page discharge-summary
wizard plus a clinician dashboard, with RESTful routes
`/hospital-discharges/` (dashboard) and `/hospital-discharges/[id]` (wizard),
plus `[id]/report` and `[id]/report/pdf`.

The shared engine validates the summary against NICE NG27 completeness rules
and classifies it as Complete / Partial / Incomplete, raising safety flags.

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
