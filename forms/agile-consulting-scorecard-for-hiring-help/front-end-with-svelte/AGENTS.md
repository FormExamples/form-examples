# Agile Consulting Scorecard for Hiring Help — front-end form with SvelteKit

SvelteKit single-page wizard for an organization's agile-consulting
readiness self-assessment, with the canonical class-based reactive store,
Tailwind CSS 4 styling, and a `pdfmake` PDF report endpoint at `/report/pdf`.

## Status

Pure scoring engine and Vitest tests are authored and passing. The
SvelteKit wizard, store, and PDF endpoint still need to be authored.

## Stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for server-side PDF
- Vitest for engine unit tests
- SVAR Svelte Core for reusable UI primitives

## Conventions

- Single-page wizard; six step components named
  `Step1Organization.svelte`, `Step2Manifesto.svelte`,
  `Step3PrinciplesA.svelte`, `Step4PrinciplesB.svelte`,
  `Step5PrinciplesC.svelte`, `Step6ScoreAndSignoff.svelte`.
- Class-based reactive store at
  `src/lib/stores/assessment.svelte.ts` (no `writable`).
- Pure scoring engine in `src/lib/engine/`, matching the file layout
  used by `issue-tracker`.

## Engine

- `types.ts` — `AgileConsultingScorecardAssessment` input + `GradeResult`
  output, plus enumerations.
- `utils.ts` — `answerToPoints`, `answerToGrade`, `totalToBand`,
  `bandToRecommendation`.
- `manifesto-rules.ts` — items 1–4.
- `principles-rules.ts` — items 5–16 (principles 1–12).
- `flagged-issues.ts` — six readiness flags.
- `score-grader.ts` — top-level `gradeScorecard(data)` entrypoint.
- `score-grader.test.ts` — Vitest coverage of bands, boundaries, fired
  rules, and every flag.

See [`AGENTS/front-end-with-sveltekit-tailwind-svar.md`](../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md)
for the full conventions.
