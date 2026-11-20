# United Kingdom Vehicle Registration Application — SvelteKit front-end (form + dashboard)

SvelteKit + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR DataGrid
for the dashboard. Lily Design System (Svelte headless) component contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and the validity engine. Lily Svelte headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **completeness and validity** instrument — the engine emits a validity
class (`ready-to-submit` / `incomplete` / `needs-supporting-documents`), the fee
due, the missing-item count, the rules that fired, and a set of flagged issues.
There is **no numeric score**, and it makes **no decision** on the application:
only the DVLA decides.

## Layout

- `src/lib/engine/` — pure engine (`types.ts`, `utils.ts`, `vra-rules.ts`,
  `vra-grader.ts`, `flagged-issues.ts`) + `vra-grader.test.ts`, which also
  replays `../examples/personas.json`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultApplication()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (7 steps: application, applicant, keeper, vehicle, evidence, import, fee and
  declaration).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (validity report).
- `src/routes/united-kingdom-vehicle-registration-application/vehicle-registration-applications/`
  — RESTful routes: `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]`
  (wizard) + `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Ported from the HTML front-end's `js/{types,rules,grader,flags}.js`.
`validateApplication(data)` evaluates the data items, documents, and fee, assigns
exactly one validity class (first match wins: `incomplete` >
`needs-supporting-documents` > `ready-to-submit`), computes the fee due, and calls
`detectFlaggedIssues`. All functions are pure: no I/O, no wall clock.

## Conventions

- camelCase property names mirror the snake_case SQL columns.
- Text / enum fields default to `''`; numeric, date, and time fields default to `null`.
- Engine tests use a LOCAL blank-application fixture (no store import).
- HTML entities `&lt; &gt; &le; &ge;` in Svelte template text.

## Verify

```sh
pnpm install
pnpm run check
pnpm run build
pnpm exec vitest run
pnpm run lint && pnpm run format:check
```
