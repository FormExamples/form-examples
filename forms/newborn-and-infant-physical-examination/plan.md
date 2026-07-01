# Newborn and Infant Physical Examination (NIPE) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single examination table in `sql/`: context and baby
   identification, risk factors, key-component observations, head-to-toe
   systematic-examination fields, measurements, timestamps; UUIDv4 PK. Source of
   truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `nipe-rules.ts`,
   `nipe-grader.ts`, `flagged-issues.ts` with Vitest tests covering each
   component result, the girls-exclude-testes case, the outcome roll-up, and
   every referral urgency.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/examinations/` list +
   `/examinations/[id]` form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form newborn-and-infant-physical-examination`, Lily
   drift checks, spec / changelog drift checks.

## Design notes

- The wizard is a long systematic examination but must remain one continuous
  single-page wizard — the four key components are grouped as their own steps,
  followed by the head-to-toe step.
- The four key components drive the outcome; the head-to-toe fields are recorded
  for the clinical record but do not by themselves change the screening outcome
  (abnormal head-to-toe findings feed the free-text note and clinician
  judgement).
- The testes component is conditional on `sex == 'male'`; for other values it is
  `not-applicable` and excluded from the outcome roll-up.
- A `not-examined` component makes the overall outcome `incomplete` (never
  silently satisfactory) so incomplete screens are surfaced for completion.
</content>
