# C-SSRS — SvelteKit front-end (form + dashboard)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests. SVAR
DataGrid for the dashboard. Lily Design System (Svelte headless) component
contract.

See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md)
for the C-SSRS specification and classification engine. Lily Svelte headless
conventions: [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

This is a **status- and severity-classification** form — the engine derives a
**Low / Moderate / High** risk tier from the highest affirmative ideation level
(0-5), the presence and recency of suicidal behaviour, and lethality. There is
no summed score.

## Layout

- `src/lib/engine/` — pure classification engine (`types.ts`, `utils.ts`,
  `cssrs-rules.ts`, `cssrs-grader.ts`, `flagged-issues.ts`) +
  `cssrs-grader.test.ts`.
- `src/lib/stores/assessment.svelte.ts` — id-keyed Svelte 5 store, localStorage
  persistence, in-place `deepAssign` deep-merge, `createDefaultAssessment()`.
- `src/lib/components/steps/` — `StepNName.svelte` (1-indexed) wizard sections
  (8 steps: context, patient, ideation, intensity, behaviour, lethality, means,
  summary).
- `src/lib/components/ui/` — Lily Svelte headless component set.
- `src/lib/config/` — `steps.ts`, `themes.ts`.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/report/pdf-builder.ts` — `pdfmake` document (classification, not score).
- `src/routes/columbia-suicide-severity-rating-scales/` — RESTful routes:
  `/<plural>/` (dashboard, `ssr = false`) + `/<plural>/[id]` (wizard) +
  `/<plural>/[id]/report` (+ `report/pdf` server endpoint).

## Engine

Classification algorithm (ordinal + categorical, no total):

```
ideationLevel = highest N in 1..5 whose ideation item == 'yes', else 0
suicidalBehaviourPresent = actual | interrupted | aborted attempt | preparatory acts
recentBehaviour = suicidalBehaviourPresent && behaviourRecency == 'within-3-months'
highLethality   = actualLethality >= 3 || potentialLethality == 2

riskTier = HIGH     if ideationLevel >= 4 || recentBehaviour || highLethality
           MODERATE else if ideationLevel == 3 || suicidalBehaviourPresent
           LOW      otherwise
```

Non-suicidal self-injury is tracked separately and does not set a tier.
`calculateCssrsGrade` returns the ideation level, behaviour and lethality
booleans, the risk tier, the management recommendation, the fired-criteria audit
trail, and the flagged issues.

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
