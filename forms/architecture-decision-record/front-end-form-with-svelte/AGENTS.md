# front-end-form-with-svelte — Agent Instructions

SvelteKit 2 + Svelte 5 implementation of the ADR wizard.

## Conventions

- Step components are named `StepNName.svelte` (1-indexed, zero-padded
  in display only).
- All state lives on the singleton `store` exported from
  `$lib/stores/adr.svelte.ts`. Components import `store` and read or
  bind directly to `store.data.*` properties.
- Form data uses camelCase (matches TypeScript and FHIR R5 JSON
  conventions). The SQL schema uses snake_case; the conversion happens
  at the API layer (not implemented in this front-end).
- The `+page.svelte` route imports all 16 step components and renders
  them as a single scrollable list. There is no per-step navigation.
- The `report/+page.svelte` route renders the Markdown ADR via
  `buildMarkdown()` from `$lib/report/build-markdown.ts`.

## When adding fields

1. Update the SQL migration in `../sql-migrations/`.
2. Update `lib/types.ts` and `lib/stores/adr.svelte.ts` (`emptyAdrFormData`).
3. Update the relevant `Step*.svelte`.
4. Update `lib/report/build-markdown.ts` if the field appears in the
   Markdown output.
