# United States Durable Financial Power of Attorney — SvelteKit front-end — Agent Instructions

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and readiness engine. Lily Svelte headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is an **execution-readiness** instrument: the engine emits a validity class
(`ready-to-execute` / `incomplete` / `execution-risk`), the governing state rule,
an execution-risk-indicated flag, and flagged issues, against the Uniform Power
of Attorney Act baseline plus a `STATE_RULES` table (CA, NY, TX, FL, IL, PA, OH,
WA). Documentation support, not legal advice.

## Layout

- `src/lib/engine/` — pure engine: `types.ts`, `defaults.ts`
  (`createDefaultInstrument()`), `utils.ts`, `dpoa-rules.ts` (`STATE_RULES`),
  `dpoa-grader.ts` (`validateInstrument`), `flagged-issues.ts` +
  `dpoa-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge.
- `src/lib/components/steps/` — `StepNName.svelte` wizard sections (6 steps).
- `src/lib/data/sample-reports.ts` — sample plans plus engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` readiness report.
- `src/routes/united-states-durable-financial-power-of-attorney/` — welcome page,
  `<plural>/` dashboard (`ssr = false`), `<plural>/[id]` wizard,
  `<plural>/[id]/report` and `report/pdf`.

## Verify

```sh
pnpm install
pnpm run check
pnpm exec vitest run
pnpm run lint && pnpm run format:check
```
