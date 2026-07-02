# SOAP Note — SvelteKit front-end plan

## Status

Greenfield consolidated `front-end-with-svelte/` built by porting the completeness
engine from the HTML front-end (`../front-end-with-html/js/{types,rules,grader,flags}.js`)
into TypeScript and mirroring the gold-standard SvelteKit layout of a completeness
sibling. `pnpm check` / `pnpm build` / `vitest run` all green.

## Done

- [x] Engine ported to TS: `types.ts`, `utils.ts`, `soap-note-rules.ts`,
      `soap-note-grader.ts`, `flagged-issues.ts` (presence-based completeness,
      complete / partial / incomplete + completeness percentage, six safety flags).
- [x] Vitest engine tests (`soap-note-grader.test.ts`) with a local
      `createDefaultAssessment` fixture (no store import); cover each status
      boundary, the conditional safety-netting / follow-up components, and the flags.
- [x] Id-keyed Svelte 5 store with `deepAssign` in-place merge, localStorage key
      `soap-note.front-end-with-svelte.<id>.v1`, `createDefaultAssessment()`.
- [x] Step config (7 steps) and 7 step components (context, patient, S, O, A, P, summary).
- [x] Sample records (`SOAP-2026-0001..4`) spanning complete / partial / incomplete
      + engine-derived dashboard rows.
- [x] RESTful routes under `/soap-notes/`: dashboard (SVAR, `ssr = false`),
      `[id]` wizard, report, and `report/pdf` server endpoint.
- [x] Welcome page + themed layout; Lily token utilities throughout (no hardcoded palette).
- [x] `pdf-builder.ts` (completeness report, not a score).

## Verify

```sh
pnpm install
pnpm run check
pnpm run build
pnpm exec vitest run
```
