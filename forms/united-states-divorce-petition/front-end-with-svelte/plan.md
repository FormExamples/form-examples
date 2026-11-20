# Plan: United States Divorce Petition — SvelteKit front-end (form + dashboard)

## Status: complete

SvelteKit front-end for the petition, decree and divorce-certificate wizard. The
engine is ported from the HTML front-end
(`../front-end-with-html/js/{types,rules,grader,flags}.js`) into
`src/lib/engine/`, with vitest tests that pin every persona in
`../examples/personas.json`.

## Done

- [x] Scaffold, configs, Lily Svelte UI component set, theme catalogue, `app.css`.
- [x] Engine: `types.ts`, `utils.ts`, `divorce-rules.ts` (state-rule table),
      `divorce-grader.ts`, `flagged-issues.ts`.
- [x] Six step components, wizard route, report route with PDF, dashboard route.
