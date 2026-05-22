# Front-end dashboard with SvelteKit — UK LPA for Financial Decisions

A SvelteKit 2 + Svelte 5 dashboard that reviews a collection of LPAs in a
sortable, filterable SVAR DataGrid. One row per LPA, columns surfacing the
donor name, the attorney count, the decision mode, the validity band, the
composite risk, and the OPG registration status. A drill-down page shows
the full LPA, including its fired blocker rules and additional flags.

See [`../index.md`](../index.md) for the form spec.

## Stack

- SvelteKit 2 + TypeScript.
- Svelte 5 runes: `$state`, `$derived`, `$props`.
- Tailwind CSS 4.
- `@svar-ui/svelte-grid` with the Willow theme.

## Layout

- `src/lib/types.ts` — re-export of the canonical `Lpa` type from the
  sibling form.
- `src/lib/sample-data.ts` — fixture LPAs covering draft, partially-signed,
  fully-signed, registered, blocker-triggered, and flag-triggered states.
- `src/lib/api.ts` — `fetchLpas()` with sample-data fallback.
- `src/lib/columns.ts` — SVAR column definitions.
- `src/routes/+page.svelte` — the grid plus a donor-name search filter.
- `src/routes/lpa/[id]/+page.svelte` — drill-down with badges for fired
  rules and additional flags.

## Run

```sh
pnpm install
pnpm run dev
pnpm run check
```
