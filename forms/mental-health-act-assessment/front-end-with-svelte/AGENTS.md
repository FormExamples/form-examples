# Mental Health Act Assessment — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the specification and classification / validation engine. Lily Svelte
headless conventions:
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **documentation and legal-completeness** instrument — the engine emits
a completeness status (`valid` / `incomplete`), a recommended-section class, and
an urgency class, plus the required-signatory and criteria checklists. There is
no numeric score, and it makes **no automated decision to detain**.

## Layout

- `src/lib/engine/` — pure classification / validation engine (`types.ts`,
  `utils.ts`, `mha-rules.ts`, `mha-grader.ts`, `flagged-issues.ts`) +
  `mha-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (9 steps: context, identification, professionals, mental disorder, risk,
  least-restrictive, treatment, nearest relative, recommendation).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/mental-health-act-assessments/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Ported from the HTML front-end's `js/{types,rules,grader,flags}.js`. The grader
`gradeMentalHealthActAssessment(data)` maps the recommended section to a class,
evaluates the class's required signatories and criteria, derives the
completeness status and urgency, and calls `detectFlaggedIssues`. All functions
are pure — no I/O, no automated detention decision.

## Conventions

- camelCase property names mirror the snake_case SQL columns.
- Text / enum fields default to `''`; date / time fields default to `''`
  (datetime-local strings).
- Generic Lily `Badge`; no cardiovascular entry components.
- Engine tests use a LOCAL `createDefaultAssessment` fixture (no store import).
- HTML entities `&lt; &gt; &le; &ge;` in Svelte template text.

## Verify

```sh
pnpm install
pnpm run check
pnpm run build
pnpm exec vitest run
```
