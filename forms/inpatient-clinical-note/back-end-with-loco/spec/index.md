# Inpatient Clinical Note — back-end-with-loco spec

JSON API contract for the Inpatient Clinical Note back-end. This file is the
living spec for the `back-end-with-loco/` crate; it sits alongside the form's
domain spec at [`../../spec/index.md`](../../spec/index.md), which is normative
for the grading rules.

The cross-cutting back-end conventions (stack, observability, queue, Cargo
features) live in
[`../../../AGENTS/back-end-with-loco.md`](../../../AGENTS/back-end-with-loco.md).

## 1. Resources

The crate exposes a **relational per-table** API, not a single JSONB blob:
one RESTful resource per SQL table in [`../sql/`](../sql/).

| Resource | Table | Purpose |
| --- | --- | --- |
| `patient` | `patients` | Patient demographics |
| `clinician` | `clinicians` | Note author, responsible consultant, senior reviewers |
| `inpatient_clinical_note` | `inpatient_clinical_notes` | The note itself |
| `inpatient_clinical_note_problem` | `inpatient_clinical_note_problems` | Problem-list rows |
| `inpatient_clinical_note_medication_change` | `inpatient_clinical_note_medication_changes` | Prescribing-change rows |
| `inpatient_clinical_note_investigation` | `inpatient_clinical_note_investigations` | Investigations-reviewed rows |
| `inpatient_clinical_note_job` | `inpatient_clinical_note_jobs` | Outstanding-job rows |
| `inpatient_clinical_note_grade` | `inpatient_clinical_note_grades` | Computed grading result |
| `inpatient_clinical_note_grade_rule` | `inpatient_clinical_note_grade_rules` | Fired-rule audit trail |
| `inpatient_clinical_note_grade_flag` | `inpatient_clinical_note_grade_flags` | Safety flags |

## 2. Routes

Every resource carries the same six routes under `/api/<plural>/`:

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/<plural>/` | List every record |
| POST | `/api/<plural>/` | Create a record |
| GET | `/api/<plural>/{id}` | Fetch one record |
| PUT | `/api/<plural>/{id}` | Replace a record |
| PATCH | `/api/<plural>/{id}` | Update a record |
| DELETE | `/api/<plural>/{id}` | Remove a record |

Request and response bodies are `application/json` with camelCase keys via
`serde(rename_all = "camelCase")`. Prometheus metrics are at `/metrics`.

## 3. Keys and relations

- Primary keys are `i32` (`ColType::PkAuto`), following the Loco scaffold
  convention used across every crate in this monorepo. The SQL source of truth
  uses UUIDs; the mapping is at the persistence boundary.
- `created_at` and `updated_at` are supplied by Loco's `create_table`;
  `deleted_at` is an explicit nullable column, and records are soft-deleted.
- `inpatient_clinical_notes` holds **two** foreign keys into `clinicians`:
  `author_id` and `responsible_consultant_id`. The migration passes explicit FK
  column names, and the entity gives each a distinct `Relation` variant with a
  single `Related` impl. See `AGENTS.md`.

## 4. Grading engine

`src/inpatient_clinical_note/engine/` implements both engines defined in the
form's domain spec:

```rust
pub fn grade(note: &InpatientClinicalNote) -> NoteGrade
```

`NoteGrade` carries the completeness status and percentage, the final and
computed acuity bands, whether the band was overridden, the NEWS2 totals
(entered and derived), the per-component presence for all twelve components,
the fired-rule audit trail from both engines, and the safety flags.

The engine is pure: no I/O, no database access, no clock beyond what the caller
supplies. It mirrors the TypeScript engine in
`../front-end-with-svelte/src/lib/engine/` and the plain-JavaScript engine in
`../front-end-with-html/js/`. All three must agree; the spec's worked examples
are the shared fixtures.

## 5. Not yet implemented

No controller currently persists a computed grade. `grade()` is callable but
the `inpatient_clinical_note_grade` rows are written by clients today. A
`POST /api/inpatient_clinical_notes/{id}/grade` endpoint that runs the engine
server-side and persists the grade, its rules, and its flags is the natural next
step; it is deliberately out of scope until a caller needs it.

## 6. Verify

```sh
./00-new.sh
cargo build && cargo clippy --all-targets && cargo test
cargo deny --all-features check
```
