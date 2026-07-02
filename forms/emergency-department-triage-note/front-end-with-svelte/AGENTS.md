# Emergency Department Triage Note — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the ED triage specification and classification engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `utils.ts`,
  `ed-triage-rules.ts`, `ed-triage-grader.ts`, `flagged-issues.ts`) +
  `ed-triage-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/emergency-department-triage-notes/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Classification engine

Ported faithfully from the tested HTML front-end
(`front-end-with-html/js/{types,rules,grader,flags}.js`). This is a
**classification**, not a summed score. The engine evaluates the Manchester
Triage System discriminators (boolean flags + derived ACVPU / SpO2 / pain
findings), computes a supporting NEWS2 aggregate, applies NEWS2 escalation
(≥ 7 or any parameter 3 → at least Level 2; 5-6 → at least Level 3), and assigns
`priorityLevel` = the most urgent (lowest) level any finding forces. Colour,
name, and target time derive from the level. Missing vital signs never lower the
category.

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
