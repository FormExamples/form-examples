# Hernia Diagnostic Evaluation — SvelteKit front-end

SvelteKit 2 + Svelte 5 + TypeScript + Tailwind 4 single-page hernia diagnostic
evaluation wizard: fourteen steps on one continuous page that compute a
hernia classification (European Hernia Society type, subtype, laterality,
size grade) and a red-flag-first urgency band (`routine` / `soon` / `urgent` /
`emergency`), then a set of safety flags and a signed referral report.

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
| `/` | redirect into `/hernia-diagnostic-evaluation/` |
| `/hernia-diagnostic-evaluation/` | welcome page: what the form is, and links to the two working surfaces |
| `/hernia-diagnostic-evaluation/hernia-diagnostic-evaluations/` | review dashboard: classification, urgency band, flags |
| `/hernia-diagnostic-evaluation/hernia-diagnostic-evaluations/[id]/` | the fourteen-step wizard (`new` for a fresh evaluation) |
| `/hernia-diagnostic-evaluation/hernia-diagnostic-evaluations/[id]/report/` | the signed report |
| `/hernia-diagnostic-evaluation/hernia-diagnostic-evaluations/[id]/report/pdf` | `POST` endpoint returning the PDF |

## Engine

`src/lib/engine/` holds the pure scoring engine. `calculateHerniaEvaluation()`
in `grader.ts` is the single entry point; it composes `classification-rules.ts`
and `flagged-issues.ts`. It performs no I/O and never reads the clock — the
caller supplies the assessment date, so age is derived from recorded data and
the function is deterministic.

`grader.test.ts` asserts both sides of every urgency-band threshold (any
positive red flag, the pain-score-4 boundary, the EHS-size-grade-3 boundary,
each reducibility transition) and that a clinician override never suppresses a
safety flag. 35 Vitest cases, all passing.

See the form root [`../index.md`](../index.md), [`../AGENTS.md`](../AGENTS.md),
[`../spec/`](../spec), and [`AGENTS.md`](./AGENTS.md) for agent-specific rules.
