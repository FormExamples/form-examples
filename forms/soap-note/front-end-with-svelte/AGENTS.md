# SOAP Note — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the SOAP Note specification and completeness engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation and completeness** form — the engine grades the note
`complete` / `partial` / `incomplete` with a completeness percentage and raises
safety flags. There is no numeric score.

## Layout

- `src/lib/engine/` — pure completeness engine (`types.ts`, `utils.ts`,
  `soap-note-rules.ts`, `soap-note-grader.ts`, `flagged-issues.ts`) +
  `soap-note-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (7 steps: context, patient, and the four SOAP sections S/O/A/P, then summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (completeness, not score).
- `src/routes/soap-notes/` — RESTful routes: `/<plural>/` (dashboard,
  `ssr = false`) + `/<plural>/[id]` (wizard) + `/<plural>/[id]/report` (+
  `report/pdf` server endpoint).

## Engine

Documentation completeness (no total):

```
completenessPercent = round(100 * presentRequiredComponents / totalRequiredComponents)
status =
  (!assessmentPresent || !planPresent)                 -> 'incomplete'
  (completenessPercent == 100 && no high-priority flag) -> 'complete'
  (assessmentPresent && planPresent)                   -> 'partial'
  otherwise                                            -> 'incomplete'
```

Subjective needs both the presenting complaint and its history; Objective,
Assessment, and Plan are each satisfied by any one field in their at-least-one
group. Conditionally-required components: safety-netting and follow-up.
`calculateSoapGrade` returns the completeness status, the completeness
percentage, the per-section presence, the fired-rule audit trail, and the safety
flags.

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
