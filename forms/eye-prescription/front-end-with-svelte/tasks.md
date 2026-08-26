# Tasks: Eye Prescription — SvelteKit Front-End Form

## Scaffolding
- [ ] `pnpm create svelte@latest` — SvelteKit 2 + TypeScript + Tailwind 4.
- [ ] Install `pdfmake`, `vitest`, `@testing-library/svelte`.

## Engine
- [ ] `src/lib/types.ts` — EyePrescription + child types.
- [ ] `src/lib/utils.ts` — quantize to 0.25 D, format, validate.
- [ ] `src/lib/refractive-rules.ts` — sphere / cylinder / addition bands.
- [ ] `src/lib/complexity-grader.ts` — composite engine.
- [ ] `src/lib/flagged-issues.ts` — 11 safety flags.

## Tests
- [ ] `refractive-rules.test.ts`.
- [ ] `complexity-grader.test.ts`.
- [ ] `flagged-issues.test.ts`.

## UI
- [ ] `src/lib/components/ui/Button.svelte`.
- [ ] `src/lib/components/ui/Input.svelte`.
- [ ] `src/lib/components/ui/Select.svelte`.
- [ ] `src/lib/components/ui/Fieldset.svelte`.
- [ ] `src/lib/components/ui/NumberStepper.svelte` (0.25 D snap).
- [ ] `src/lib/components/Step1Prescriber.svelte`.
- [ ] `src/lib/components/Step2Patient.svelte`.
- [ ] `src/lib/components/Step3Examination.svelte`.
- [ ] `src/lib/components/Step4VisualAcuity.svelte`.
- [ ] `src/lib/components/Step5RightEye.svelte`.
- [ ] `src/lib/components/Step6LeftEye.svelte`.
- [ ] `src/lib/components/Step7Addition.svelte`.
- [ ] `src/lib/components/Step8PupillaryDistance.svelte`.
- [ ] `src/lib/components/Step9LensRecommendation.svelte`.
- [ ] `src/lib/components/Step10OcularHealth.svelte`.
- [ ] `src/lib/components/Step11Summary.svelte`.

## Routing
- [ ] `src/params/step.ts` — validate 1..11.
- [ ] `src/routes/+layout.svelte`.
- [ ] `src/routes/+page.svelte` (redirect to /prescription/1).
- [ ] `src/routes/prescription/[step=step]/+page.svelte`.

## PDF
- [ ] `src/lib/pdf.ts` — pdfmake UK NHS / GOC layout.

## Verify
- [ ] `pnpm run check` passes.
- [ ] `pnpm run test` passes.

## Deferred
- [ ] Playwright end-to-end.
- [ ] LocalStorage autosave.
- [ ] Zod schemas.
- [ ] Plus-cylinder display toggle.
- [ ] Bilingual UI.
- [ ] Side-by-side comparison.
