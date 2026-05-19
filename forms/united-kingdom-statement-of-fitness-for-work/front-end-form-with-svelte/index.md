# Fit Note Wizard — SvelteKit Front-end

A SvelteKit 2 + Svelte 5 + TypeScript single-page implementation of the UK
Statement of Fitness for Work (Med 3 / fit note) ten-step wizard.

The form is rendered as a continuous single-page wizard with a sticky
progress indicator and a dynamic route per step. The dynamic route
(`/fit-note/[step]`) is validated by a `step` param matcher that accepts
the integers 1 through 10 only. A canonical grading engine ported from
the static HTML implementation classifies fitness category, adaptation
intensity, period compliance, and policy / safety flags.

## Stack

- SvelteKit 2.x
- Svelte 5 (runes-only: `$state`, `$derived`, `$props`, `$bindable`)
- TypeScript 5.7 with strict mode
- Tailwind CSS 4 via `@tailwindcss/vite` and `@import 'tailwindcss'`
- Vitest 2 for engine unit tests
- `@sveltejs/adapter-auto` for deployment

## Wizard steps (10)

1. Issuer identification — name, profession, registration body, practice
2. Patient identification — name, DOB, NHS number, employer
3. Assessment — date and method
4. Diagnosis — text, SNOMED code, category, automatic-disability flag
5. Fitness for work — radio: `not_fit` or `may_be_fit` (no "fit for work" — DWP 3.2)
6. Adaptations — four tick boxes (only when `may_be_fit`)
7. Comments — free-text functional advice
8. Period — duration (value + unit) or from-to dates
9. Follow-up — will-assess-again, planned-review-date
10. Sign-off — computed grade, fired rules, safety flags, issue date

## Grading engine

`src/lib/grading/grader.ts` is a 1:1 TypeScript port of
`front-end-form-with-html/js/grader.js`. Rule IDs (`R-VALID-*`,
`R-ADAPT-*`, `R-PERIOD-*`, `R-SAFE-*`) and flag categories
(`invalid_no_name`, `may_be_fit_no_adaptations`, `automatic_disability`,
…) are identical across the static HTML, SvelteKit, and Loco backends.

Tests in `src/lib/grading/grader.test.ts` cover the canonical DWP cases:

- mental-health review (mental_health_condition flag)
- phased return after surgery (adaptation_intensity = light)
- long-term COVID (very_long_term + automatic Access to Work referral)

## Build

```sh
pnpm install
pnpm run check
pnpm test
pnpm run dev
```
