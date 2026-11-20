# United Kingdom Last Will and Testament — SvelteKit front-end (form + dashboard)

SvelteKit + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and validity engine. Lily Svelte headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **will-drafting documentation and validity-classification**
instrument for England and Wales. The engine emits a validity class (`valid` /
`incomplete` / `formality-risk`), the total of the beneficiary shares, the
witness count, and a set of flagged issues. There is **no numeric score**, and it
is documentation support, **not legal advice**.

## Layout

- `src/lib/engine/` — pure engine (`types.ts`, `utils.ts`, `will-rules.ts`,
  `will-grader.ts`, `flagged-issues.ts`) + `will-grader.test.ts`, which also
  replays `../examples/personas.json`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultWill()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (6 steps: testator, estate, executors, beneficiaries, family, execution).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — one sample per persona + engine-derived
  dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/united-kingdom-last-will-and-testament/united-kingdom-last-will-and-testaments/`
  — RESTful routes: `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]`
  (wizard) + `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Ported from the HTML front-end's `js/{types,rules,grader,flags}.js`. The grader
`validateWill(data)` evaluates the Wills Act 1837 formality predicates and the
content-completeness predicates, assigns one validity class (precedence
`formality-risk` > `incomplete` > `valid`), totals the beneficiary shares, counts
the witnesses, and calls `detectFlaggedIssues`. All functions are pure.

## Conventions

- camelCase property names mirror the snake_case SQL columns.
- Text / enum fields default to `''`; numeric and date fields default to `null`.
- Ordinal slot names (`beneficiaryFirstName`), never digits.
- Generic Lily `Badge`; no clinical entry components.
- HTML entities `&lt; &gt; &le; &ge;` in Svelte template text.

## Verify

```sh
pnpm install
pnpm run check
pnpm run lint && pnpm run format:check
pnpm run build
pnpm exec vitest run
```
