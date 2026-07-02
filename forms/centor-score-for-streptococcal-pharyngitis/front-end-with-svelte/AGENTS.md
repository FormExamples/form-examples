# Centor Score for Streptococcal Pharyngitis — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the Centor / McIsaac specification and scoring engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure scoring engine (`types.ts`, `utils.ts`,
  `centor-rules.ts`, `centor-grader.ts`, `flagged-issues.ts`) + `centor-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/centor-score-for-streptococcal-pharyngitises/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Scoring engine

Four Centor criteria (tonsillar exudate, tender anterior cervical nodes, fever,
absence of cough) each score 0 or 1 for a Centor total of 0–4. The McIsaac age
modifier (+1 for ages 3–14, 0 for 15–44, −1 for ≥ 45; 0 when age is missing)
gives a modified score of −1 to 5, which bands the probability: `≤ 1` → low,
`2–3` → moderate, `4–5` → high. The fever criterion also fires when a measured
temperature exceeds 38.0 °C. Flags: airway/quinsy red flag (any red-flag input,
high), antibiotic consideration (McIsaac ≥ 4, high), testing consideration
(McIsaac 2–3, medium), antimicrobial stewardship (McIsaac ≤ 1, low), incomplete
assessment (any criterion input or age missing, low).

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
