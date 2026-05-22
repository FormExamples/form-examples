# Front-end dashboard with SvelteKit — Agent Instructions

SvelteKit 2 + Svelte 5 dashboard using SVAR DataGrid for the LPA review
table. Reads LPAs via `fetchLpas()` and renders them as one row per LPA.

See [`../AGENTS.md`](../AGENTS.md) for the form-level agent contract and the
canonical `Lpa` type.

## Conventions

- Svelte 5 runes only: `$state`, `$derived`, `$props`.
- camelCase property names matching the canonical `Lpa` type.
- Tailwind CSS 4: `@import 'tailwindcss';` in `src/app.css`.
- SVAR Grid Willow theme via `<Willow><Grid /></Willow>`.
- Column definitions live in `src/lib/columns.ts`.
- The sample-data fallback in `src/lib/sample-data.ts` is the source of
  truth when no backend is reachable.

## Stack

- SvelteKit 2.x.
- Svelte 5.
- Tailwind CSS 4 + `@tailwindcss/vite`.
- `@svar-ui/svelte-grid`.

## Verify

```sh
pnpm install
pnpm run check
```
