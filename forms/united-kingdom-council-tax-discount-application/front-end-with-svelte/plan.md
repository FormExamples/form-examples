# Plan: United Kingdom Council Tax Discount Application — SvelteKit front-end

## Status: complete

The engine is ported from this form's HTML front-end
(`../front-end-with-html/js/{types,rules,grader,flags}.js`).

## Done

- [x] Scaffold, configs, Lily Svelte UI component set, theme catalogue, `app.css`.
- [x] Engine (`src/lib/engine/`): `types.ts`, `utils.ts`, `ctda-rules.ts`,
      `ctda-grader.ts`, `flagged-issues.ts`, with vitest tests including the persona oracle.
- [x] Classification: likely-ineligible > incomplete > likely-eligible.
- [x] Five wizard steps, dashboard, report, PDF.
- [x] ESLint and Prettier clean; `svelte-check` clean.
