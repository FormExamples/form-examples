# Return to Work — SvelteKit dashboard Agent Instructions

SvelteKit + SVAR DataGrid dashboard. See [`index.md`](./index.md) for
the column layout.

## Stack

- SvelteKit 2.x + Svelte 5 runes
- TypeScript strict
- Tailwind CSS 4
- `@svar-ui/svelte-grid` with the Willow theme
- Vitest

## Conventions

- camelCase JSON property names from the backend API.
- Status / fitness / restriction-priority enums become themed
  badges via `StatusBadge.svelte`.
- API client in `lib/api/client.ts` with a sample-data fallback for
  standalone development.

## Running

```sh
pnpm install
pnpm run dev
pnpm exec vitest run
pnpm run check
```
