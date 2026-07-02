# MSE — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Mental State Examination (MSE). A
single continuous single-page wizard captures the findings across the seven
ASEPTIC domains; the shared pure engine grades the record for documentation
completeness and derives a risk indicator from safety flags; and a SVAR
DataGrid dashboard lists assessed patients with their engine-computed
completeness status and risk level.

This is a **documentation and completeness** form, not a numeric score. The
engine reports a completeness status — `complete` or `partial` — with a
completeness percentage, and — independently — a risk indicator
(`none` / `low` / `moderate` / `high`) equal to the highest priority among the
safety flags raised. There is no total, cut-off, or band table.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/mental-state-examinations/[id]`) — the ten-section MSE; grades
  completeness and risk on submit.
- **Report** (`/mental-state-examinations/[id]/report`) — completeness and risk
  banners, interpretation, ASEPTIC domain-documentation table, and flagged
  issues; PDF via `report/pdf`.
- **Dashboard** (`/mental-state-examinations`) — SVAR DataGrid of assessed
  patients (client-only, `ssr = false`), filterable by risk level and
  completeness.

## Engine

The seven ASEPTIC domains:

- **A** — appearance and behaviour
- **S** — speech
- **E** — emotion (mood and affect)
- **P** — perception
- **T** — thought (form and content)
- **I** — insight and judgement
- **C** — cognition

```
completenessPercent = round(100 * documentedDomains / 7)
status              = documentedDomains === 7 ? 'complete' : 'partial'
riskLevel           = highest priority among the safety flags raised
                      (high > moderate > low > none)  — NOT a sum
```

A domain is documented when any one of its finding fields is non-blank. The
risk indicator is derived from twelve safety flags (suicidal ideation, homicidal
ideation, command hallucinations, recent self-harm, psychosis with risk,
thoughts of self-harm, delusional content, cognitive impairment, lack of insight
with risk, agitation, low mood, and incomplete examination), each with a
priority. It is a documentation aid, not a diagnosis, and does not replace a full
risk assessment.

## Engine files

- `src/lib/engine/types.ts` — data model + grading types.
- `src/lib/engine/mse-rules.ts` — the seven ASEPTIC domain-documentation rules.
- `src/lib/engine/mse-grader.ts` — `calculateMseGrade()` completeness + risk entry point.
- `src/lib/engine/flagged-issues.ts` — the twelve safety flags.
- `src/lib/engine/utils.ts` — label + Lily-token colour helpers.
- `src/lib/engine/mse-grader.test.ts` — Vitest unit tests.

## Stack

SvelteKit 2 + Svelte 5 runes, Tailwind CSS 4, Lily Design System (Svelte
headless) component contract, SVAR DataGrid (dashboard), pdfmake (report),
Vitest (engine tests).

## Commands

```sh
pnpm install
pnpm run check     # svelte-check (0 errors, 0 warnings)
pnpm run build     # production build
pnpm exec vitest run
```
