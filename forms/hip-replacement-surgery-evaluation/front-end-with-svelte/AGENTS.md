# Hip Replacement Surgery Evaluation — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the hip-replacement
surgery evaluation: fifteen steps covering presenting history, the Oxford Hip
Score, physical examination, imaging, and a conservative-treatment audit.
Computes an OHS total and category, and a surgical-candidacy recommendation,
plus a set of safety flags. Lily Design System Svelte conventions; rule and
flag IDs match the HTML front-end and the back-end.

## Rules for agents working here

- The engine in `src/lib/engine/` is hand-curated and must stay **pure**: no
  I/O, no `Date.now()` inside rule predicates (the caller passes
  `assessmentDate`), no DOM access. Generators must not overwrite it.
- Any change to an OHS-band or candidacy threshold needs a matching boundary
  test in `grader.test.ts` **and** the same change in the HTML front-end's
  `js/ohs-rules.js` / `js/composite-grader.js`. The two implementations are
  kept in lockstep deliberately.
- Safety flags are computed independently of the candidacy recommendation and
  must never be filtered by the clinician override — see
  `doc/safety-case-notes.md`.
- `src/lib/components/ui/` and `static/themes/` are shared vendored assets kept
  in sync by the `bin/` Lily tools; do not hand-edit them.

See the form root [`../index.md`](../index.md), [`../AGENTS.md`](../AGENTS.md),
[`../spec/`](../spec), and [`index.md`](./index.md) for the route map.
