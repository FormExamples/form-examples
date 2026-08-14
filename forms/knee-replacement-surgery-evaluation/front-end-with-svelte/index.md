# Knee Replacement Surgery Evaluation — SvelteKit front-end

SvelteKit 2 + Svelte 5 + TypeScript + Tailwind 4 single-page knee-replacement
surgery evaluation wizard: fifteen steps on one continuous page that compute
an Oxford Knee Score (OKS) total with its category, a Kellgren-Lawrence
radiographic grade, a surgical-candidacy recommendation, a set of safety
flags, and a signed PDF report.

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
| `/` | redirect into the form |
| `/knee-replacement-surgery-evaluation/` | welcome page: what the form is, and links to the two working surfaces |
| `/knee-replacement-surgery-evaluation/knee-replacement-surgery-evaluations/` | review dashboard: OKS total/category, candidacy, flags |
| `/knee-replacement-surgery-evaluation/knee-replacement-surgery-evaluations/[id]/` | the fifteen-step wizard (`new` for a fresh evaluation) |
| `/knee-replacement-surgery-evaluation/knee-replacement-surgery-evaluations/[id]/report/` | the signed report |
| `/knee-replacement-surgery-evaluation/knee-replacement-surgery-evaluations/[id]/report/pdf` | `POST` endpoint returning the PDF |

## Engine

`src/lib/engine/` holds the pure scoring engine. `calculateKneeEvaluation()`
in `grader.ts` is the single entry point; it composes `oks-rules.ts` and
`flagged-issues.ts`. It performs no I/O and never reads the clock — the
caller supplies the assessment date, so age is derived from recorded data and
the function is deterministic.

`grader.test.ts` asserts both sides of every OKS category threshold (19/20,
29/30, 39/40), the full five-rule surgical-candidacy precedence order, the
clinician override, and that a flag is never suppressed by that override. The
HTML front-end runs an identical engine against the same cases, so the two
implementations cannot silently diverge.

## Steps

The fifteen step components live in `src/lib/components/steps/` as
`StepNName.svelte`, one per wizard section, and all fifteen are rendered into
the single page in document order. The step list at the top is a table of
contents with completion status, not a pager.

## State

`src/lib/stores/evaluation.svelte.ts` holds the reactive evaluation as a
`$state` rune and persists it to `localStorage` under
`knee-replacement-surgery-evaluation.front-end-with-svelte.<id>.v1`. On load
the stored value is merged over a fresh default, so fields added in a later
version do not orphan an existing draft.

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
