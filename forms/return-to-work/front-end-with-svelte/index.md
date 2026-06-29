# Return to Work — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily Design System Svelte
headless. Vitest for unit tests; SVAR DataGrid for the dashboard.

A single project holding the clinician wizard, the review dashboard, the
*Statement of Fitness for Work* report, and the PDF endpoint. The shared
engine derives the fitness statement (fit / may be fit / not fit), a
restriction-priority grade (routine / standard / restricted / high-risk) by
the max-grade rule, and safety flags for the occupational-health team.

## Routes

- `/` — welcome page.
- `/return-to-work-records` — clinician dashboard (SVAR DataGrid; `ssr = false`).
- `/return-to-work-records/[id]` — 12-step single-page wizard.
- `/return-to-work-records/[id]/report` — Statement of Fitness for Work.
- `/return-to-work-records/[id]/report/pdf` — server-rendered PDF (`pdfmake`).

## Commands

```sh
pnpm install
pnpm run check        # svelte-check (0 errors, 0 warnings)
pnpm run build        # production build
pnpm exec vitest run  # engine unit tests
```

See parent [`../index.md`](../index.md) for the full domain specification.
