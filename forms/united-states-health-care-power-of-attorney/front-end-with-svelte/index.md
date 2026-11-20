# United States Health Care Power of Attorney — SvelteKit front-end (form + dashboard)

SvelteKit 5 + Lily Design System (headless) front-end for the United States durable power of
attorney for health care (also called a health care proxy, medical power of attorney, or health care
surrogate designation). One continuous single-page wizard plus a reviewer dashboard. Documentation
support, not legal advice.

The engine classifies a filled form as `ready-to-execute`, `incomplete`, or `execution-risk` and
raises flagged issues (`F-HCPOA-NNN`) with a priority, category, description, and suggested action.
It checks the agent's eligibility, the witness and notary formalities of the principal's state (a
`STATE_RULES` table for CA, NY, TX, FL, IL, PA, OH, WA; any other state uses the uniform default and
raises `F-HCPOA-012`), the HIPAA release, organ donation, and the POLST distinction.

## Layout

- `src/lib/engine/` — `types.ts`, `defaults.ts` (`createDefaultDirective()`), `rules.ts`
  (predicates and `STATE_RULES`), `grader.ts` (`gradeDirective`, `evaluateDirective`),
  `flagged-issues.ts`, `utils.ts` (labels and colors), `grader.test.ts` (vitest, also replays
  `examples/personas.json`).
- `src/lib/stores/assessment.svelte.ts` — Svelte 5 store with localStorage persistence.
- `src/lib/components/steps/Step1Principal` … `Step6Summary` — the six wizard sections.
- `src/routes/united-states-health-care-power-of-attorney/` — welcome page, and under
  `united-states-health-care-powers-of-attorney/` the dashboard, `[id]` wizard, and `[id]/report`.

## Verify

```sh
pnpm install && pnpm run check && pnpm run test && pnpm run lint && pnpm run format:check
```

The engine tests use `createDefaultDirective()` from `engine/defaults.ts`, never the store, so they
do not import the SvelteKit-only `$app/env` module. Port changes to `front-end-with-html/js/`
(`rules.js`, `grader.js`, `flags.js`) in the same commit.
