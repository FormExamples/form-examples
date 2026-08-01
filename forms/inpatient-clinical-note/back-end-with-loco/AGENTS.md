# Inpatient Clinical Note — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the Inpatient Clinical Note form, built with axum +
Loco + SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- `src/inpatient_clinical_note/` — the crate source: `app.rs` (route
  registration), `controllers/`, `models/`, `engine/`, `bin/main.rs`; alongside
  `migration/`, `config/` (dev / test / production YAML), and `tests/`.
- **Relational per-table schema** mirroring [`../sql/`](../sql/): one SeaORM
  model and one RESTful scaffold controller per SQL table — patients,
  clinicians, the note and its four child tables, and the grade / grade_rule /
  grade_flag tables. There is no single JSONB blob table.

## JSON API

A RESTful JSON resource is served per domain table under `/api/…`, each
supporting list (`GET`), create (`POST`), and `GET` / `PUT` / `PATCH` /
`DELETE` by id. All bodies are `application/json` with camelCase keys via
`serde(rename_all = "camelCase")`. Prometheus metrics are exposed at
`/metrics`. The registered domain controllers are:

  - `patient`
  - `clinician`
  - `inpatient_clinical_note`
  - `inpatient_clinical_note_problem`
  - `inpatient_clinical_note_medication_change`
  - `inpatient_clinical_note_investigation`
  - `inpatient_clinical_note_job`
  - `inpatient_clinical_note_grade`
  - `inpatient_clinical_note_grade_rule`
  - `inpatient_clinical_note_grade_flag`

Beyond the per-table CRUD, the note resource carries two grading endpoints:

- `POST /api/inpatient_clinical_notes/{id}/grade` — run both engines over the
  stored note and persist the result. Returns the grade row and the full engine
  output, including the fired-rule and flag audit trail.
- `GET /api/inpatient_clinical_notes/{id}/grade` — the most recent persisted
  grade, or 404 if the note has never been graded.

Grading is **append-only**: each `POST` inserts a new grade row rather than
updating the last, so a note's grading history stays auditable. The grade row
and its rule and flag children are written in one transaction.

Note that the grade row is a SeaORM entity and therefore serialises
**snake_case**, as every entity controller in this crate does; the engine
result nested beside it is camelCase.

## Engine

`src/inpatient_clinical_note/engine/` carries both grading engines, mirroring
the front-end implementations:

- `types.rs` — the note shape, the twelve components, both band enums.
- `news2.rs` — RCP 2017 parameter scoring and aggregate derivation. An entered
  total always wins over a derived one; both are reported.
- `completeness.rs` — the per-component predicates, the note-type-specific
  required set, and `grade()`, the single entry point that runs both engines.
- `acuity.rs` — the max-band acuity rules.
- `flagged_issues.rs` — the twelve safety flags.

`src/inpatient_clinical_note/grading.rs` is the bridge from the relational
schema to those pure functions: it loads a note and its children, projects them
onto the engine's input shape, and persists the result. No clinical rule lives
there.

**The required-component set varies by note type** (spec §4.2) — never hard-code
a single list; call `is_required()` / `extra_required()`.

**Never render an enum with `{:?}` across a boundary.** The `Debug` form is
`PascalCase`; the database CHECK constraints, both front-end engines, and the
JSON bodies are all kebab-case. Use `as_str()`.

`AcuityBand` derives `Ord` in ascending severity order, which is what makes the
max-band algorithm a plain `max()`. Keep the variant order as-is.

The engine is exercised by `tests/engine/mod.rs`, which mirrors the worked
examples in `../doc/acuity-rules.md` and the boundaries in `../spec/index.md`.
When a rule changes here, change it in both front-ends in the same commit.

## Note on column defaults

The migration mirrors the column defaults in [`../sql/`](../sql/) — `''` for
text, `0` for `sort_order`, `draft` for the note's `status`, `scale-1` for
`spo2_scale` — via `ColType::StringWithDefault` / `TextWithDefault` /
`IntegerWithDefault`. `cargo loco generate scaffold` cannot express defaults, so
regenerating from `../back-end-with-loco-setup` drops them and reintroduces a
schema that disagrees with `sql/`. Re-apply them if that happens.

## Note on two FKs to one parent

`inpatient_clinical_notes` references `clinicians` twice — `author_id` and
`responsible_consultant_id`. Two consequences to preserve:

- The migration passes the **explicit column name** in the references list
  (`("clinician", "author_id")`), because Loco otherwise derives `clinician_id`
  for both and Postgres rejects the duplicate column.
- The entity gives each FK a **distinct `Relation` variant**, and only the first
  gets a `Related` impl — a second would be a conflicting trait implementation.

## Verify

```sh
cargo build && cargo clippy --all-targets && cargo test
cargo deny --all-features check
```

The DB-backed model and request tests need the `inpatient_clinical_note_test`
database; `./00-new.sh` creates it.
