# Health Screening Questionnaire — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the health screening
questionnaire: fourteen steps covering assessment context, personal details,
lifestyle, medical/family history, a symptom review, the PAR-Q+ screen,
optional vital signs, conditional occupational factors, a wellbeing check,
vaccination status, and consent. Computes a PAR-Q+ clearance status, an
AUDIT-C alcohol score and band, a composite risk band by max-grade, and a set
of safety flags. Lily Design System Svelte conventions; rule and flag IDs
match the HTML front-end and the back-end.

## Rules for agents working here

- The engine in `src/lib/engine/` is hand-curated and must stay **pure**: no
  I/O, no `Date.now()` inside rule predicates (the caller passes
  `assessmentDate`), no DOM access. Generators must not overwrite it.
- Any change to a PAR-Q+ or AUDIT-C threshold needs a matching boundary test
  in `grader.test.ts` **and** the same change in the HTML front-end's
  `js/parq-rules.js` / `js/audit-c-rules.js`. The two implementations are
  kept in lockstep deliberately.
- Safety flags are computed independently of the risk band and must never be
  filtered by the assessor override — see `doc/safety-case-notes.md` hazard
  H-05.
- Step 10 (occupational factors) is a conditionally-rendered step, not a
  conditionally-rendered field within another step; keep it its own
  `<div id="step-10">` block gated on `screeningPurpose`.
- `src/lib/components/ui/` and `static/themes/` are shared vendored assets
  kept in sync by the `bin/` Lily tools; do not hand-edit them.

See the form root [`../index.md`](../index.md), [`../AGENTS.md`](../AGENTS.md),
[`../spec/`](../spec), and [`index.md`](./index.md) for the route map.
