# 12. Glossary

| Term | Definition |
| ---- | ---------- |
| **Form (project)** | One self-contained, full-stack implementation of a single clinical or administrative form, living under `forms/<slug>/`. The unit of composition in the monorepo. |
| **Form slug** | The kebab-case directory name of a form (e.g. `cardiology-request`). Also the base for the Svelte route prefix `/<slug>/`, the snake-case back-end source dir `src/<form_snake_case>/`, and the per-form database names. |
| **Pluralised slug** | The RESTful collection name for a form's resource (e.g. `cardiology-requests`), used in Svelte routes `/<slug>/<plural>/`. |
| **Wizard** | The single-page, step-by-step questionnaire — the whole form on one URL, navigated in-page. Never a multi-page form. |
| **Dashboard** | The vetting/listing view of a form's collection: a data table of submitted records with computed scores, severities, and flags. |
| **Grading engine (scoring engine)** | The pure logic that turns a submitted record into a grade. Decomposed into `types → rules → grader → flagged-issues` and mirrored in HTML JS, Svelte TS, and Rust. |
| **Grade** | The engine's computed result for a record, persisted in `<form>_grade` (scoring axes/bands, recommendation, sign-off). |
| **Fired rule** | A scoring rule that triggered for a record, recorded in `<form>_grade_rule` with a stable `rule_id`, its axis, category, and description — the grading audit trail. |
| **Flagged issue (safety flag)** | A safety-critical condition raised independently of the scoring axes, recorded in `<form>_grade_flag` with a stable `flag_id`, category, priority, description, and suggested action. |
| **Axis** | One dimension of a grade (e.g. cardiology's four axes: appropriateness, safety, completeness, triage). |
| **Empty-value sentinel** | The convention for unanswered fields: `''` for text/enum, `null` for numeric/date/time — so in-progress drafts never violate `NOT NULL` or diverge the grader. |
| **Lily Design System** | A **headless** design system (HTML and Svelte flavours) consumed as a *class-vocabulary + ARIA/keyboard contract*, not a runtime library. Both flavours emit the same class names so one stylesheet serves both stacks. |
| **Lily pin** | The pinned upstream Lily commit hash (`forms/lily-version.md`, `forms/lily-svelte-version.md`) with snapshot directories `forms/lily-spec/` and `forms/lily-svelte-spec/`. |
| **Loco** | The Rails-like Rust web framework (on axum) used for every form's back-end JSON API crate. |
| **SeaORM** | The Rust ORM Loco crates use to map entities to PostgreSQL 18. |
| **FHIR R5** | HL7 FHIR Release 5 — the health-interoperability standard the JSON resources are generated to (one per SQL entity), plus a sample FHIR R5 Bundle per form. |
| **OpenAPI 3.1** | The API-description standard generated per SQL entity (`openapi/*.yaml`). |
| **Protocol Buffers** | Google's wire schema language; `.proto` files generated per SQL entity. |
| **XML / DTD** | Structured-document representation generated per SQL entity. |
| **Generated artefact** | A file produced by a `bin/` generator from the SQL source of truth; never hand-edited (XML, FHIR, protobuf, OpenAPI, Loco setup script). |
| **Drift gate / drift detector** | A `--check` mode of a generator or refactor tool that re-runs generation in dry-run and exits non-zero if any output would change — an executable "source and artefacts agree" test. |
| **Spec-driven development** | The process of updating the spec before code, and changing code because the spec changed (`spec.md` §10). |
| **Living spec** | The hand-maintained per-form domain spec at `forms/<slug>/spec/index.md` (with a `README.md` symlink); the behaviour contract. |
| **AGENTS.md / CLAUDE.md** | Machine-readable instructions that direct AI coding agents operating the repo, at the root and per-form/per-stack. |
| **`/api/assessments`** | The canonical JSON API resource every back-end exposes (list, create, read, update, submit, result). |
| **`/metrics`** | The Prometheus text-format scrape endpoint every Loco crate exposes, alongside OpenTelemetry OTLP export. |
| **Background queue (`bg_pg`)** | The Postgres-backed Loco job queue — the only queue backend used (`bg_sqlt`/`bg_redis` are forbidden). |
