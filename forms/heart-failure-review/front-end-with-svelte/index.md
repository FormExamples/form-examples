# Heart Failure Annual Review — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Heart Failure Annual Review. A single
continuous single-page wizard captures functional status, fluid balance,
monitoring bloods, and medication optimization; the shared pure engine derives
the NYHA functional status, the four-pillar medication-optimization status, and
the review-completeness grade, and raises safety flags; and a SVAR DataGrid
dashboard lists reviewed patients with their engine-computed statuses.

This is a **documentation and status-classification** form, not a numeric score.
The engine reports four independent outputs — an NYHA functional status, a
medication-optimization status, a review-completeness grade with a completeness
percentage, and a set of prioritized safety flags. There is no total, cut-off,
or band table.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/heart-failure-reviews/[id]`) — the nine-section review; derives
  all statuses on submit.
- **Report** (`/heart-failure-reviews/[id]/report`) — NYHA / optimization /
  completeness banners, interpretation, four-pillar table, domain-documentation
  table, and flagged issues; PDF via `report/pdf`.
- **Dashboard** (`/heart-failure-reviews`) — SVAR DataGrid of reviewed patients
  (client-only, `ssr = false`), filterable by NYHA status, optimization status,
  and completeness.

## Engine

Four independent documentation outputs (spec §4):

```
functionalStatus  = nyhaClass == null ? 'unknown'
                  : nyhaClass <= 2     ? 'stable'
                  : nyhaClass == 3     ? 'symptomatic'
                  :                      'advanced'   // NYHA IV
indicatedPillars  = 4 for HFrEF, 1 (SGLT2i) for HFmrEF/HFpEF, 0 otherwise
optimisation      = indicatedPillars == 0 ? 'not-applicable'
                  : counted == indicatedPillars ? 'optimised'
                  : prescribedPillars == 0 ? 'suboptimal' : 'partial'
completenessScore = round(100 * documentedDomains / 6)
reviewStatus      = documented == 6 ? 'complete'
                  : documented >= 4 ? 'partial' : 'incomplete'
```

The four pillars of guideline-directed medical therapy are the RAAS inhibitor
(ACEi/ARB/ARNI), a beta-blocker, an MRA, and an SGLT2 inhibitor. All four are
indicated in HFrEF; the SGLT2 inhibitor is the principal disease-modifying
pillar in HFmrEF/HFpEF. A pillar documented `contraindicated` / `not-tolerated`
counts as addressed. Safety flags (urgent review, optimization gap,
hyperkalaemia, hypokalaemia, renal impairment, fluid overload, missing
monitoring bloods, incomplete review) are raised independently of the grades.
It is a documentation aid, not a diagnosis or a prescribing instrument.

## Engine files

- `src/lib/engine/types.ts` — data model + grading types.
- `src/lib/engine/heart-failure-review-rules.ts` — the four pillars, the six
  review-domain documentation rules, and the indicated-pillar logic.
- `src/lib/engine/heart-failure-review-grader.ts` — `gradeReview()` entry point.
- `src/lib/engine/flagged-issues.ts` — the safety flags.
- `src/lib/engine/utils.ts` — label + Lily-token colour helpers.
- `src/lib/engine/heart-failure-review-grader.test.ts` — Vitest unit tests.

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
