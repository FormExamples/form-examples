# Ottawa Ankle Rules — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the Ottawa Ankle / Foot Rules specification and decision engine. Lily Svelte
headless conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

## Layout

- `src/lib/engine/` — pure decision engine (`types.ts`, `utils.ts`,
  `ottawa-ankle-rules.ts`, `ottawa-ankle-grader.ts`, `flagged-issues.ts`) +
  `ottawa-ankle-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections.
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document.
- `src/routes/ottawa-ankle-ruleses/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Decision engine

Boolean DECISION RULE, not a score: no total and no risk band. Two independent
imaging decisions plus a shared derived input.

- `unableToBearWeight = ableToBearWeightImmediately == 'no' && ableToBearWeightNow == 'no'`
- `ankleXrayIndicated = malleolarZonePain == 'yes' && (lateralMalleolusTenderness == 'yes' || medialMalleolusTenderness == 'yes' || unableToBearWeight)`
- `footXrayIndicated = midfootZonePain == 'yes' && (fifthMetatarsalBaseTenderness == 'yes' || navicularTenderness == 'yes' || unableToBearWeight)`

The two decisions are independent; `unableToBearWeight` feeds both. `''`
(unanswered) is treated as negative for the decision but raises a
data-completeness flag.

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names in TypeScript.
- Store submit-time validation + `ErrorSummary`; `Form.svelte` carries
  `novalidate` (native constraint validation must not block submit).
- Full Lily token migration — no hardcoded palette classes.
- HTML entities (`&lt; &gt; &le; &ge;`) for comparison operators in template text.

## Verify

```sh
pnpm run check && pnpm run build && pnpm exec vitest run
```
