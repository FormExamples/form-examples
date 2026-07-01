# Mental Health Act Assessment — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, assessing-professionals fields, statutory-criteria
   fields, nearest-relative fields, recommendation / outcome fields, timestamps;
   UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Validation / classification engine** — `types.ts`, `utils.ts`,
   `mha-rules.ts`, `mha-grader.ts`, `flagged-issues.ts` with Vitest tests
   covering each section's signatory and criteria requirements, the
   `valid` / `incomplete` boundary, each urgency class, and every flagged issue.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form mental-health-act-assessment`, Lily drift checks,
   spec / changelog drift checks.

## Design notes

- This is a **legal / clinical documentation instrument**, not a numeric score.
  The engine validates that the documentation required by the recommended
  section is complete (`valid` / `incomplete`) and classifies the section and
  urgency — it makes no automated decision to detain a person.
- Signatory and criteria requirements are **section-dependent**: s2/s3 need two
  medical recommendations with at least one Section 12 approved doctor; s4/s136
  need one doctor plus the AMHP; s5(2)/s5(4) are holding powers with a single
  responsible signatory. s3 additionally requires appropriate medical treatment
  to be available.
- Detention engages Article 5 of the Human Rights Act 1998 (right to liberty), so
  the least-restrictive-alternative criterion and human-rights flag are
  first-class, not advisory.
- Statutory time limits (medical examinations within 5 days of each other;
  application within 14 days of the later examination) are validated for flags,
  not for the completeness status.
- The wizard remains one continuous single-page wizard (10 steps).
