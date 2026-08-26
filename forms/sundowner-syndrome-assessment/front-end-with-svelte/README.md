# Sundowner Syndrome Assessment — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4, with the Lily Design System
Svelte headless component contract. Vitest for engine unit tests.

Consolidated single front-end: a continuous single-page wizard plus a SVAR
DataGrid clinician dashboard.

- Wizard: `/sundowner-syndrome-assessments/[id]` (10 sections; CMAI + NPI).
- Dashboard: `/sundowner-syndrome-assessments` (severity, CMAI / NPI totals, flags).
- Report: `/sundowner-syndrome-assessments/[id]/report` (+ PDF).

The shared scoring engine (`src/lib/engine/`) scores the Cohen-Mansfield
Agitation Inventory (CMAI, 29-203) and the Neuropsychiatric Inventory (NPI,
0-144), classifies a severity band (mild / moderate / severe / critical), and
raises prioritized flagged issues. See parent [`../index.md`](../index.md) for
the full form specification.
