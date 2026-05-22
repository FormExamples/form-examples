# front-end-dashboard-with-svelte — Agent Instructions

SvelteKit + SVAR DataGrid review dashboard for signed HIPAA
authorizations.

## Stack and conventions

- SvelteKit 2.x; Vite; TypeScript.
- Svelte 5 runes.
- Tailwind CSS 4 with `@import 'tailwindcss'`.
- `@svar-ui/svelte-grid` with the Willow theme.
- Sortable columns and dropdown filters via the SVAR API.
- API client at `src/lib/api/authorizations.ts` falls back to sample
  data in `src/lib/sample-data.ts` when the backend is unreachable.

## Data shape

The grid binds to an array of `AuthorizationSummary`:

```ts
type AuthorizationSummary = {
  id: string;
  patientName: string;
  recipientOrganization: string;
  primaryPurpose: string;
  categories: string[];
  expirationDate: string | null;
  validityStatus: 'valid' | 'invalid' | 'expired' | 'revoked';
  highPriorityFlags: number;
  signatureDate: string | null;
};
```

## Develop

```sh
pnpm install
pnpm dev
```
