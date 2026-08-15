# SvelteKit front-end (form + dashboard)

Agent instructions for this directory. See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md).

## Rules for agents working here

- The engine in `src/lib/engine/` is hand-curated and must stay **pure**: no
  I/O, no `Date.now()` inside rule predicates (the caller passes
  `assessmentDate`), no DOM access. Generators must not overwrite it.
- Any change to a LOCS III severity threshold or a surgical-candidacy
  computation needs a matching boundary test in `grader.test.ts` **and** the
  same change in the HTML front-end's `js/locs-rules.js`. The two
  implementations are kept in lockstep deliberately.
- Safety flags are computed independently of the surgical-candidacy
  recommendation and must never be filtered by the clinician override — see
  `../doc/safety-case-notes.md`.
- `src/lib/components/ui/` and `static/themes/` are shared vendored assets kept
  in sync by the `bin/` Lily tools; do not hand-edit them.

See [`index.md`](./index.md) for the route map.
