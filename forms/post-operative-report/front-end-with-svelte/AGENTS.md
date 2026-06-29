# Post-Operative Report — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

Single continuous wizard (10 sections) plus a SVAR DataGrid dashboard. The
pure engine in `src/lib/engine/` grades complications with the Clavien-Dindo
classification (`clavien-dindo-rules.ts`, `clavien-dindo-grader.ts`,
`flagged-issues.ts`, `utils.ts`; tests in `clavien-dindo-grader.test.ts`).

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
