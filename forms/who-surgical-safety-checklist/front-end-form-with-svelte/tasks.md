# WHO Surgical Safety Checklist — SvelteKit form tasks

## Active

- [ ] `pnpm install` to install dependencies (deferred).
- [ ] `pnpm test` to run Vitest unit tests.
- [ ] `pnpm check` to run `svelte-check`.
- [ ] `pnpm dev` and walk through the five wizard steps.

## Done

- [x] Author scaffold (`package.json`, `svelte.config.js`, `vite.config.ts`,
      `tsconfig.json`, `.gitignore`).
- [x] Author app shell (`src/app.css`, `src/app.html`, `src/app.d.ts`).
- [x] Author `src/lib/checklist/{types,factory,flags,completion}.ts` engine.
- [x] Author Vitest tests for `flags.ts` and `completion.ts`.
- [x] Author Svelte 5 reactive store with localStorage persistence.
- [x] Author shared UI components (`TextField`, `NumberField`, `RadioGroup`,
      `YesNo`, `YesNoNa`, `YesNa`, `FlagBanner`, `StepNav`).
- [x] Author step components (`Step0CaseDetails`–`Step4Summary`).
- [x] Author dynamic `/checklist/[step=step]/` route plus param matcher.
- [x] Author `pdfmake` doc builder.

## Backlog

- [ ] Add SSR-safe pdfmake worker route once the SSR build path is wired up.
- [ ] Add a Playwright walkthrough test that drives all five steps.
- [ ] Add FHIR R5 Bundle export from Step 4 (currently PDF + JSON only).
