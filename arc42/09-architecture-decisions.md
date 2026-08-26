# 9. Architecture Decisions

Short ADRs (context / decision / consequences) for the load-bearing choices.

## ADR-1 — Relational per-table Loco schema (not single-table JSONB)

**Context.** Each form's back-end must persist the submitted record and its
computed grade. A tempting shortcut is a single table with one JSONB `data`
column per form.

**Decision.** Use a **relational schema**: one SQL migration and one SeaORM
entity per table. The core `<form>` record, the `<form>_grade` result, the
`<form>_grade_rule` audit rows, the `<form>_grade_flag` rows, and any
domain-specific child tables (team members, procedures, implants, …) are each
their own table with a UUID PK and the timestamp trio.

**Consequences.** (+) The schema is the interoperability source of truth — the
XML/FHIR/protobuf/OpenAPI generators project real columns, and the grading
audit trail is queryable. (+) Every generated representation is meaningful. (−)
More migrations and entities per form. The reference crate is
`forms/medical-operation-note/back-end-with-loco/`; single-table JSONB is
explicitly wrong.

## ADR-2 — Route layout nesting (snake back-end, kebab Svelte, RESTful plural)

**Context.** 286 forms need a predictable, collision-free route and source
layout across stacks.

**Decision.** Nest each stack under a per-form directory.
- **Back-end:** all crate source under `back-end-with-loco/src/<form_snake_case>/`
  (crate root keeps `Cargo.toml`, `config/`, `migration/`, `tests/`).
- **Svelte:** all routes under `src/routes/<form-kebab-case>/`, served at
  `/<slug>/`, with a **RESTful collection** named by the pluralized slug:
  `/<slug>/<plural>/` is the dashboard list and `/<slug>/<plural>/[id]` is the
  wizard (`[id] = new` to create); `/<slug>/` is a welcome page.

**Consequences.** (+) Uniform, guessable URLs and paths; no cross-form
collisions. (+) `include_dir!`/`include_str!` literals are crate-root-relative
and reference `src/<snake>/…` consistently. (−) A route-nesting reorg once left
every Svelte `+layout.svelte` importing `../app.css` instead of `../../app.css`
(fixed repo-wide). Tools `bin/route-loco-layout` and `bin/route-svelte-layout`
enforce the layout.

## ADR-3 — HTML front-end consolidation onto one `front-end-with-html/`

**Context.** Forms historically had split `front-end-form-with-html/` +
`front-end-dashboard-with-html/` directories duplicating CSS/JS.

**Decision.** Consolidate to a single `front-end-with-html/` per form: one
`index.html` wizard, one `dashboard.html`, sharing one `css/` and `js/` (engine
in `js/{types,rules,grader,flags}.js`). The analogous Svelte consolidation is a
single `front-end-with-svelte/` app.

**Consequences.** (+) One directory, one stylesheet, one engine copy per stack;
the wizard and dashboard cross-link. (+) Complete across all forms. (−) Legacy
split directories had to be migrated when touched. `bin/consolidate-front-end-html`
performs the merge.

## ADR-4 — Postgres-only background queue + OTel/Prometheus observability

**Context.** Loco offers SQLite-, Redis-, and Postgres-backed background
queues; observability must be consistent across every crate.

**Decision.** Every Loco crate uses **only the Postgres-backed queue**
(`loco-rs` with `default-features = false` + `bg_pg`; `bg_sqlt` and `bg_redis`
forbidden), and emits **OpenTelemetry metrics + traces over OTLP** plus a
**Prometheus `/metrics`** endpoint on the same axum router.

**Consequences.** (+) One datastore to operate; no second source of truth for
job state; identical runtime footprint. (+) Uniform observability. (−) No
queue-backend choice per form. `bin/loco-config-refactor --check` is the drift
detector, editing `Cargo.toml` and `config/*.yaml` and failing on drift.

## ADR-5 — SQL as the single source of truth, with generated representations

**Context.** The same data shape must appear as XML/DTD, FHIR R5, Protocol
Buffers, OpenAPI, and the Loco scaffold. Multiple hand-maintained copies would
diverge.

**Decision.** `forms/<slug>/sql/` is the **single source of truth**. All other
representations are **generated** and **never hand-edited**; correctness is
regeneration idempotency (zero drift).

**Consequences.** (+) One authoritative schema; no divergence; interoperability
is free. (+) Drift gates (`bin/*-generate-* --check`, `bin/test-sql-apply`) make
this executable. (−) A shape change requires editing SQL then regenerating; a
hand-edit to a generated file is silently overwritten (so it is forbidden).
