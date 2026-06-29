# Plan: SvelteKit LP1H wizard

## Status

Scaffolded 2026-05-18. No implementation yet.

## Build order

1. [ ] `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`.
2. [ ] Tailwind CSS 4 config, `src/app.css`, `src/app.html`.
3. [ ] Engine: `types.ts`, `utils.ts`, donor rules, attorney rules,
       certificate-provider rules, signature-order rules, instruction
       rules, composite validator, flagged issues.
4. [ ] Vitest unit tests for every engine module.
5. [ ] Reactive store `src/lib/stores/lpa.svelte.ts` with `$state` runes.
6. [ ] 14 step components (minimal working UI).
7. [ ] Progress bar + step navigation UI.
8. [ ] Report route + `pdfmake` builder.
9. [ ] Route matcher for `[step=step]` (1-14).
10. [ ] Zod runtime validation (future).
11. [ ] Axe-core accessibility audit (future).
12. [ ] Playwright end-to-end smoke test (future).

## Known limitations

- Initial step components will be minimal field bindings. Production UI
  will wrap fields in `<FormField>` and `<SelectField>` components with
  NHS Design System semantics.
- Autosave is a future enhancement (currently in-memory only).
- No authentication; sessions are single-user per browser tab.
