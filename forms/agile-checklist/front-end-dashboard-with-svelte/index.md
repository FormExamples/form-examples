# Agile Checklist — SvelteKit Dashboard

Review dashboard listing recent agile-checklist submissions. Sortable
columns (date, respondent, team, maturity, overall %), dropdown
filters on maturity level and respondent role, sample-data fallback
when no backend is reachable.

## Stack

- SvelteKit 2 + TypeScript
- Svelte 5 runes
- Tailwind CSS 4

## Run

```sh
pnpm install
pnpm dev
```

The dashboard fetches from `/api/checklists`. If that endpoint is
unreachable it falls back to `src/lib/data/sample.ts`.
