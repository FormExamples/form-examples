# Medical Language Speaking Assessment for English — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily Design System (Svelte
headless). Vitest for unit tests; SVAR DataGrid for the dashboard.

Single consolidated front-end with RESTful routes:

- `/` — welcome page
- `/medical-language-speaking-assessments-for-english` — dashboard (SVAR DataGrid, client-only)
- `/medical-language-speaking-assessments-for-english/[id]` — single-page wizard
- `/medical-language-speaking-assessments-for-english/[id]/report` — graded report (+ PDF endpoint)

See parent [`../index.md`](../index.md) for the form specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
