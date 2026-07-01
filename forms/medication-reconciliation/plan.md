# Medication Reconciliation — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — relational schema in `sql/`: parent
   `medication_reconciliation` table plus child tables `information_source`,
   `allergy`, `medication_line_item` (tagged `bpmh` / `inpatient`), and
   `discrepancy`; UUIDv4 PKs; `created_at` / `updated_at` / `deleted_at`
   timestamps. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Reconciliation engine** — `types.ts`, `utils.ts`,
   `reconciliation-rules.ts`, `reconciler.ts`, `flagged-issues.ts` with Vitest
   tests covering every status class, discrepancy type, and safety flag.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list +
   `/<plural>/[id]` form). Plural route base: `medication-reconciliations`.
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema (one migration + one `_entity` per SQL table).
7. **Verify** — `bin/test-form medication-reconciliation`, Lily drift checks,
   spec / changelog drift checks.

## Design notes

- This is a **documentation / completeness** form: the engine grades a **status
  class**, it does not compute a numeric score.
- The BPMH and the inpatient list share one `medication_line_item` table
  discriminated by `listSource`; discrepancies reference line items by ref.
- **Two or more independent information sources** is the hard gate for leaving
  `incomplete` — enforce it in both the engine and the wizard UI.
- The **intentional** flag is the pivot: an intentional discrepancy with a
  documented action + rationale is expected and does not block `complete`; an
  unintentional discrepancy is an outstanding error.
- High-risk classes are **anticoagulant, insulin, opioid** — an unintentional
  discrepancy on any of these raises the top-priority safety flag.
- The medication line-item collections make the wizard variable-length; it must
  still be one continuous single-page wizard (repeatable line-item sub-forms, no
  page breaks).
