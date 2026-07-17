# Clinical Biology Waiting List Card — SvelteKit practitioner form

SvelteKit 2.x single-page wizard for practitioners. See the form-level
[`../AGENTS.md`](../AGENTS.md) for the data model, scoring engine, and
conventions, and
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md) for
shared monorepo conventions.

## Stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`, `$effect`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for server-side PDF generation
- Vitest for unit tests
- Dynamic step route `/card/[step=step]/+page.svelte` with `step` param
  matcher validating 1–7

## Conventions

- Empty string `''` for unanswered text and enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase TypeScript property names.
- Step components named `StepNName.svelte` (1-indexed; no spaces).
- UI components in `src/lib/components/ui/`.
- Scoring engine modules in `src/lib/engine/` are pure (no I/O).
