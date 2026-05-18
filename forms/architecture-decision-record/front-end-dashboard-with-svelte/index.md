# Front-end Dashboard (SvelteKit)

SvelteKit 2 + Svelte 5 + Tailwind 4 dashboard listing ADRs as a sortable,
filterable register.

## Stack

- SvelteKit 2.x with the `auto` adapter
- Svelte 5 runes (`$state`, `$derived`, `$props`)
- Tailwind 4 via `@tailwindcss/vite`
- `@svar-ui/svelte-grid` declared as a dependency for future grid upgrades;
  the current implementation uses a hand-rolled table for predictability and
  zero runtime cost on small registers (low hundreds of rows).

## Data

- `src/lib/data/sample.ts` — compiled-in sample register
- `src/lib/api/adrs.ts` — fetcher with fallback: tries `/api/adrs`, falls
  back to the sample data when no backend is reachable

## Columns

- **Number** — sequential ADR number, zero-padded
- **Title** — short title (clicking the row opens the Markdown ADR)
- **Status** — pending / decided / approved / superseded / deprecated,
  rendered as a colour-coded pill
- **Group** — Tyree & Akerman category
- **Date** — decision date
- **Author** — name

## Run

```sh
pnpm install
pnpm dev
```
