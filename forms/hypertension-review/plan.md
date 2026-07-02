# Hypertension Annual Review — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All four layers are built (2026-07-02): foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations plus
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup);
both consolidated front-ends (`front-end-with-html` and
`front-end-with-svelte`, Lily-clean); and the `back-end-with-loco` Rust
JSON-API crate. `CHANGELOG.md` and `examples/` are in place.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single review table in `sql/`: context and
   identification, diagnosis/comorbidity (target drivers), clinic and
   home/ambulatory BP, medication and adherence, cardiovascular risk, bloods,
   urine ACR, lifestyle, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `review-rules.ts`,
   `review-grader.ts`, `flagged-issues.ts` with Vitest tests covering each
   target group, the severe boundary, target boundaries, each stage, and each
   review-status level.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form hypertension-review`, Lily drift checks, spec /
   changelog drift checks.

## Design notes

- The BP **target** is data-driven: it is selected from age band and comorbidity
  (type 2 diabetes, CKD, ACR ≥ 70), and the tightest applicable target wins. The
  home/ambulatory target is always 5 mmHg lower than clinic on each axis.
- Control is classified against the **home/ambulatory** reading when present
  (less white-coat effect); the clinic reading still drives the ≥ 180/120 severe
  flag regardless.
- This is a **documentation-completeness** form as well as a control classifier:
  the review status (complete / partial / incomplete) grades how much of the
  annual review dataset is present, and completeness flags surface missing
  bloods, ACR, and untreated high CV risk.
- Wizard is twelve steps but must remain one continuous single-page wizard.
