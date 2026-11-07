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
`forms/medical-operation-note/back-end-with-axum/`; single-table JSONB is
explicitly wrong.

## ADR-2 — Route layout nesting (snake back-end, kebab Svelte, RESTful plural)

**Context.** 286 forms need a predictable, collision-free route and source
layout across stacks.

**Decision.** Nest each stack under a per-form directory.
- **Back-end:** all crate source under `back-end-with-axum/src/<form_snake_case>/`
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

## ADR-6 — Plain Axum, axa, and sqlx replace Loco and SeaORM

**Context.** Each back-end crate was a Loco application on SeaORM: a large
dependency tree, YAML configuration, and a migration crate per form. The
scaffolded crates use little of that framework, and the published `axa` and
`axa-sqlx` crates cover what they do use.

**Decision.** Each crate is ordinary Axum calling `axa` 0.3, with `axa-sqlx` for
pooling and migrations. Models hold hand-written SQL run through sqlx. Migrations
are plain `.up.sql` and `.down.sql` files. Settings come from the environment.
Authentication, hashing, mail, and seeding stay in each crate's identical
`support/` module, because axa leaves them to services. This supersedes the
Loco-specific parts of ADR-2 and ADR-4; the Postgres-only queue stands.

**Consequences.** (+) About 30% fewer transitive dependencies per crate. (+) A
reviewer reads exactly the SQL that runs. (+) Production refuses to boot without
`DATABASE_URL`, and refuses to issue tokens without `JWT_SECRET`. (−) Queries are
checked by the test suite, not at compile time. (−) No generator scaffolds a new
crate, so a new form starts from a copy of an existing one. (−) The drift checks
between `sql/` and migrations (`loco-migration-defaults`,
`loco-migration-nullability`) parsed Rust migrations and were retired with them.

## ADR-7 — No built-in authentication; lists are paged

**Context.** Every crate carried a Loco-era auth scaffold: nine routes, a `users`
table, mail, and password hashing. No form controller and no front-end used it, so
it looked like access control while protecting nothing, and it brought in
`jsonwebtoken`, whose unused RSA and ECDSA code held two accepted advisories. List
routes returned whole tables, although `openapi.yaml` published `limit` and `offset`.

**Decision.** Remove the scaffold, and leave access control to whoever deploys a
crate. Page every top-level list with `axa-pagination`, at the published limits.
Remove the OpenTelemetry and Prometheus dependencies, which no code ever called, so
the crates export neither metrics nor traces. This supersedes the auth, hashing, and
mail parts of ADR-6 and the observability part of ADR-2.

**Consequences.** (+) About 100 fewer locked packages per crate, and no accepted
advisories in `deny.toml`. (+) A list cannot return an unbounded table. (+) The crates
say plainly that they have no access control. (−) A deployment has to bring its own.
(−) A client that read a list as complete now gets its first 100 rows, and must
follow `x-total-count`. (−) A database migrated since ADR-6 has a recorded `users`
migration that no longer exists, so it needs `db reset`.

## ADR-8 — Errors are RFC 9457 problems

**Status.** Superseded by ADR-10.

**Context.** A failed request answered in one of three shapes: `axa::Error` wrote
`{"error", "description"}`, Axum's extractors wrote plain text that quoted the input,
and an unknown route wrote nothing. `axa` plans to move `Error` to
`application/problem+json`, and `axa-problem` is published, but `axa` 0.5 does not
convert yet.

**Decision.** Each crate rewrites failed responses in `support/problem.rs`, built on
`axa::problem::Problem`. A rewrite on the way out covers every source without
touching a handler. It runs inside the middleware, ahead of compression, and again
outside it, for the panics and timeouts the middleware answers. Health routes under
`/_` keep their own bodies.

**Consequences.** (+) A client handles one error shape, which `openapi.yaml`
publishes. (+) `axa::Error` keeps logging the real cause, and no input is echoed.
(−) An extractor refusal no longer says which field failed. (−) The rewrite parses a
body that `axa::Error` has just written, and should go once `axa` writes problems
itself. (−) A client reading `error` or `description` from an error body must move to
`title` and `detail`.

## ADR-9 — Deletes are soft, and cascade

**Context.** `deleted_at` was on every table, but `DELETE` removed the row and its
children, lists returned rows a client had marked, and a client could set the column.
These are clinical records, which must outlive a mistaken or disputed delete.

**Decision.** `DELETE` marks the row and follows every `ON DELETE CASCADE` key in one
statement, so a deleted assessment takes its grades with it. A `SET NULL` key is left,
because the reference still says what a row referred to. Reads and updates skip marked
rows, `deleted_at` is in no body, and unique indexes cover live rows only.
`bin/axum-soft-delete --check` holds this in CI.

**Consequences.** (+) A deleted record survives, with the time it was deleted. (+) A
deleted row cannot block its replacement. (−) The API offers no restore and no purge,
so retention needs its own decision. (−) `sql/` still declares plain `UNIQUE`, and the
crates' migrations narrow it.

## ADR-10 — axa writes the errors and the paging

**Context.** ADR-8 said the rewrite in `support/problem.rs` should go once `axa` wrote
problems itself. `axa` 0.6 does, for every failure including Axum's 404, 405, 413 and
extractor refusals, and answers a broken unique or foreign key as `409`. It also gained
the page helpers that `support/paging.rs` held.

**Decision.** Remove both modules, and return `router` to `into_app`. Export
`axa::extract::{Json, Path, Query}` from each crate's prelude, because Axum's own
extractors give a problem with no `detail`. Keep `PAGE_LIMITS`, which is this
service's choice, in `support/mod.rs`. `openapi.yaml` publishes the `409` and the
`code` and `errors` members.

**Consequences.** (+) A refused request says what was wrong, and quotes no input. (+) A
duplicate or a missing reference is the caller's `409`, not a `500`. (+) No crate parses
an error body it has just written. (−) A `(StatusCode, "why")` answer loses its text, so
handlers must return an `Error`. (−) `409` covers both a duplicate and a missing
reference, and only `detail` tells them apart.

## ADR-11 — A request limit per client, and fixtures only in development

**Context.** The crates have no authentication (ADR-7), so nothing slowed a client that
sent requests as fast as it could. `task seed` loaded made-up records wherever it ran,
production included. `axa` 0.6 offers `axa-ratelimit` and `Task::development_only` for
these. Five hand-written controllers still wrote paging headers by hand and wrapped
lists in `{items, total}`, unlike the bare array `openapi.yaml` documents.

**Decision.** Each crate limits a client to 600 requests a minute with
`axa::ratelimit::by_client`, layered on the routes inside `axa::middleware::apply`,
which works out the client's address first. `router` builds the stack itself, because
`into_app` leaves no room inside it. The limit is in `support/mod.rs`. The `seed` task is
development only. Every list, the dashboards included, answers with `Page::respond`.
`openapi.yaml` publishes the `429` on every operation. `bin/axum-axa-adopt --check`
keeps all three.

**Consequences.** (+) A runaway client gets a `429` problem with `Retry-After`, and
health probes are never limited. (+) Fixtures cannot reach a production database.
(+) The dashboards page, and report a true total. (−) Each process counts for itself,
so several replicas give a client several limits. (−) Behind a proxy, `TRUSTED_PROXIES`
must list it, or every client shares the proxy's one limit. (−) Dashboard clients
reading `items` must read the array, with the total in `x-total-count`.

## ADR-12 — The database enforces the CHECK constraints in `sql/`

**Context.** `sql/` declares 7,803 CHECK constraints, mostly the allowed values of an
enum field. The crates' migrations were generated without them, so a crate stored
anything: `"sex": "banana"` answered 200. The seed fixtures and test rows had been
written to match, with values such as `status: "Test status"`.

**Decision.** `bin/axum-check-constraints` writes one migration per crate holding every
CHECK whose columns the crate's table has (7,781; 22 name a column the crate lacks).
Each is added `NOT VALID`, so a database holding an old bad row still migrates and
starts. `bin/axum-fixture-checks` gives the fixtures and test rows allowed values,
judged by Postgres. Each crate gains a `build.rs`, because `sqlx::migrate!` embeds the
migrations and Cargo did not rebuild when one was added.

Every crate is on axa 0.6.2, which answers a broken CHECK or NOT NULL constraint as
`422` `unprocessable_entity`, naming neither the value nor the field, and 351 crates
test that with a value their CHECK does not list.

**Consequences.** (+) Stored values are the ones the form offers, and a caller who
sends another learns it is theirs to fix. (+) A new migration reaches the next build.
(−) Rows stored before stay unchecked until someone runs `VALIDATE CONSTRAINT`. (−) The
`422` does not say which field, so a client must check its own values against the
OpenAPI enums. (−) A change to `sql/` must be followed by both tools.

