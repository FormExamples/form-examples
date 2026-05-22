# US HIPAA Authorization — review dashboard (SvelteKit)

SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) review dashboard for
signed HIPAA authorizations.

## Stack

- SvelteKit 2.x with Vite
- Svelte 5 runes
- TypeScript
- Tailwind CSS 4
- `@svar-ui/svelte-grid` with the Willow theme
- Backend API client with sample-data fallback for standalone dev

## Columns

- Patient name
- Recipient organisation
- Primary purpose (dropdown filter)
- Records categories included
- Expiration date (sortable)
- Validity status (dropdown filter: valid / invalid / expired / revoked)
- High-priority flags count (sortable)
- Signed-at date

## Develop

```sh
pnpm install
pnpm dev
```
