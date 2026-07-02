# LD Annual Health Check — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Learning Disability Annual Health
Check: a single continuous single-page wizard plus a clinician dashboard, sharing
one pure completeness engine.

This is a **documentation and completeness** instrument, not a numeric score. The
engine counts the 18 required components carried out completely, reports a
completeness percentage, gates the check on the **Health Action Plan** being
produced and shared, classifies the check **Complete** or **Incomplete**, and —
independently — raises clinical flags (STOMP, no Health Action Plan, dysphagia
risk, and so on).

## Routes

- `/` — welcome page (purpose, links to the form and dashboard).
- `/learning-disability-annual-health-checks` — SVAR DataGrid dashboard
  (`ssr = false`); filters on completeness and the Health Action Plan.
- `/learning-disability-annual-health-checks/[id]` — the ten-step wizard.
- `/learning-disability-annual-health-checks/[id]/report` — graded report.
- `/learning-disability-annual-health-checks/[id]/report/pdf` — PDF endpoint.

## Engine

Files under `src/lib/engine/`:

- `types.ts` — the `AssessmentData` data model + grading types.
- `ld-health-check-rules.ts` — the 18 required-component rules + `isRecorded`.
- `ld-health-check-grader.ts` — `calculateHealthCheckGrade` (the canonical entry
  point), the completeness percentage, and the Health Action Plan gate.
- `flagged-issues.ts` — the clinical flags (STOMP, HAP, dysphagia, …).
- `utils.ts` — label + Lily-token colour helpers.

Grading:

```
completenessPercent      = round(100 * completedComponents / 18)   (0..100)
healthActionPlanComplete = plan produced AND shared
status                   = all 18 components completed && healthActionPlanComplete
                           ? 'complete' : 'incomplete'
```

## Develop

```sh
pnpm install
pnpm run dev      # dev server
pnpm run check    # svelte-check (0 errors / 0 warnings)
pnpm run build    # production build
pnpm exec vitest run   # engine unit tests
```
