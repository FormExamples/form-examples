# Agile Checklist — SvelteKit Form

Single-page SvelteKit wizard for the agile-checklist assessment.
5 steps: respondent identification (1), Teams (2), Stakeholders (3),
Practices (4), summary and action plan (5). Each item is answered
**yes / no / not-applicable**.

## Stack

- SvelteKit 2 + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$props`)
- Tailwind CSS 4 (`@import 'tailwindcss'` + `@theme`)
- `pdfmake` for client-side PDF generation
- Vitest for engine unit tests

## Directory layout (planned)

```
src/
  app.css                                   # Tailwind theme overrides
  app.html
  routes/
    +layout.svelte
    +page.svelte                            # the 5-step wizard
    report/+page.svelte                     # printable report + PDF download
  lib/
    config/
      items.ts                              # the 57 items (id, slug, section, text)
      steps.ts                              # 5 step definitions
    stores/
      checklist.svelte.ts                   # global $state store
    engine/
      types.ts
      factory.ts                            # createEmptyChecklist()
      maturity-rules.ts                     # per-section band → fired rule
      flagged-issues.ts                     # operational flags
      composite-grader.ts                   # calculateMaturity()
    components/
      ui/
        FormField.svelte
        YesNoNa.svelte                      # tri-state radio group
        FlagBanner.svelte
      steps/
        Step01Respondent.svelte
        Step02Teams.svelte
        Step03Stakeholders.svelte
        Step04Practices.svelte
        Step05Summary.svelte
```

## Engine

`calculateMaturity(data)` returns:

```ts
{
  answeredCount: number;           // 0..57
  teamsPercent: number | null;
  stakeholdersPercent: number | null;
  practicesPercent: number | null;
  overallPercent: number | null;
  maturity: 'optimising' | 'mature' | 'developing' | 'initial'
          | 'ad-hoc' | 'insufficient-data';
  sectionBands: { teams; stakeholders; practices };
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
}
```

`not-applicable` answers are excluded from the per-section denominator;
fewer than 30 answers overall yields `insufficient-data`.

## Run

```sh
pnpm install
pnpm dev
pnpm test
```
