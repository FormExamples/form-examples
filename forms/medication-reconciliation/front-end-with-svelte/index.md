# Medication Reconciliation — SvelteKit front-end

SvelteKit 2 + Svelte 5 (runes) + Tailwind CSS 4 implementation of the medication
reconciliation wizard and clinician dashboard, sharing one pure reconciliation
engine. A documentation-and-completeness form: the engine derives a **status**
(Complete / Discrepancies outstanding / Incomplete) and per-record counts, not a
numeric score.

## Surfaces

- **Welcome** (`/`) — overview and links to the two working surfaces.
- **Wizard** (`/medication-reconciliations/[id]`) — one continuous single-page
  form of seven sections, including four repeating one-to-many editors
  (information sources, allergies, medication line items, discrepancies).
- **Report** (`/medication-reconciliations/[id]/report`) — status banner, counts,
  medication and discrepancy tables, safety flags; PDF via
  `report/pdf` (`pdfmake`).
- **Dashboard** (`/medication-reconciliations`) — SVAR DataGrid of reconciled
  patients with engine-derived status, counts, and flag count (`ssr = false`).

## Layout

- `src/lib/engine/` — pure engine: `types.ts`, `utils.ts` (labels + colours +
  empty-row factories), `medication-reconciliation-rules.ts`,
  `medication-reconciliation-grader.ts`, `flagged-issues.ts`, and
  `medication-reconciliation-grader.test.ts` (Vitest).
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence (`medication-reconciliation.front-end-with-svelte.<id>.v1`),
  in-place `deepAssign` deep-merge (arrays replaced wholesale so seeded child
  lists reach the editors), `createDefaultReconciliation()`.
- `src/lib/components/ui/ListEditor.svelte` — generic repeating-row editor (add /
  remove) driving all four child lists via a `row` snippet.
- `src/lib/components/steps/StepNName.svelte` — the seven wizard sections.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample reconciliations + engine-derived
  dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.

## Engine

The engine is ported from the HTML front-end (`front-end-with-html/js/`):
`calculateReconciliation(data)` derives the counts and status (spec §4);
`detectFlaggedIssues(data, grade)` raises safety flags (spec §5);
`gradeReconciliation(data)` combines them with a timestamp.

## Verify

```sh
pnpm install
pnpm run check      # svelte-check: 0 errors, 0 warnings
pnpm run build
pnpm exec vitest run
```

See the form root [`../index.md`](../index.md), [`../AGENTS.md`](../AGENTS.md),
and [`../spec/index.md`](../spec/index.md).
