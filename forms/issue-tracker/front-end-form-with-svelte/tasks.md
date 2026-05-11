# Tasks

- [x] Author `src/lib/engine/types.ts` for `IssueTrackerAssessment`
- [x] Author `src/lib/engine/` scoring engine: priority, severity, magnitude,
      harm, failure, moscow, frequency rules + composite-grader +
      flagged-issues
- [x] Author `src/lib/engine/composite-grader.test.ts` covering empty input,
      each single-dimension max-grade case, the seven safety flags, and the
      fired-rules count (17 tests passing under Vitest)
- [x] Add minimal `package.json`, `tsconfig.json`, `vitest.config.ts` so
      the engine can be run under `pnpm test` without the full SvelteKit
      project skeleton
- [ ] Initialise the SvelteKit project on top of the engine (Vite,
      Svelte 5 runes, Tailwind 4)
- [ ] Author `src/lib/stores/assessment.svelte.ts` (class-based runes store)
- [ ] Author the ten step components
- [ ] Author `src/routes/+page.svelte` mounting the wizard
- [ ] Author `src/routes/report/+page.svelte` for the rendered report
- [ ] Author `src/routes/report/pdf/+server.ts` for the PDF endpoint
