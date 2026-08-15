# Health Screening Questionnaire — SvelteKit front-end

SvelteKit 2 + Svelte 5 + TypeScript + Tailwind 4 single-page health screening
wizard: fourteen steps on one continuous page that compute a PAR-Q+ clearance
status, an AUDIT-C alcohol score and band, a composite risk band, a referral
recommendation, and a set of safety flags, then a signed PDF report.

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
| `/` | 307 redirect to `/health-screening-questionnaire/` |
| `/health-screening-questionnaire/` | welcome page: what the form is, and links to the two working surfaces |
| `/health-screening-questionnaire/health-screening-questionnaires/` | review dashboard: PAR-Q+ clearance, AUDIT-C band, risk band, flags |
| `/health-screening-questionnaire/health-screening-questionnaires/[id]/` | the fourteen-step wizard (`new` for a fresh screening) |
| `/health-screening-questionnaire/health-screening-questionnaires/[id]/report/` | the signed report |
| `/health-screening-questionnaire/health-screening-questionnaires/[id]/report/pdf` | `POST` endpoint returning the PDF |

## Engine

`src/lib/engine/` holds the pure scoring engine. `calculateHealthScreening()`
in `grader.ts` is the single entry point; it composes `parq-rules.ts`,
`audit-c-rules.ts`, and `flagged-issues.ts`. It performs no I/O and never
reads the clock — the caller supplies the assessment date, so age is derived
from recorded data and the function is deterministic.

`grader.test.ts` asserts both sides of every PAR-Q+ item and both AUDIT-C
thresholds (5 / 4 increasing-risk, 8 higher-risk), the max-grade composite
risk band ordering, paediatric routing, and that an assessor override never
suppresses a safety flag. The HTML front-end runs an identical engine against
the same cases (`js/cross-check.mjs`), so the two implementations cannot
silently diverge.

## Steps

The fourteen step components live in `src/lib/components/steps/` as
`StepNName.svelte`, one per wizard section, and all are rendered into the
single page in document order. Step 10 (occupational factors) is rendered
only when step 1's `screeningPurpose` is `occupational-pre-placement`. The
step list at the top is a table of contents with completion status, not a
pager.

## State

`src/lib/stores/questionnaire.svelte.ts` holds the reactive questionnaire as
a `$state` rune and persists it to `localStorage` under
`health-screening-questionnaire.front-end-with-svelte.<id>.v1`. On load the
stored value is merged over a fresh default, so fields added in a later
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
