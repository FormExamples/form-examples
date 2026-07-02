# Ward Round Note — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the Ward Round Note specification and completeness engine. Lily Svelte
headless conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation and completeness** form — the engine grades the entry
`complete` / `partial` / `incomplete` with a completeness percentage and raises
safety flags. There is no numeric score.

## Layout

- `src/lib/engine/` — pure completeness engine (`types.ts`, `utils.ts`,
  `ward-round-rules.ts`, `ward-round-grader.ts`, `flagged-issues.ts`) +
  `ward-round-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (11 steps: header, patient, overnight, problems, examination, investigations,
  VTE, medication, plan, escalation, summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (completeness, not score).
- `src/routes/ward-round-notes/` — RESTful routes: `/<plural>/` (dashboard,
  `ssr = false`) + `/<plural>/[id]` (wizard) + `/<plural>/[id]/report` (+
  `report/pdf` server endpoint).

## Engine

Documentation completeness (no total):

```
completenessPercent = round(100 * documentedRequired / 8)
status =
  (documentedRequired == 8)                       -> 'complete'
  (header && plan && documentedRequired >= 4)     -> 'partial'
  otherwise                                       -> 'incomplete'
```

Eight required components (`header`, `problems`, `examination`,
`investigations`, `vte`, `medication`, `plan`, `escalation`) and two recommended
(`overnight-events`, `estimated-discharge`). An explicit negative flag (e.g. "no
changes", "none outstanding") counts as documented. `calculateWardRoundGrade`
returns the completeness status, the completeness percentage, the per-component
presence, the fired-rule audit trail, and the safety flags.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
