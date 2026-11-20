# United States Last Will and Testament — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and classification / validation engine. Lily Svelte
headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation and validity-classification** instrument: the engine
emits a validity class (`valid-ready-to-execute` / `incomplete` /
`formality-risk`), the residuary total, the estimated spousal elective share, and
a set of flagged issues, using the Uniform Probate Code and a table of state
rules. There is **no numeric score**, and it gives no legal advice; the probate
court decides whether a will is valid.

## Layout

- `src/lib/engine/` — pure classification / validation engine (`types.ts`,
  `utils.ts`, `will-rules.ts`, `will-grader.ts`, `flagged-issues.ts`) +
  `will-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultWill()` (in `engine/types.ts`).
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (6 steps: testator, family, estate, provisions, execution, self-proving).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — one sample per persona + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (validity report, not a score).
- `src/routes/united-states-last-will-and-testaments/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Ported from the HTML front-end's `js/{types,rules,grader,flags}.js`. The grader
`validateWill(data)` assigns one validity class (precedence `formality-risk` >
`incomplete` > `valid-ready-to-execute`), computes the residuary total and the
estimated elective share, and calls `detectFlaggedIssues`. State rules live in the
`STATE_RULES` table in `will-rules.ts`, which must stay identical to `rules.js`.
All functions are pure: no I/O, no wall clock. `will-grader.test.ts` reads
`../examples/personas.json`, so the two engines cannot drift.

## Conventions

- camelCase property names mirror the snake_case SQL columns.
- Text / enum fields default to `''`; numeric, date, and time fields default to `null`.
- Engine tests never import the store (it pulls in `$app/environment`); they use `createDefaultWill()` from `engine/types.ts`.
- HTML entities `&lt; &gt; &le; &ge;` in Svelte template text.

## Verify

```sh
pnpm install
pnpm run check
pnpm run build
pnpm exec vitest run
```
