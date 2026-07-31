# Inpatient Clinical Note — back-end with Loco

Rust JSON API for the Inpatient Clinical Note form: axum + Loco 0.16 + SeaORM
1.1 + PostgreSQL. No HTML rendering layer.

## What it serves

Ten RESTful JSON resources under `/api/…`, one per SQL table, plus the
authentication routes the Loco starter provides and a Prometheus `/metrics`
endpoint.

## What it computes

`src/inpatient_clinical_note/engine/` carries both grading engines — the
documentation-completeness engine (Complete / Partial / Incomplete against the
components required for the note type) and the clinical-acuity engine
(Stable / Watch / Escalate / Critical by max-band). `grade()` is the single
entry point and returns both, plus the per-component presence, the fired-rule
audit trail, and the safety flags.

See [`../index.md`](../index.md) for the form design and
[`../spec/index.md`](../spec/index.md) for the normative rules.

## Verify

```sh
./00-new.sh                      # create the three databases (idempotent)
cargo build
cargo clippy --all-targets
cargo test
cargo deny --all-features check
```
