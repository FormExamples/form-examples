# Perioperative Optimization — SvelteKit front-end

SvelteKit 2 + Svelte 5 + TypeScript + Tailwind 4 single-page optimization
intake: sixteen steps that grade eight modifiable-risk domains against the time
remaining before surgery, producing a surgical readiness band, safety flags, a
prehabilitation plan, and a signed PDF report.

## Stack

- SvelteKit 2.x, Svelte 5 runes (`$state`, `$derived`, `$props`, `$effect`)
- TypeScript strict
- Tailwind CSS 4 (`@import 'tailwindcss'`, `@theme`)
- `pdfmake` for server-side PDF generation
- Vitest for engine unit tests
- Lily Design System Svelte headless components in `src/lib/components/ui/`

## Routes

| Route | Purpose |
| --- | --- |
| `/` | 307 redirect to `/perioperative-optimization/` |
| `/perioperative-optimization/` | welcome page |
| `/perioperative-optimization/perioperative-optimizations/` | waiting-list dashboard |
| `/perioperative-optimization/perioperative-optimizations/[id]/` | the sixteen-step wizard (`new` for a fresh assessment) |
| `/perioperative-optimization/perioperative-optimizations/[id]/report/` | the signed report |
| `/perioperative-optimization/perioperative-optimizations/[id]/report/pdf` | `POST` endpoint returning the PDF |

## Engine

`src/lib/engine/` holds the pure scoring engine:

| File | Role |
| --- | --- |
| `types.ts` | the data model; the section interfaces are derived from the same literal as `defaults.ts`, so the two cannot drift |
| `defaults.ts` | `createDefaultAssessment()` — kept out of the store so Vitest can import it without SvelteKit's `$app` modules |
| `utils.ts` | `num`, `round1`, `ageInYears`, `titleCase` |
| `domain-rules.ts` | the eight domain triggers, lead times, and derived instrument scores |
| `gating.ts` | time-to-surgery gating |
| `flagged-issues.ts` | the safety-flag rules |
| `grader.ts` | `calculateOptimization()` — the single entry point |
| `labels.ts` | display labels, importable without the engine |

The engine performs no I/O and never reads the clock: both the assessment date
and the planned surgery date come from the data, so `weeksToSurgery` is derived
from recorded values and the function is deterministic.

`grader.test.ts` runs **100 cases** covering every domain threshold, both sides
of every gating boundary (`weeks == leadTime` and `weeks == leadTime - 1`), the
ungated path, negative weeks, and the guarantee that a clinician override never
changes the safety-flag list. The HTML front-end runs the identical case list
against its JavaScript engine, so the two implementations cannot silently
diverge.

## The live panel

The wizard's right-hand panel shows the weeks remaining, the readiness band, the
per-domain statuses with their shortfalls, and the recommended earliest surgery
date, all recomputed as the clinician types. The time available is the number
the whole assessment turns on, so it is never more than a glance away.

## Validation that matters

Submitting is blocked when the computed band is **Defer surgery** and the gate
decision is `proceed` or `proceed-with-prehabilitation`. The team must choose
`defer-and-optimize` or record `accept-unoptimized-risk` explicitly. Proceeding
while believing the patient is optimized is the hazard the form exists to
prevent; see `doc/safety-case-notes.md` H-01.

## State

`src/lib/stores/assessment.svelte.ts` holds the reactive assessment as a
`$state` rune and persists to `localStorage` under
`perioperative-optimization.front-end-with-svelte.<id>.v1`. `load()` mutates the
section objects **in place** rather than reassigning them, because step
components capture `assessmentStore.data` at init — replacing the object would
orphan every `bind:value`.

## Develop

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm check      # svelte-check
pnpm test       # vitest — 100 cases
pnpm build
```

## Conventions

See the form root [`../AGENTS.md`](../AGENTS.md) and the Lily Svelte contract in
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).
