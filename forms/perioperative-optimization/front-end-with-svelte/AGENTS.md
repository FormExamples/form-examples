# Perioperative Optimization — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the perioperative
optimization intake: sixteen steps grading eight modifiable-risk domains against
the time remaining before surgery. Lily Design System Svelte conventions; rule
and flag IDs match the HTML front-end and the back-end.

## Rules for agents working here

- The engine in `src/lib/engine/` must stay **pure**: no I/O, no `Date.now()`.
  Both dates come from the data. Generators must not overwrite it.
- Thresholds and lead times live only in `domain-rules.ts`. Change
  `../doc/optimisation-domains.md` first, then the code, then add a boundary
  test — and make the same change in the HTML front-end's `js/domain-rules.js`.
  The two implementations are kept in lockstep deliberately and share a case
  list.
- `insufficient-time` must always force `defer-surgery` and always raise the
  `insufficient-time-to-optimise` flag. Never soften it to a warning.
- Safety flags are computed independently of the readiness band and must never
  be filtered by the clinician override.
- The submit guard that blocks `proceed` against a computed `defer-surgery` band
  is a safety control, not a convenience. Do not remove it.
- `createDefaultAssessment()` lives in `engine/defaults.ts`, not the store: the
  store imports `$app/environment`, which Vitest cannot resolve.
- The store's `load()` mutates sections in place; reassigning `data` orphans
  every step component's bindings.
- `src/lib/components/ui/` and `static/themes/` are shared vendored assets kept
  in sync by the `bin/` Lily tools; do not hand-edit them.

See the form root [`../index.md`](../index.md), [`../AGENTS.md`](../AGENTS.md),
[`../spec/`](../spec), and [`index.md`](./index.md) for the route map.
