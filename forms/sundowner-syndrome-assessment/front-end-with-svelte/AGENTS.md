# Sundowner Syndrome Assessment — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4, Lily Design System Svelte
headless component contract. Vitest for engine unit tests.

Consolidated front-end: continuous single-page wizard + SVAR DataGrid
dashboard, RESTful routes `/sundowner-syndrome-assessments/` (list) and
`/sundowner-syndrome-assessments/[id]` (wizard), plus `[id]/report` and PDF.

Scoring engine in `src/lib/engine/`: CMAI (29-203) + NPI (0-144) →
severity band + prioritized flags.

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
