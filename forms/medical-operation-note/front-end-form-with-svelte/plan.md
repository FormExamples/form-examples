# Plan: SvelteKit operating-team front-end

## Status

Scaffolding and core engine in place. 12 step components implemented as
minimal working stubs that bind to the reactive store. Single-page
wizard and dynamic-step route operational; engine unit tests pass.

## Build order

1. [x] `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`.
2. [x] Tailwind CSS 4 config, `app.css`, `app.html`, `app.d.ts`.
3. [x] Engine: `types.ts`, `utils.ts`, `factory.ts`,
       `clavien-dindo-rules.ts`, `blood-loss-rules.ts`,
       `count-rules.ts`, `never-event-rules.ts`,
       `anaesthetic-event-rules.ts`, `flagged-issues.ts`,
       `composite-grader.ts`.
4. [x] Vitest unit tests for `composite-grader` and `clavien-dindo-rules`.
5. [x] Reactive store with `$state` runes in `state.svelte.ts`.
6. [x] 12 step components (minimal working UI).
7. [x] Progress bar + step-list UI on landing route.
8. [x] Dynamic step route `/operation-note/[step=step]/` with matcher.
9. [x] Report builder `lib/report.ts` (pdfmake doc + HTML preview).
10. [ ] FHIR R5 Procedure bundle emitter (future).
11. [ ] Zod runtime validation (future).
12. [ ] Axe-core accessibility audit (future).
13. [ ] Playwright end-to-end smoke test (future).

## Known limitations

- Step components are minimal — they bind every field but do not yet
  show field-level conditional logic (e.g. hide tourniquet section
  when no tourniquet is used).
- Autosave is a future enhancement (currently in-memory only).
- No authentication; sessions are single-user / per-browser-tab.
- The dynamic step route is a convenience layer over the single-page
  wizard; both views share the same store instance.
