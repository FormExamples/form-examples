# Knee Replacement Surgery Evaluation — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the knee-replacement
surgery evaluation: fifteen steps covering presenting history, the Oxford
Knee Score, physical examination, diagnostic imaging, conservative-treatment
audit, general health screen, pre-operative bloods checklist, shared
decision-making, and the management plan. Computes an OKS total with its
category, a Kellgren-Lawrence radiographic grade, a surgical-candidacy
recommendation, and a set of safety flags. Lily Design System Svelte
conventions; rule and flag IDs match the HTML front-end and the back-end.

## Rules for agents working here

- The engine in `src/lib/engine/` is hand-curated and must stay **pure**: no
  I/O, no `Date.now()` inside rule predicates (the caller passes
  `assessmentDate`), no DOM access. Generators must not overwrite it.
- Any change to an OKS threshold or the candidacy precedence order needs a
  matching boundary test in `grader.test.ts` **and** the same change in the
  HTML front-end's `js/oks-rules.js`. The two implementations are kept in
  lockstep deliberately.
- Safety flags are computed independently of the candidacy recommendation and
  must never be filtered by the clinician override — see
  `doc/safety-case-notes.md` hazard H-07.
- This form is not an ASA-grading pre-operative assessment; do not add ASA
  physical-status grading anywhere in the UI — see `spec/index.md` §2.
- `src/lib/components/ui/` and `static/themes/` are shared vendored assets kept
  in sync by the `bin/` Lily tools; do not hand-edit them.

See the form root [`../index.md`](../index.md), [`../AGENTS.md`](../AGENTS.md),
[`../spec/`](../spec), and [`index.md`](./index.md) for the route map.
