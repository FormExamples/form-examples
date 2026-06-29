# Plan — ICVP SvelteKit form

## Status: in progress

## Milestones

- [x] Scaffold SvelteKit 2 project (`package.json`, `svelte.config.js`,
      `vite.config.ts`, Tailwind 4 entrypoint, app shell)
- [x] Author the validation engine in `src/lib/engine/`
- [x] Route matcher `src/params/step.ts` accepting 1..8
- [x] Reactive certificate store with `$state` runes
- [x] Eight step components (`Step01CentreAndClinician.svelte` ..
      `Step08Summary.svelte`)
- [x] Summary panel with computed validity and fired rules
- [x] Vitest tests for each validation rule
- [ ] `pdfmake` PDF route at `/report/pdf`

## Out of scope

- Server-side persistence (handled by the Loco backend).
- Authentication / authorisation.
- Internationalisation strings beyond English / French / native language.
