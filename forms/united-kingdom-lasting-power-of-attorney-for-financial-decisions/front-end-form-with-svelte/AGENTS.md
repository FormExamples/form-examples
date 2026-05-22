# Front-end form with SvelteKit — Agent Instructions

SvelteKit 2 + Svelte 5 + Tailwind CSS 4 implementation of the 15-step LPA
wizard (LP1F sections 1–15). Pure validator under `src/lib/validator/`,
generic UI primitives under `src/lib/components/ui/`, step components
under `src/lib/components/steps/`.

See [`../AGENTS.md`](../AGENTS.md) for the full form-level agent contract,
the validator's input/output shape, and the statutory blocker rules.

## Conventions

- Svelte 5 runes only: `$state`, `$derived`, `$bindable`, `$props`. No
  `export let`, no legacy stores.
- camelCase property names matching `src/lib/types.ts`.
- Tailwind CSS 4: `@import 'tailwindcss';` in `src/app.css`; no
  `tailwind.config.js`.
- Validator is pure: every rule is a function `(lpa) => FiredRule | null`.
- Step components named `StepNName.svelte` (1-indexed, non-padded).
- One step component matches one LP1F section.

## Stack

- SvelteKit 2.x.
- Svelte 5.
- Tailwind CSS 4 + `@tailwindcss/vite`.
- TypeScript strict.
- pdfmake for the printable LP1F replica.
- Vitest for engine tests.

## Verify

```sh
pnpm install
pnpm run check
pnpm test
```
