# Hernia Diagnostic Evaluation — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the hernia diagnostic
evaluation: fourteen steps covering presenting complaint, risk factors,
examination, reducibility, a red-flag screen, classification, imaging,
differential diagnosis, functional impact, and a management plan. Computes an
EHS-style classification, a red-flag-first urgency band, and a set of safety
flags. Lily Design System Svelte conventions; rule and flag IDs match the HTML
front-end and the back-end.

## Rules for agents working here

- The engine in `src/lib/engine/` is hand-curated and must stay **pure**: no
  I/O, no `Date.now()` inside rule predicates (the caller passes
  `assessmentDate`), no DOM access. Generators must not overwrite it.
- Any change to the red-flag list or an urgency-band threshold needs a
  matching boundary test in `grader.test.ts` **and** the same change in the
  HTML front-end's `js/classification-rules.js`. The two implementations are
  kept in lockstep deliberately.
- `computeUrgency()` checks `anyRedFlag` **first**, before the reducibility and
  symptom branches — do not reorder this without updating
  `doc/urgency-rules.md` and re-running every boundary test.
- Safety flags are computed independently of the urgency band and must never
  be filtered by the clinician override — see `doc/safety-case-notes.md`
  hazard H-01.
- `src/lib/components/ui/` and `static/themes/` are shared vendored assets kept
  in sync by the `bin/` Lily tools; do not hand-edit them.

See the form root [`../index.md`](../index.md), [`../AGENTS.md`](../AGENTS.md),
[`../spec/`](../spec), and [`index.md`](./index.md) for the route map.
