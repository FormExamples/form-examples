# United States Marriage License Application — SvelteKit front-end

Agent instructions for this directory. See the form root [`../index.md`](../index.md),
[`../AGENTS.md`](../AGENTS.md), and the Lily Svelte conventions in
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md).

- The engine in `src/lib/engine/` is a port of `../front-end-with-html/js/`; change
  both together, and keep `STATE_RULES` identical.
- `application-grader.test.ts` replays `../examples/personas.json`; after changing a
  rule, run `bin/test-personas united-states-marriage-license-application --update`
  from the repo root, then `pnpm exec vitest run` here.
- Routes are nested under `src/routes/united-states-marriage-license-application/`.
- Documentation support, not legal advice.
