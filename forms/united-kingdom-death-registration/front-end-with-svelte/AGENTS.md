# United Kingdom death registration — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and classification / validation engine. Lily Svelte
headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **completeness and validity** instrument — the engine emits a registration
class (`ready-to-register` / `incomplete` / `referred-to-coroner-pending` /
`registered`), the 5-day deadline status, the days since the medical examiner's
confirmation, a qualified-informant flag, the blocking rules and a set of flagged
issues. There is **no numeric score**, and it is **not legal advice**.

## Layout

- `src/lib/engine/` — pure classification / validation engine (`types.ts`,
  `utils.ts`, `registration-rules.ts`, `registration-grader.ts`, `flagged-issues.ts`) +
  `registration-grader.test.ts` (also replays `examples/personas.json`).
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultRegistration()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (6 steps: deceased, medical examiner, coroner, informant, appointment, aftercare).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/united-kingdom-death-registrations/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Ported from the HTML front-end's `js/{types,rules,grader,flags}.js`. The grader
`validateRegistration(data)` evaluates the coroner status, the blocking rules and the
5-day clock, assigns one registration class (precedence `referred-to-coroner-pending`
> `incomplete` > `registered` > `ready-to-register`), and calls `detectFlaggedIssues`.
All functions are pure; the assessment date is `registration.asOfDate`, never the
wall clock.

## Conventions

- camelCase property names mirror the snake_case SQL columns.
- Text / enum fields default to `''`; numeric, date, and time fields default to `null`.
- Generic Lily `Badge`; no cardiovascular entry components.
- Engine tests use a LOCAL `createDefaultRegistration` fixture (no store import).
- HTML entities `&lt; &gt; &le; &ge;` in Svelte template text.

## Verify

```sh
pnpm install
pnpm run check
pnpm run build
pnpm exec vitest run
```
