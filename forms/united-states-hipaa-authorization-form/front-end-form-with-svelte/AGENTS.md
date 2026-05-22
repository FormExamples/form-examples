# front-end-form-with-svelte — Agent Instructions

SvelteKit 2.x + Svelte 5 + Tailwind 4 implementation of the 9-step
HIPAA-authorization wizard.

## Stack and conventions

- SvelteKit 2.x; Vite; TypeScript.
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`, `$effect`).
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme` for tokens.
- Step components in `src/lib/components/steps/StepNName.svelte`,
  1-indexed.
- UI components in `src/lib/components/ui/`.
- Engine modules in `src/lib/engine/` as pure functions.
- Class-based reactive store in `src/lib/stores/authorization.svelte.ts`.
- Dynamic step route at `src/routes/authorization/[step=step]/+page.svelte`
  with the `step` param matcher in `src/params/step.ts` validating
  1..9.
- `serde(rename_all = "camelCase")` parity: TypeScript uses camelCase;
  payloads to the Rust backend serialise to the same shape.
- Empty string `''` for unanswered text / enum fields; `null` for
  unanswered numeric or date fields.

## Files of note

- `src/lib/engine/validate-authorization.ts` — engine entrypoint.
- `src/lib/engine/validation-rules.ts` — core-element rules.
- `src/lib/engine/sensitive-category-rules.ts` — federal and state
  sensitive-category rules.
- `src/lib/engine/flagged-issues.ts` — additional-flag detection.
- `src/lib/engine/types.ts` — `HipaaAuthorization` shape.

## Tests

- Vitest unit tests for `validate-authorization.test.ts`,
  `sensitive-category-rules.test.ts`, `expiration-rules.test.ts`.
- Optional Playwright e2e under `tests/e2e/`.

## Develop

```sh
pnpm install
pnpm dev
```
