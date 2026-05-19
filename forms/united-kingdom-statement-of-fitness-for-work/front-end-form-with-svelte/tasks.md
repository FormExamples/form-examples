# SvelteKit Fit Note Wizard — Task Tracking

## Project skeleton

- [x] Add `package.json`
- [x] Add `svelte.config.js`
- [x] Add `vite.config.ts`
- [x] Add `tsconfig.json`
- [x] Add `src/app.html`, `src/app.css`, `src/app.d.ts`
- [x] Add `.gitignore`

## Engine

- [x] Port `js/types.js` → `src/lib/types.ts`
- [x] Port `js/grader.js` → `src/lib/grading/grader.ts`
- [x] Add `src/lib/grading/grader.test.ts`
- [x] Add `src/lib/sample-data.ts`

## UI

- [x] `src/lib/store.svelte.ts`
- [x] `src/lib/components/Header.svelte`
- [x] `src/lib/components/Footer.svelte`
- [x] `src/lib/components/Report.svelte`
- [x] `src/lib/components/ui/Field.svelte`
- [x] `src/lib/components/ui/RadioGroup.svelte`
- [x] `src/lib/components/ui/YesNoToggle.svelte`
- [x] `src/lib/components/ui/TextArea.svelte`
- [x] `src/lib/components/steps/Step01Issuer.svelte`
- [x] `src/lib/components/steps/Step02Patient.svelte`
- [x] `src/lib/components/steps/Step03Assessment.svelte`
- [x] `src/lib/components/steps/Step04Diagnosis.svelte`
- [x] `src/lib/components/steps/Step05FitnessForWork.svelte`
- [x] `src/lib/components/steps/Step06Adaptations.svelte`
- [x] `src/lib/components/steps/Step07Comments.svelte`
- [x] `src/lib/components/steps/Step08Period.svelte`
- [x] `src/lib/components/steps/Step09FollowUp.svelte`
- [x] `src/lib/components/steps/Step10SignOff.svelte`

## Routes

- [x] `src/routes/+layout.svelte`
- [x] `src/routes/+page.svelte`
- [x] `src/routes/fit-note/[step=step]/+page.svelte`
- [x] `src/params/step.ts`

## Verify

- [x] `pnpm install`
- [x] `pnpm run check`
- [x] `pnpm test`
