# Hip Replacement Surgery Evaluation — SvelteKit front-end

SvelteKit 2 + Svelte 5 + TypeScript + Tailwind 4 single-page hip-replacement
surgery evaluation wizard: fifteen steps on one continuous page that compute
an Oxford Hip Score (OHS) total and category, and a surgical-candidacy
recommendation, then a set of safety flags and a signed PDF report.

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
| `/` | welcome page: what the form is, and links to the working surfaces |
| `/hip-replacement-surgery-evaluation/` | the fifteen-step wizard |
| `/hip-replacement-surgery-evaluations/` | review dashboard: OHS, candidacy, flags |
| `/hip-replacement-surgery-evaluations/[id]/` | evaluation detail / report view |

## Engine

`src/lib/engine/` holds the pure scoring engine. `calculateHipEvaluation()` in
`grader.ts` is the single entry point; it composes `ohs-rules.ts` and
`flagged-issues.ts`. It performs no I/O and never reads the clock — the caller
supplies the assessment date, so age is derived from recorded data and the
function is deterministic.

`grader.test.ts` asserts both sides of every OHS category boundary (19/20,
29/30, 39/40) and every candidacy rule-order boundary, and that the clinician
override never suppresses a safety flag. The HTML front-end runs an identical
engine against the same cases, so the two implementations cannot silently
diverge.

## Steps

The fifteen step components live in `src/lib/components/steps/` as
`StepNName.svelte`, one per wizard section, and all fifteen are rendered into
the single page in document order.

## Conventions

See the form root [`../AGENTS.md`](../AGENTS.md) and the Lily Svelte contract
in [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).
