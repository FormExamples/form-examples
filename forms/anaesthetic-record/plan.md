# Anaesthetic Record — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — relational schema in `sql/`: parent `anaesthetic_record`
   table (case identification, pre-induction checks, ASA & airway, airway
   management, monitoring, technique, fluids, regional, recovery handover,
   sign-off) plus child tables `drug_administration`, `timed_observation`, and
   `intra_operative_event`, each with a UUIDv4 PK, a foreign key to the record,
   and `created_at` / `updated_at` / `deleted_at`. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Completeness / validation engine** — `types.ts`, `utils.ts`,
   `validation-rules.ts`, `record-validator.ts`, `flagged-issues.ts` with Vitest
   tests covering each status class, each mandatory rule path, and every safety
   flag.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form). The wizard must render the repeating drug / observation / event rows.
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema (one migration + one `_entity` per SQL table).
7. **Verify** — `bin/test-form anaesthetic-record`, Lily drift checks, spec /
   changelog drift checks.

## Design notes

- This is a **documentation / completeness** form, not a numeric score. The
  engine classifies **Complete / Partial / Incomplete** against mandatory-item
  rules and raises safety flags independently of the status.
- The wizard has 12 steps but must remain one continuous single-page wizard. No
  multi-page forms.
- Timed observations, drug administrations, and intra-operative events are
  repeating child rows — the UI needs add / remove row controls, and the schema
  models them as separate child tables with a foreign key to the parent record.
- Safety-critical vs non-critical mandatory items drive the difference between
  `incomplete` and `partial`; keep the two lists (spec §4) in one place in the
  engine so the UI and the classifier never diverge.
- Allergy-conflict detection is a case-insensitive substring match between drug
  names and `documentedAllergies`; keep it conservative (favour flagging).
