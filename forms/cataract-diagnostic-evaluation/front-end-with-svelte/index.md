# Cataract Diagnostic Evaluation — SvelteKit front-end

SvelteKit 2 + Svelte 5 + TypeScript + Tailwind 4 single-page cataract
diagnostic evaluation wizard: fifteen steps on one continuous page that grade
LOCS III severity per eye, compute a surgical-candidacy recommendation from
severity, best-corrected visual acuity, and glare testing, a functional /
quality-of-life score, a set of safety flags, and a signed PDF report.

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
| `/` | 307 redirect to `/cataract-diagnostic-evaluation/` |
| `/cataract-diagnostic-evaluation/` | welcome page: what the form is, and links to the two working surfaces |
| `/cataract-diagnostic-evaluation/cataract-diagnostic-evaluations/` | review dashboard: LOCS III severity per eye, computed/final surgical candidacy, flags |
| `/cataract-diagnostic-evaluation/cataract-diagnostic-evaluations/[id]/` | the fifteen-step wizard (`new` for a fresh evaluation) |
| `/cataract-diagnostic-evaluation/cataract-diagnostic-evaluations/[id]/report/` | the signed report |
| `/cataract-diagnostic-evaluation/cataract-diagnostic-evaluations/[id]/report/pdf` | `POST` endpoint returning the PDF |

## Engine

`src/lib/engine/` holds the pure scoring engine. `calculateCataractEvaluation()`
in `grader.ts` is the single entry point; it composes `locs-rules.ts` (LOCS III
severity banding and the surgical-candidacy computation) and
`flagged-issues.ts` (independent safety flags). It performs no I/O and never
reads the clock — the caller supplies the assessment date, so age is derived
from recorded data and the function is deterministic.

`grader.test.ts` asserts both sides of every LOCS III severity threshold (3.0
and 5.0 per subscale), the 6/12 and 6/18 LogMAR acuity thresholds, severe
glare overriding a mild LOCS III grade, and that a clinician override never
suppresses a safety flag. The HTML front-end runs an identical engine against
the same cases, so the two implementations cannot silently diverge.

## Steps

The fifteen step components live in `src/lib/components/steps/` as
`StepNName.svelte`, one per wizard section, and all fifteen are rendered into
the single page in document order. The step list at the top is a table of
contents with completion status, not a pager.

## State

`src/lib/stores/evaluation.svelte.ts` holds the reactive evaluation as a
`$state` rune and persists it to `localStorage` under
`cataract-diagnostic-evaluation.front-end-with-svelte.<id>.v1`. On load the
stored value is merged over a fresh default, so fields added in a later
version do not orphan an existing draft — which matters when the full
evaluation runs 1 to 2 hours.

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
