# Medical Fit Note — SvelteKit front-end agent instructions

Follow [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).
Read [`index.md`](index.md) first; the behavioural reference is
[`../front-end-with-html/`](../front-end-with-html/index.md) and the living
spec is [`../spec/index.md`](../spec/index.md).

- Do not change engine behaviour here without updating the spec and the HTML
  engine (`../front-end-with-html/js/fit-note-grader.js`) together.
- `createDefaultAssessment()` lives in `src/lib/engine/defaults.ts`, not the
  store: the store imports `$app/env`, which Vitest cannot resolve.
- `src/lib/data/personas.json` mirrors `../examples/personas.json`; keep them
  identical and regenerate expectations with `bin/test-personas --update`.
- Routes: `src/routes/medical-fit-note/medical-fit-notes/` (dashboard,
  `[id]` wizard, `[id]/report`, `[id]/report/pdf`). The dashboard sets
  `ssr = false` (SVAR is not SSR-safe).
- Steps are `StepNName.svelte`, 1-indexed. localStorage key
  `medical-fit-note.front-end-with-svelte.v1`.

## Verify

```sh
pnpm run check && pnpm test && pnpm run build
pnpm run lint && pnpm run format:check
bin/svelte-lint-format-refactor --check medical-fit-note
bin/test-form medical-fit-note
```
