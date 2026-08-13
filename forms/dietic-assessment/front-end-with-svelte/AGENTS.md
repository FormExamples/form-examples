# Dietetic Assessment — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the dietetic assessment:
sixteen steps covering medical history, medication and supplements, dietary
recall, lifestyle and food environment, and physical measurements. Computes a
MUST score with its risk category, a GLIM malnutrition diagnosis, NRS-2002,
SARC-F, SCOFF, refeeding-syndrome risk, a composite nutrition risk by
max-grade, and a set of safety flags. Lily Design System Svelte conventions;
rule and flag IDs match the HTML front-end and the back-end.

## Rules for agents working here

- The engine in `src/lib/engine/` is hand-curated and must stay **pure**: no
  I/O, no `Date.now()` inside rule predicates (the caller passes
  `assessmentDate`), no DOM access. Generators must not overwrite it.
- Any change to a MUST or GLIM threshold needs a matching boundary test in
  `grader.test.ts` **and** the same change in the HTML front-end's
  `js/must-rules.js` / `js/glim-rules.js`. The two implementations are kept in
  lockstep deliberately.
- Safety flags are computed independently of the risk category and must never
  be filtered by the dietitian override — see `doc/safety-case-notes.md`
  hazard H-07.
- A declined weight is a first-class answer, not an error path. Never add a
  validation rule that requires a weight.
- `src/lib/components/ui/` and `static/themes/` are shared vendored assets kept
  in sync by the `bin/` Lily tools; do not hand-edit them.

See the form root [`../index.md`](../index.md), [`../AGENTS.md`](../AGENTS.md),
[`../spec/`](../spec), and [`index.md`](./index.md) for the route map.
