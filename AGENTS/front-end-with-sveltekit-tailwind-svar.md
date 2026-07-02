# Front-end with SvelteKit Tailwind SVAR (Lily Svelte headless)

> **Legacy layout note.** This document describes the older *split* layout
> (`front-end-form-with-svelte/` + `front-end-dashboard-with-svelte/`),
> which survives only in unconsolidated forms. The gold standard is the
> single consolidated `front-end-with-svelte/` app documented in
> [`../forms/AGENTS-front-end-svelte.md`](../forms/AGENTS-front-end-svelte.md);
> the technology stack below (SvelteKit + Tailwind 4 + SVAR + pure Svelte 5
> engine) applies to both layouts.

SvelteKit single-page form and SVAR-based dashboard, styled with Tailwind
CSS 4 and powered by a pure Svelte 5 reactive scoring engine. The
**Lily Design System Svelte headless** library defines the component
contract every form's `src/lib/components/ui/` must satisfy.

The cross-stack UX rules live in [`../spec.md`](../spec.md) §5; the
component contract lives in
[`../forms/AGENTS-front-end-svelte.md`](../forms/AGENTS-front-end-svelte.md).
The per-form domain spec is at `forms/<slug>/spec/index.md`.

Slug: front-end-with-sveltekit-tailwind-svar

- Search patterns (legacy split layout):
  - `forms/*/front-end-form-with-svelte` — patient questionnaire (single-page wizard)
  - `forms/*/front-end-dashboard-with-svelte` — dashboard (SVAR DataGrid)
  - `forms/*/front-end-with-svelte` — consolidated app (gold standard)

## Technology stack

| Component                                                 | Version | Purpose                                                         |
| --------------------------------------------------------- | ------- | --------------------------------------------------------------- |
| [SvelteKit](https://svelte.dev/docs/kit/introduction)     | 2.x     | Full-stack web framework                                        |
| [Svelte](https://svelte.dev/)                             | 5.x     | UI reactivity with runes (`$state`, `$derived`, `$props`, `$bindable`) |
| [TypeScript](https://www.typescriptlang.org/)             | 5.x     | Type-safe development                                           |
| [Tailwind CSS](https://tailwindcss.com/)                  | 4.x     | Utility-first styling with `@import 'tailwindcss'` and `@theme` |
| [Lily Svelte headless](https://github.com/LilyDesignSystem/lily-design-system-svelte-headless) | pinned (see `forms/lily-svelte-version.md`) | Headless UI component contract (no CSS); shared class vocabulary with Lily HTML |
| [SVAR Svelte Core](https://svar.dev/svelte/core/)         | 2.x     | Base UI components and Willow theme (dashboards only)           |
| [SVAR Svelte DataGrid](https://svar.dev/svelte/datagrid/) | 2.x     | Data table with sort and filter (dashboards only)               |
| [Vite](https://vite.dev/)                                 | 7.x     | Build tool and dev server                                       |
| [pdfmake](https://pdfmake.github.io/docs/)                | 0.2.x   | Server-side PDF report generation                               |
| [Vitest](https://vitest.dev/)                             | 3.x     | Unit testing for grading logic                                  |

## Svelte 5 runes

- `$state()` — reactive state
- `$derived()` — computed values
- `$bindable()` — two-way prop binding
- `$props()` — component props
- `$effect()` — side effects (used sparingly)

## State management

Svelte 5 class-based reactive state in `src/lib/stores/<name>.svelte.ts`,
typically `assessment.svelte.ts` for clinical forms; non-clinical forms
(e.g. `issue-tracker`, `objectives-and-key-results-tracker`) use a store
name that matches their subject (`issue.svelte.ts`, `formState.svelte.ts`).

Typical fields:

- `.data` — complete questionnaire responses
- `.result` — grading result (null until submitted)
- `.currentStep` — current wizard step
- `.errors` — validation errors keyed by field id
- `.reset()` — clear all data

Do not use Svelte 3/4 `writable` stores. Class-based runes stores are the
convention across this monorepo.

## Lily Svelte component contract

Every `src/lib/components/ui/` component mirrors the Lily Svelte API:

- Same prop signature (`label`, `value = $bindable()`, `required`, `disabled`, `...restProps`).
- Same emitted CSS class names (`text-input`, `radio-group`, `button`, …).
- Same accessibility behaviour (ARIA roles, keyboard handling).

The full vocabulary is in
[`../forms/AGENTS-front-end-svelte.md`](../forms/AGENTS-front-end-svelte.md)
§3. Component source snapshots live in `forms/lily-svelte-spec/` and the
pinned upstream commit is in `forms/lily-svelte-version.md`. Refresh via
`bin/lily-svelte-sync`; drift detection via `bin/lily-svelte-sync --check`.

## Form pattern

1. Single-page, step-by-step wizard using Lily `Progress`, `StepList`,
   `StepListItem`, `Fieldset`, and `Field` components.
2. Pure scoring engine split into small files: `types.ts` →
   `*-rules.ts` → `*-grader.ts` → `flagged-issues.ts`.
3. Class-based reactive store (`assessment.svelte.ts`) owns all
   questionnaire state.
4. Submit-time validation populates an `ErrorSummary` and per-field
   `Field` error slot; `aria-invalid` is set on each erroneous input.
5. PDF report generation via SvelteKit server endpoint (`/report/pdf`)
   using `pdfmake`.
6. Vitest unit tests cover the grading engine end-to-end.

## Dashboard pattern

- `DataTable` (Lily Svelte) for the row list; OR `Willow`-themed `Grid`
  (SVAR DataGrid) for forms that need built-in sort/filter ergonomics.
- Sortable columns, dropdown filters.
- Backend API client with in-memory sample data fallback.
- Row list shows computed scores, severities, and safety flags.

## UI components

Reusable form components in `src/lib/components/ui/`, one Svelte file
per Lily class:

- `$bindable()` props for two-way data flow.
- Tailwind utility classes for styling (the headless Lily contract leaves
  styling to the consumer).
- Proper `<label>` associations and accessible ARIA markup.
- Mobile-first responsive design.

## Conventions

- Empty string `''` for unanswered text and enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript.
- Step components named `StepNName.svelte` (1-indexed; no spaces,
  ampersands, or parentheses in filename).
- UI components in `src/lib/components/ui/`.
- Pure scoring engine — no side effects, no network calls, no `$effect`.
- LocalStorage persistence key: `<slug>.front-end-form-with-svelte.v1`.

## Commands

From a form's `front-end-*-with-svelte/` directory:

```sh
pnpm install              # Install dependencies
pnpm dev                  # Start dev server (default port 5173)
pnpm build                # Production build
pnpm preview              # Preview production build
pnpm check                # Svelte type-check
pnpm test                 # Run Vitest unit tests
```

## Verify

```sh
for d in forms/*/front-end-*-with-svelte; do
  (cd "$d" && pnpm check && pnpm test) || echo "FAIL: $d"
done

bin/lily-svelte-sync --check   # Lily Svelte spec-snapshot drift
```
