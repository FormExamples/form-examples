# Dietetic Assessment — SvelteKit front-end

SvelteKit 2 + Svelte 5 + TypeScript + Tailwind 4 single-page dietetic
assessment wizard: sixteen steps on one continuous page that compute a MUST
score with its risk category, a GLIM malnutrition diagnosis, NRS-2002, SARC-F,
SCOFF, and refeeding-syndrome risk, then a composite nutrition risk, a set of
safety flags, and a signed PDF report.

## Stack

- SvelteKit 2.x
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`, `$effect`)
- TypeScript strict
- Tailwind CSS 4 (`@import 'tailwindcss'`, `@theme`)
- `pdfmake` for server-side PDF generation
- Vitest for engine unit tests
- Lily Design System Svelte headless components in `src/lib/components/ui/`

## Routes

| Route | Purpose |
| --- | --- |
| `/` | 307 redirect to `/dietic-assessment/` |
| `/dietic-assessment/` | welcome page: what the form is, and links to the two working surfaces |
| `/dietic-assessment/dietic-assessments/` | review dashboard: MUST, GLIM, refeeding risk, composite risk, flags |
| `/dietic-assessment/dietic-assessments/[id]/` | the sixteen-step wizard (`new` for a fresh assessment) |
| `/dietic-assessment/dietic-assessments/[id]/report/` | the signed report |
| `/dietic-assessment/dietic-assessments/[id]/report/pdf` | `POST` endpoint returning the PDF |

## Engine

`src/lib/engine/` holds the pure scoring engine. `calculateNutritionRisk()` in
`grader.ts` is the single entry point; it composes `must-rules.ts`,
`glim-rules.ts`, and `flagged-issues.ts`. It performs no I/O and never reads the
clock — the caller supplies the assessment date, so age is derived from recorded
data and the function is deterministic.

`grader.test.ts` asserts both sides of every MUST threshold (BMI 18.5 and 20.0,
weight loss 5% and 10%), the mid-upper-arm-circumference fallback, the GLIM
age bands, the NICE CG32 refeeding criteria, and that a dietitian override
never suppresses a safety flag. The HTML front-end runs an identical engine
against the same cases, so the two implementations cannot silently diverge.

## Steps

The sixteen step components live in `src/lib/components/steps/` as
`StepNName.svelte`, one per wizard section, and all sixteen are rendered into
the single page in document order. The step list at the top is a table of
contents with completion status, not a pager.

## State

`src/lib/stores/assessment.svelte.ts` holds the reactive assessment as a
`$state` rune and persists it to `localStorage` under
`dietic-assessment.front-end-with-svelte.<id>.v1`. On load the stored value is
merged over a fresh default, so fields added in a later version do not orphan
an existing draft — which matters when the appointment runs 45 to 60 minutes.

## Develop

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm check      # svelte-check
pnpm test       # vitest
pnpm build
```

## Conventions

See the form root [`../AGENTS.md`](../AGENTS.md) and the Lily Svelte contract
in [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).
