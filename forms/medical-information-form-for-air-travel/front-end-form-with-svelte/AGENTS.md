# Front-end form (SvelteKit) — Medical Information Form for Air Travel

SvelteKit 2.x + Svelte 5 runes single-page wizard for the MEDIF form. The
wizard walks the user through 14 sections on one continuous page (no
multi-page navigation) and computes a fitness-to-fly band, fired rules, and
safety flags suitable for submission to an airline medical desk.

## Stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 (`@import 'tailwindcss'` and `@theme`)
- Vitest for engine unit tests
- `pdfmake` for downstream PDF rendering

## Directory map

```
src/
  app.html
  app.css
  app.d.ts
  routes/
    +layout.svelte
    +page.svelte
  lib/
    types.ts                                  re-export of engine types
    stores/
      assessment.svelte.ts                    class-based reactive store
    engine/
      types.ts                                MedifAssessment, FiredRule, SafetyFlag
      factory.ts                              createEmptyAssessment()
      utils.ts                                maxBand, daysBetween, addDaysIso
      equipment-rules.ts                      Step 12 / 13 equipment rules
      recent-event-rules.ts                   Step 9 recent surgery / events
      cardiorespiratory-rules.ts              Steps 7, 8 + Hb anaemia
      pregnancy-rules.ts                      Step 10 gestation thresholds
      communicable-rules.ts                   Step 11 infectious-disease rules
      flagged-issues.ts                       safety-flag emitter
      composite-grader.ts                     `evaluateFitnessToFly(data)`
      composite-grader.test.ts                Vitest unit tests
    components/
      ProgressBar.svelte
      ui/
        TextField.svelte
        NumberField.svelte
        SelectField.svelte
        YesNoField.svelte
      steps/
        Step01Submitter.svelte
        Step02Passenger.svelte
        Step03Trip.svelte
        Step04Reasons.svelte
        Step05Physician.svelte
        Step06Diagnosis.svelte
        Step07Cardiovascular.svelte
        Step08Respiratory.svelte
        Step09RecentEvents.svelte
        Step10Pregnancy.svelte
        Step11Communicable.svelte
        Step12InflightNeeds.svelte
        Step13CabinMeds.svelte
        Step14Summary.svelte
```

## Engine contract

```ts
evaluateFitnessToFly(data: MedifAssessment): {
  fitnessBand: 'fit' | 'fit-with-conditions' | 'requires-review' | 'unfit-to-fly';
  firedRules: FiredRule[];
  safetyFlags: SafetyFlag[];
  deskRecommendation: string;
  validUntil: string; // ISO 8601 date, signatureDate + 14 days
}
```

The algorithm is *max-grade*: the worst-band fired rule sets the overall
band; `fit` is the default when no rules fire. Safety flags are computed
independently of the fitness band.

## Conventions

- Empty string `''` for unanswered text and enum fields.
- `null` for unanswered numeric fields.
- camelCase property names in TypeScript.
- Step components named `StepNName.svelte` (1-indexed, zero-padded).
- UI primitives in `src/lib/components/ui/`.

## Verify

```sh
pnpm install
pnpm run check
pnpm run test
```
