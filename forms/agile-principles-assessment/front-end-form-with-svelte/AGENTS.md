# Agile Principles Assessment — SvelteKit Form

Single-page SvelteKit wizard for the agile-principles assessment.
14 steps: respondent identification (1), 12 principle steps (2–13),
summary and action plan (14). Each principle is scored on a 1–5 Likert
scale with an optional comment field.

## Stack

- SvelteKit 2 + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$props`)
- Tailwind CSS 4 (`@import 'tailwindcss'` + `@theme`)
- `pdfmake` for client-side PDF generation
- Vitest for engine unit tests

## Directory layout

```
src/
  app.css                                   # Tailwind theme overrides
  app.html
  routes/
    +layout.svelte
    +page.svelte                            # the 14-step wizard
    report/+page.svelte                     # printable report + PDF download
  lib/
    config/
      principles.ts                         # the 12 principles (id, slug, title, description)
      steps.ts                              # 14 step definitions
    stores/
      assessment.svelte.ts                  # global $state store
    engine/
      types.ts
      factory.ts                            # createEmptyAssessment()
      maturity-rules.ts                     # per-principle band → fired rule
      flagged-issues.ts                     # operational flags
      composite-grader.ts                   # calculateMaturity()
    components/
      ui/
        FormField.svelte
        LikertScale.svelte
        FlagBanner.svelte
      steps/
        Step01Respondent.svelte
        Step02CustomerSatisfaction.svelte
        ...
        Step13RegularReflection.svelte
        Step14Summary.svelte
```

## Engine

`calculateMaturity(data)` returns:

```ts
{
  answeredCount: number;
  meanScore: number | null;
  maturity: 'optimising' | 'mature' | 'developing' | 'initial'
          | 'ad-hoc' | 'insufficient-data';
  perPrincipleBands: Array<'high' | 'mid' | 'low' | 'unanswered'>;
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
}
```

The composite maturity is the unweighted mean of answered principles;
fewer than 6 answers yields `insufficient-data`.

## Run

```sh
pnpm install
pnpm dev
pnpm test
```
