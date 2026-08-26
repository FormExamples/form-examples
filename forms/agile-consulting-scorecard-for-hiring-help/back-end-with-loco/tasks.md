# Tasks

- [x] Author `Cargo.toml`, `.gitignore`, `src/lib.rs`, `src/bin/main.rs`
- [x] Author the scoring engine in `src/scoring/`
      (types, utils, manifesto, principles, flags, grader,
      recommendations, pre_tender, diff, bulk_import). All five
      feature modules are 1:1 ports of their TypeScript counterparts —
      the Rust crate now has **full engine parity** with the Svelte
      engine: grader + recommendations + pre-tender + diff +
      bulk-import. Recommendations: 5 cases. Pre-tender: 5 cases.
      Diff: 6 cases. Bulk-import: 6 cases (empty input, single line,
      three lines with stable line numbers, blank+comment skipping,
      malformed-JSON rejection, mixed input)
- [x] Author 7 unit tests in `grader.rs` covering empty input, all-true,
      band boundaries (4/5/6/11), explicit-false flag firing, the
      `working-software` flag's two-condition rule, and the fired-rules
      count
- [x] Author `templates/base.html.tera` with HTMX 2.0.8 and Alpine.js 3.14.8
- [x] Stand up a minimal axum HTTP server
      (`src/bin/server.rs` + `src/server/{mod,sample,dashboard,grade}.rs`)
      with `GET /api/dashboard/scorecards`, `GET /api/scorecards/{id}`,
      and `POST /api/grade`. Same JSON shape as the SvelteKit
      `+server.ts` endpoints, with the scoring engine wired into
      `/api/grade` end-to-end (smoke-tested with the golden sample —
      score 9 / band medium / 2 flags)
- [x] Convert the crate from a thin axum server to a full Loco app:
      `Cargo.toml` workspace with `migration/` subcrate, SeaORM entity
      for `scorecards`, Hooks-based `app::App`, Loco CLI entry binary
      (`agile-consulting-scorecard-cli` now wraps `cli::main`),
      `config/development.yaml`. Single migration creates a
      `scorecards` table with `data` + `result` JSONB columns plus
      denormalized headline columns (`organization_name`, `sector`,
      `size_band`, `computed_band`, `score_total`, `assessment_date`)
      and indexes on `computed_band` and `sector`. Replaces the
      thin in-memory axum server end-to-end
- [x] Wire the scoring engine into Loco controllers
      (`src/controllers/scorecards.rs`) preserving the existing nine
      HTTP endpoints byte-for-byte at the same paths, persisting
      every submitted assessment via SeaORM
- [ ] Author `templates/assessment.html.tera` (six-step wizard with
      step partials) — read side is wired; the write-side wizard
      remains to be authored
- [x] Author `templates/report.html.tera` for the rendered report,
      backed by `controllers::html::report`. Pulls the row through
      `scorecards_model::find_by_id` + `grade(...)`, re-derives
      `recommended_actions` from the persisted JSON, and renders the
      score block, band badge, flag list, and recommended-action
      ordered list
- [x] Author `templates/dashboard.html.tera` (+ `_scorecard_table.html.tera`
      partial), backed by `controllers::html::dashboard`. HTMX-driven
      live filter on band / sector / search via
      `GET /dashboard/table` returning just the table partial
- [x] Author `templates/landing.html.tera` — root marketing page with
      readiness-band explainer and pointers into the JSON API
- [x] Tera initialized in `app::App::routes` and threaded into the
      HTML controller via an `Extension<Arc<Tera>>` layer
- [x] In-memory `ScorecardStore` in `src/server/store.rs` wrapping an
      `Arc<Mutex<>>` of submitted rows + id counter. `POST /api/scorecards`
      (`src/server/submit.rs`) scores via `grade_scorecard`, allocates a
      `s-1000+` id, stores the row, returns it with `201 Created`.
      `GET /api/dashboard/scorecards` and `GET /api/scorecards/{id}` see
      seed + submitted rows. State injected via `with_state` so tests
      can use a fresh store per case
- [x] Integration tests for the axum endpoints in `tests/server_test.rs`
      (10 cases driving the router in-process via `tower::ServiceExt`):
      list returns 12 rows, lookup returns Pharos Pharma, unknown id
      returns 404, `POST /api/grade` matches the golden sample, invalid
      JSON → 400, schema-violating JSON → 422, submit creates a row
      and dashboard lists it (12 → 13), submit rejects invalid JSON,
      `POST /api/recommendations` against the golden sample returns
      7 actions in the canonical scorecard order, `POST /api/pre-tender`
      returns the redacted summary (band medium, score 9, no respondent
      identity or per-item evidence in the payload), `POST /api/diff`
      with a low→medium improvement reports `scoreDelta: 2`,
      `bandChanged: true`, and two improved items, `POST /api/bulk-import`
      with three golden rows + blank line + comment + 1 malformed line
      returns `accepted: 3`, one rejection at line 5, and the dashboard
      grows from 12 → 15, `GET /api/stats` reports the expected seed
      band distribution (3 high / 1 borderline / 5 medium / 3 low),
      sector counts, and `averageScore ≈ 91/12 ≈ 7.58`
- [x] Rust `POST /api/recommendations` endpoint (`src/server/recommendations.rs`)
      backed by `scoring::recommendations::get_recommended_actions`
- [x] Rust `POST /api/pre-tender` endpoint (`src/server/pre_tender.rs`)
      backed by `scoring::pre_tender::summarise`
- [x] Rust `POST /api/diff` endpoint (`src/server/diff.rs`) backed by
      `scoring::diff::diff_assessments`. Accepts `{before, after}`
- [x] Rust `POST /api/bulk-import` endpoint (`src/server/bulk_import.rs`)
      accepts a JSON-Lines body, validates and grades each row, persists
      every accepted row into the `ScorecardStore`, and returns
      `{ accepted, rejected, totalLines, skippedBlank, skippedComment }`
- [x] Rust `GET /api/stats` endpoint (`src/server/stats.rs`) — aggregate
      counts across seed + submitted scorecards: `total`, `byBand`,
      `bySector`, `bySize`, `flagCount`, `flagCountByCategory`,
      `averageScore`. Suitable for the dashboard's at-a-glance band
      distribution and a "compare with benchmark" UI
- [ ] Loco-level integration tests for the assessment, grade, and
      dashboard controllers (once the Loco app replaces the thin
      axum server)
