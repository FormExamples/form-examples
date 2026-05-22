# UK LPA dashboard — SvelteKit + SVAR DataGrid

SvelteKit + Svelte 5 + Tailwind 4 dashboard for reviewing LPA records.
Uses **SVAR DataGrid** (`@svar-ui/svelte-grid`) with the Willow theme for
sortable columns, dropdown filters, and column resizing.

## Stack

- SvelteKit 2, Svelte 5 runes, TypeScript, Tailwind CSS 4.
- SVAR DataGrid for tabular data.
- Sample-data fallback so the dashboard runs standalone.

## Columns

- Donor name (masked)
- Attorney count / replacement-attorney count
- Decision-rule type
- Life-sustaining-treatment option
- Validity status (badge: green `ready-to-register`,
  amber `needs-correction`, red `invalid`)
- Completeness score
- Registration stage
- Updated-at

## Running

```sh
pnpm install
pnpm dev
```
