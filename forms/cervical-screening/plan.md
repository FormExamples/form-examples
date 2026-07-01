# Cervical Screening record — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single screening table in `sql/`: encounter context,
   identification, eligibility, consent, symptoms, sample adequacy, hrHPV result,
   reflex cytology, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `screening-rules.ts`,
   `screening-grader.ts`, `flagged-issues.ts` with Vitest tests covering every
   result class, management action, the eligibility and adequacy gates, and each
   reflex-cytology branch.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form cervical-screening`, Lily drift checks, spec /
   changelog drift checks.

## Design notes

- Documentation + result-classification form: the engine emits a
  `resultClass` + `managementAction` pair, not a numeric score. Do not build an
  additive scorer.
- The pathway is **HPV primary**: reflex cytology is meaningful only when the
  hrHPV result is positive. The wizard should only require/enable the cytology
  step when `hpvResult == 'positive'`.
- Gates apply in order: eligibility (age 25–64, not ceased) → sample adequacy →
  hrHPV → reflex cytology. An earlier gate short-circuits the later branches.
- Symptoms are handled orthogonally: a symptomatic patient is flagged for the
  separate NG12 symptomatic pathway regardless of the screen result; the screen
  is not a substitute for symptomatic assessment.
- Recall interval is age-derived: 3-yearly for 25–49, 5-yearly for 50–64.
