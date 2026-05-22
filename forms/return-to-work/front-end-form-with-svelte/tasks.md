# Tasks: SvelteKit clinician wizard

## Scaffold
- [ ] `pnpm create svelte@latest` (TypeScript, ESLint, Prettier,
      Vitest).
- [ ] Install Tailwind CSS 4 via `@tailwindcss/vite`.
- [ ] Configure `svelte.config.js` for static adapter where
      applicable.

## Engine
- [ ] `lib/engine/types.ts` — `ReturnToWorkAssessment` and
      sub-types.
- [ ] `lib/engine/utils.ts` — helpers (date math, week-count, age).
- [ ] `lib/engine/fitness-rules.ts` — fitness statement rule set.
- [ ] `lib/engine/restriction-rules.ts` — restriction-priority
      rule set.
- [ ] `lib/engine/flagged-issues.ts` — safety flag rule set.
- [ ] `lib/engine/composite-grader.ts` — `calculateReturnToWork()`.
- [ ] `lib/engine/composite-grader.test.ts` — Vitest tests.
- [ ] `lib/engine/restriction-rules.test.ts` — Vitest tests.

## Steps
- [ ] `Step01ClinicianIdentification.svelte`
- [ ] `Step02PatientIdentification.svelte`
- [ ] `Step03JobContext.svelte`
- [ ] `Step04AbsenceHistory.svelte`
- [ ] `Step05ReasonForAbsence.svelte`
- [ ] `Step06CurrentTreatment.svelte`
- [ ] `Step07FunctionalAssessment.svelte`
- [ ] `Step08FitnessStatement.svelte`
- [ ] `Step09PhasedReturn.svelte`
- [ ] `Step10AdjustmentsRestrictions.svelte`
- [ ] `Step11FollowUp.svelte`
- [ ] `Step12SignOff.svelte`

## Routing
- [ ] `params/step.ts` — matcher for 1-12.
- [ ] `routes/+layout.svelte`
- [ ] `routes/+page.svelte` — landing
- [ ] `routes/assessment/[step=step]/+page.svelte`
- [ ] `routes/report/+page.svelte`
- [ ] `routes/report/pdf/+server.ts`

## QA
- [ ] `pnpm run check` passes.
- [ ] `pnpm exec vitest run` passes.
- [ ] Axe-core accessibility audit (deferred).
- [ ] Playwright end-to-end (deferred).
