# Waterlow — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the Waterlow specification and scoring engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure scoring engine (`types.ts`, `utils.ts`,
  `waterlow-rules.ts`, `waterlow-grader.ts`, `flagged-issues.ts`) +
  `waterlow-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/waterlow-pressure-ulcer-risk-assessments/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Scoring engine

Summed weighted score (higher = worse): each core category maps its selected
enum to points; sex-and-age adds `sexPoints + agePoints`; each special-risk
group maps its highest applicable enum to points. All contributions are summed
into `waterlowScore`, which selects a risk band (low under 10, at-risk 10-14,
high 15-19, very-high 20 or more) and a recommended prevention action. A missing
core input contributes 0 points and raises a data-completeness flag. Flags: very
high risk, high risk, at risk, existing pressure damage, multiple special risk
factors, incomplete assessment. See spec §4-§5.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- British English throughout (oedematous, faeces, anaemia).
- Full Lily token migration — no hardcoded palette classes.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
