# United Kingdom Birth Registration — SvelteKit front-end (form + dashboard)

SvelteKit + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and the readiness engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is an **administrative completeness-and-validity** instrument: the engine
emits a readiness class (`ready-to-submit` / `incomplete` /
`needs-additional-evidence` / `out-of-scope`), the days from birth to
registration against the 42-day period, and a set of flagged issues. There is
**no numeric score**, and it does **not** register a birth or replace the
registrar.

## Layout

- `src/lib/engine/` — pure engine (`types.ts`, `utils.ts`, `rules.ts`,
  `grader.ts`, `flagged-issues.ts`) + `grader.test.ts`, which also replays every
  persona in `../examples/personas.json` so the TypeScript engine cannot drift
  from the HTML engine.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultRegistration()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (5 steps: child, mother, parentage, informant, certificate).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample applications (from the personas) +
  engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/united-kingdom-birth-registration/` — welcome page and
  `united-kingdom-birth-registrations/`: dashboard (`ssr = false`), `[id]`
  wizard, `[id]/report` (+ `report/pdf` server endpoint).

## Engine

Ported from the HTML front-end's `js/{types,rules,grader,flags}.js`. The grader
`validateRegistration(data)` assigns one readiness class (first match wins:
`out-of-scope` > `incomplete` > `needs-additional-evidence` >
`ready-to-submit`) and calls `detectFlaggedIssues`. All functions are pure: no
I/O, and days are counted between the two entered dates, never from the clock.

## Conventions

- camelCase property names mirror the snake_case SQL columns.
- Text / enum fields default to `''`; numeric, date, and time fields default to `null`.
- Engine tests use a LOCAL blank-application fixture (no store import).

## Verify

```sh
pnpm install
pnpm run check
pnpm exec vitest run
pnpm run lint && pnpm run format:check
```
