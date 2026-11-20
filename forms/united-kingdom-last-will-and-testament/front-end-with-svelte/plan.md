# Plan: United Kingdom Last Will and Testament — SvelteKit front-end (form + dashboard)

## Status: complete

SvelteKit front-end mirroring the sibling `medical-certificate-of-cause-of-death`
(a completeness and validity-classification form). The engine is ported from
this form's HTML front-end (`../front-end-with-html/js/{types,rules,grader,flags}.js`).

## Done

- [x] Scaffold, configs, Lily Svelte UI component set, theme catalogue, `app.css`.
- [x] Engine (`src/lib/engine/`): `types.ts`, `utils.ts`, `will-rules.ts`,
      `will-grader.ts`, `flagged-issues.ts`, ported from the HTML front-end.
- [x] Validity classification: precedence `formality-risk` > `incomplete` > `valid`.
- [x] Flagged issues: 25 flags across formalities, completeness, and awareness.
- [x] Six wizard steps, dashboard (SVAR DataGrid), report page, PDF endpoint.
- [x] Vitest: class precedence, witness rules, shares, personas oracle.
- [x] ESLint + Prettier clean; `svelte-check` clean.
