# SvelteKit Fit Note Wizard — Implementation Plan

## Goal

Deliver a SvelteKit 2 + Svelte 5 + Tailwind 4 single-page wizard for the
UK Med 3 fit note, with a TypeScript grading engine that mirrors the
canonical `front-end-form-with-html/js/grader.js` engine 1:1.

## Phases

### Phase 1 — Project skeleton

- [x] `package.json` — name `united-kingdom-statement-of-fitness-for-work-svelte`
- [x] `svelte.config.js` — vitePreprocess, adapter-auto
- [x] `vite.config.ts` — tailwindcss() + sveltekit()
- [x] `tsconfig.json` — extend `.svelte-kit/tsconfig.json`, strict mode
- [x] `src/app.html`, `src/app.css`, `src/app.d.ts`
- [x] `.gitignore`

### Phase 2 — Data model

- [x] `src/lib/types.ts` — `FitNote` interface mirroring `js/types.js`
- [x] `src/lib/types.ts` — `GradingResult`, `FiredRule`, `SafetyFlag` types
- [x] `src/lib/types.ts` — `emptyFitNote()`, `PROFESSIONS`, `ASSESSMENT_METHODS`, `DIAGNOSIS_CATEGORIES`
- [x] `src/lib/sample-data.ts` — three canonical samples

### Phase 3 — Grading engine

- [x] `src/lib/grading/grader.ts` — `gradeFitNote(data)` with all rule sets
- [x] `src/lib/grading/grader.test.ts` — vitest tests for validity, adaptation, period, safety, recommendation

### Phase 4 — UI scaffolding

- [x] `src/lib/store.svelte.ts` — runes wizard store
- [x] `src/lib/components/Header.svelte`, `Footer.svelte`, `Report.svelte`
- [x] `src/lib/components/ui/Field.svelte`, `RadioGroup.svelte`, `YesNoToggle.svelte`, `TextArea.svelte`
- [x] `src/params/step.ts` — accept "1".."10"

### Phase 5 — Wizard steps

- [x] `Step01Issuer.svelte` through `Step10SignOff.svelte`

### Phase 6 — Routes

- [x] `src/routes/+layout.svelte` — header/footer wrapper
- [x] `src/routes/+page.svelte` — landing
- [x] `src/routes/fit-note/[step=step]/+page.svelte` — dynamic step page

### Phase 7 — Verify

- [x] `pnpm install`
- [x] `pnpm run check`
- [x] `pnpm test`

## Out of scope (this iteration)

- PDF export via `pdfmake`
- FHIR R5 Bundle export from the form (lives in `fhir-r5/`)
- localStorage persistence (defer to a follow-up)
