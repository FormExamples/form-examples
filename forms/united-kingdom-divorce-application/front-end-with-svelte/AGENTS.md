# United Kingdom Divorce Application — SvelteKit front-end

Agent instructions for this directory. See [`index.md`](index.md) for the layout,
the form root [`../AGENTS.md`](../AGENTS.md) for the engine contract, and
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md) for the Lily
Svelte conventions.

- The engine in `src/lib/engine/` is a port of the HTML engine in
  `../front-end-with-html/js/`; change the spec first, then both engines, then
  re-run `bin/test-personas united-kingdom-divorce-application --update`.
- Dates are tested against `application.asOfDate`, never the wall clock.
- `pnpm run lint`, `pnpm run format:check`, `pnpm run check` and
  `pnpm exec vitest run` must pass.
