# Fit Note SvelteKit Wizard — Agent Instructions

SvelteKit 2 + Svelte 5 + Tailwind 4 + TypeScript implementation of the
UK fit note ten-step single-page wizard.

## Stack

- SvelteKit 2.x with TypeScript 5.7 strict
- Svelte 5 runes only — `$state`, `$derived`, `$bindable`, `$props`
  (no `export let`, no `$:` reactive statements)
- Tailwind CSS 4 via `@tailwindcss/vite`
- Vitest 2 for engine unit tests
- `@sveltejs/adapter-auto`

## Layout

```
src/
  app.html              — minimal HTML shell
  app.css               — @import 'tailwindcss' + theme tokens
  app.d.ts              — empty App namespace
  params/
    step.ts             — matcher accepting "1".."10"
  lib/
    types.ts            — FitNote interface + constants (mirrors js/types.js)
    sample-data.ts      — 3+ canonical sample fit notes
    store.svelte.ts     — runes-based wizard store
    grading/
      grader.ts         — gradeFitNote(data) → grade result
      grader.test.ts    — vitest coverage of the policy matrix
    components/
      Header.svelte
      Footer.svelte
      Report.svelte
      ui/
        Field.svelte
        RadioGroup.svelte
        YesNoToggle.svelte
        TextArea.svelte
      steps/
        Step01Issuer.svelte
        Step02Patient.svelte
        Step03Assessment.svelte
        Step04Diagnosis.svelte
        Step05FitnessForWork.svelte
        Step06Adaptations.svelte
        Step07Comments.svelte
        Step08Period.svelte
        Step09FollowUp.svelte
        Step10SignOff.svelte
  routes/
    +layout.svelte      — Header / Footer + global wrapper
    +page.svelte        — landing page with "Start" button
    fit-note/
      [step=step]/
        +page.svelte    — dynamic step route
```

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric fields.
- camelCase property names (matches `front-end-form-with-html/js/types.js`).
- UI components use `$bindable` for two-way binding.
- Step components named `StepNNName.svelte` (1-indexed, 10 components).
- Adaptation tick boxes are visible only when `fitnessForWork === 'may_be_fit'`.
- The fit note cannot certify "fit for work" — only `not_fit` / `may_be_fit`
  (DWP policy 3.2).

## Engine parity

The TypeScript grader in `src/lib/grading/grader.ts` is a 1:1 port of
`../front-end-form-with-html/js/grader.js`. Rule IDs and flag categories
match exactly so dashboards and backends can group rows by `flagId`
across all three implementations.

## Tests

```sh
pnpm test
```

Tests cover:

- validity: missing name fires `invalid_no_name` (high priority)
- adaptation: count → intensity mapping (none/light/moderate/substantial/comprehensive)
- period: self_cert_range / compliant / long_term / exceeds_initial_max / very_long_term
- safety: HIV / cancer / MS regex fires `automatic_disability`
- recommendation: `review_for_validity` supersedes other recommendations

## Verify

```sh
pnpm install
pnpm run check
pnpm test
```
