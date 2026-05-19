# SvelteKit form — UK NHS England Medical Exemption Certificate (FP92A)

A SvelteKit 2 + Svelte 5 runes + Tailwind 4 + Vite 7 single-page wizard that
captures the data needed to print, sign in ink, and post an **FP92A**
application to NHSBSA Bridge House.

## Layout

```
src/
  app.css                                         # Tailwind 4 + NHS theme tokens
  app.d.ts
  routes/
    +layout.svelte
    +page.svelte                                  # 10-step single-page wizard
  lib/
    index.ts                                      # public re-exports
    config/steps.ts                               # the 10 steps
    stores/application.svelte.ts                  # Svelte 5 runes store
    engine/
      types.ts                                    # Fp92aApplication + result types
      fp92a-rules.ts                              # declarative grading rules
      fp92a-validator.ts                          # evaluateFp92a()
      fp92a-validator.test.ts                     # Vitest
      flagged-issues.ts                           # advisory flags
      utils.ts                                    # ageInYears, addYears, isFilled...
    components/
      ProgressBar.svelte
      StepNavigation.svelte
      ui/
        TextInput.svelte
        NumberInput.svelte
        SelectInput.svelte
        RadioGroup.svelte
        CheckboxGroup.svelte
        TextArea.svelte
        SectionCard.svelte
        Badge.svelte
      steps/
        Step1Practitioner.svelte
        Step2Patient.svelte
        Step3ExistingExemption.svelte
        Step4AgeCheck.svelte
        Step5PregnancyCheck.svelte
        Step6ConditionSelection.svelte
        Step7ConditionDetail.svelte
        Step8DisabilityAppliance.svelte
        Step9Declaration.svelte
        Step10Summary.svelte
```

## Grading engine

`evaluateFp92a(data: Fp92aApplication)` returns:

```ts
{
  outcome: 'eligible' | 'ineligible' | 'requires-clarification';
  eligibleConditions: EligibleConditionCode[];
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
  validFrom: string;   // ISO date
  validUntil: string;  // ISO date (validFrom + 5 years)
  redirectTo: '' | 'FW8' | 'age-exemption' | 'low-income-scheme' | 'hc1' | 'hc2';
  ageYears: number | null;
  timestamp: string;
}
```

Rules live in `engine/fp92a-rules.ts` as pure predicates over the application
data. Advisory flags live in `engine/flagged-issues.ts`.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric fields.
- camelCase property names.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.

## Verify

```sh
pnpm install
pnpm run check
pnpm run test
```
