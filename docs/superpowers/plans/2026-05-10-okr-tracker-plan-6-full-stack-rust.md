# OKR Tracker — Plan 6: Full-stack Rust (Loco + axum + Tera + HTMX + Alpine.js)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Promote the engine-only Rust crate from Plan 1 into a full Loco web application. Persists OKR data in PostgreSQL via SeaORM. Serves the ten-step wizard and the dashboard via server-rendered Tera templates with HTMX for partial updates and Alpine.js for tiny interactions. Reuses the existing Rust scoring engine (Plan 1) unchanged.

**Architecture:**

- **Backend:** Loco (axum + SeaORM + tokio). One model per SQL table from Plan 1. SeaORM migrations are translated 1:1 from Plan 1's Liquibase SQL.
- **Routing:** server-rendered HTML with HTMX `hx-boost`, HTMX partial swaps for KR add/remove and filter changes, Alpine.js for the tiniest of UI state (collapsible detail panel).
- **Endpoints:**
  - `GET /` → dashboard (`templates/dashboard/index.html.tera`).
  - `GET /objectives/new` → wizard.
  - `POST /objectives` → create.
  - `GET /objectives/:id` → wizard pre-filled in edit mode.
  - `PATCH /objectives/:id` → save (HTMX-driven, returns the updated section).
  - `POST /objectives/:id/key-results` → add KR (returns HTMX partial).
  - `DELETE /objectives/:id/key-results/:position` → remove KR (returns HTMX partial).
  - `POST /objectives/:id/check-ins` → record a check-in.
  - `POST /objectives/:id/score` → compute grade + flags via the scoring engine, persist to `okr_grade` and `okr_grade_rule`/`okr_grade_flag`, return the result section.
  - `GET /objectives/:id/export.pdf` → PDF (server-rendered via `printpdf` or rendered HTML → `chromium --headless`).
  - `GET /objectives/:id/export.json` → full OKR as JSON.
  - `GET /objectives/:id/export.fhir.json` → FHIR R5 `Goal` bundle.
  - `GET /objectives/:id/export.xml` → XML representation.
  - `GET /objectives/:id/export.txt` → plain-text triage summary.
- **Templates:** `templates/base.html.tera` includes HTMX 2.0.8 and Alpine.js 3.14.8 (per repo convention; see `AGENTS/full-stack-with-loco-tera-htmx-alpine.md` and `bin/test-form` expectations).
- **Testing:** Loco's built-in integration test harness (`tests/`), plus Playwright tests against the running server.

**Tech Stack:** Rust 2024, Loco-rs (latest), SeaORM, axum, Tera, tokio, HTMX 2.0.8 (CDN), Alpine.js 3.14.8 (CDN), `printpdf` for PDF, Playwright for end-to-end.

**Plan-6 acceptance gate:**
1. `cargo loco start` runs the server on port 5150 with a connected Postgres database.
2. `bin/test-form objectives-and-key-results-tracker` passes (this is the repo-wide gate; passes only when the full-stack scaffold + templates exist).
3. The wizard at `http://localhost:5150/objectives/new` creates objectives that survive a server restart.
4. The dashboard at `/` lists every persisted objective with the filter sidebar.
5. POST `/objectives/:id/score` returns the same RAG and flag list as Plan 1's `cargo test --test scoring_fixtures` for the corresponding fixture, persisted to `okr_grade*` tables.
6. Each export endpoint returns a non-empty body of the right content type.
7. The new Playwright suite under `tests/playwright/` passes a wizard-then-score-then-dashboard happy path.

---

## File structure (after Loco generation)

```
forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/
  Cargo.toml                                 # upgraded — add loco, sea-orm, axum, tera, tokio
  src/
    app.rs                                   # Loco app registration
    bin/main.rs                              # entry point
    main.rs                                  # bin entry
    lib.rs
    scoring/                                 # KEEP — Plan 1's engine
    models/                                  # one module per entity (8)
      _entities/                             # SeaORM auto-generated
      reporter.rs, participant.rs, okr_objective.rs, …
    controllers/
      home.rs                                # dashboard
      objectives.rs                          # wizard + CRUD + score + exports
      key_results.rs                         # HTMX partials
      check_ins.rs                           # HTMX partial
    views/
      objectives/                            # Tera helper functions
  migration/
    Cargo.toml
    src/
      m20260510_000001_extensions.rs
      m20260510_000002_create_reporter.rs
      m20260510_000003_create_participant.rs
      m20260510_000004_create_okr_objective.rs
      m20260510_000005_create_okr_key_result.rs
      m20260510_000006_create_okr_check_in.rs
      m20260510_000007_create_okr_grade.rs
      m20260510_000008_create_okr_grade_rule.rs
      m20260510_000009_create_okr_grade_flag.rs
  templates/
    base.html.tera                            # HTMX + Alpine
    dashboard/
      index.html.tera
      _row.html.tera
      _detail.html.tera
    objectives/
      wizard.html.tera
      _step01.html.tera … _step10.html.tera
      _kr_fieldset.html.tera                  # HTMX partial for one KR
      _score_result.html.tera
  tests/
    requests/objectives.rs                    # Loco integration tests
    playwright/
      package.json
      e2e.spec.ts
      playwright.config.ts
  config/
    development.yaml, test.yaml, production.yaml
```

---

## Task 1: Upgrade `Cargo.toml` to a full Loco app

**Files:**
- Modify: `forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/Cargo.toml`

- [ ] **Step 1: Replace the engine-only Cargo.toml** with a full Loco workspace. Mirror the structure of `forms/issue-tracker/full-stack-with-loco-tera-htmx-alpine/Cargo.toml` (which is the closest sibling). Specifically:

```toml
[package]
name = "objectives-and-key-results-tracker"
version = "0.1.0"
edition = "2024"
publish = false
default-run = "objectives-and-key-results-tracker-cli"

[workspace]
members = [".", "migration"]

[dependencies]
loco-rs = { version = "0.16", default-features = false, features = ["cli", "auth_jwt"] }
migration = { path = "migration" }
sea-orm = { version = "1.1", features = ["sqlx-postgres", "runtime-tokio-rustls", "macros"] }
tokio = { version = "1.41", features = ["full"] }
async-trait = "0.1"
axum = "0.7"
tera = "1.20"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
chrono = { version = "0.4", features = ["serde"] }
uuid = { version = "1", features = ["v4", "serde"] }
printpdf = "0.7"
tracing = "0.1"
thiserror = "2"

[dev-dependencies]
loco-rs = { version = "0.16", default-features = false, features = ["testing"] }
serial_test = "3"
insta = "1"
rstest = "0.23"

[lib]
name = "objectives_and_key_results_tracker"
path = "src/lib.rs"

[[bin]]
name = "objectives-and-key-results-tracker-cli"
path = "src/bin/main.rs"
```

- [ ] **Step 2: Verify the crate still compiles**

```sh
cd forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine
cargo build
```

Expected: `cargo build` succeeds (will pull many new deps).

- [ ] **Step 3: Commit**

```sh
git add forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/Cargo.toml
git commit -m "OKR tracker: Rust full-stack Cargo.toml (loco/sea-orm/axum/tera)"
```

---

## Task 2: Generate the Loco app scaffold

Loco has a `cargo loco generate` command that scaffolds models, controllers, and migrations. We need to scaffold all eight entities. The repo already includes `full-stack-with-loco-tera-htmx-alpine-setup` shell scripts in each form's scaffold dir; the OKR form's version (auto-generated by `bin/create-form` from Plan 1) was not produced because the create-form script aborted before reaching that loop.

- [ ] **Step 1: Write the setup script** at `forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine-setup` (an executable shell script). Pattern from `forms/issue-tracker/full-stack-with-loco-tera-htmx-alpine-setup`:

```sh
#!/bin/sh
set -euf
createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco objectives_and_key_results_tracker_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco objectives_and_key_results_tracker_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco objectives_and_key_results_tracker_production || :
loco new --name objectives-and-key-results-tracker --db postgres --bg async --assets none
```

- [ ] **Step 2: Run the setup script.** Loco's `new` creates a fresh directory, but we already have files. The recommended path: run `loco new` into a sibling temp directory, then copy the missing top-level files (Cargo workspace toml, `src/main.rs`, `config/`, `migration/Cargo.toml`, `tests/`, `assets/`) into the existing form sub-project, preserving our `Cargo.toml`, `src/scoring/`, and other Plan 1 artefacts.

```sh
chmod +x forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine-setup
forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine-setup
```

(This step is unusual — typical Loco projects start from `loco new`, not retrofit. Read the issue-tracker form's full-stack subdirectory to see what the finished shape looks like and copy the missing bits in.)

- [ ] **Step 3: Generate each entity model + migration**

```sh
cd forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine
cargo loco generate model reporter name:string email:string role:string
cargo loco generate model participant okr_objective_id:uuid role:string name:string email:string notes:string
cargo loco generate model okr_objective \
    reporter_id:uuid parent_objective_id:uuid? \
    status:string level:string cycle:string cycle_start_date:date cycle_end_date:date \
    team_or_org_name:string strategic_theme:string external_reference:string \
    obj_title:string obj_long_description:text \
    sa_parent_summary:text sa_business_value_statement:text \
    in_initiatives:text in_supporting_links:text \
    rk_known_risks:text rk_dependencies:text rk_blockers:text rk_mitigation_plans:text \
    fc_expected_end_state:text fc_residual_risk:text \
    score_by_progress_percent:decimal score_by_confidence_decile:int \
    score_by_stretch_tier:int score_by_alignment_grade:int \
    score_by_impact_tier:int score_by_smart_quality:int score_by_pace_deviation_percent:decimal
cargo loco generate model okr_key_result okr_objective_id:uuid position:int title:string kr_type:string unit:string start_value:decimal? current_value:decimal? target_value:decimal? milestones_json:json? binary_done:bool? owner_name:string due_date:date? progress_fraction:decimal?
cargo loco generate model okr_check_in okr_objective_id:uuid checked_in_at:timestamp narrative:text since_last_changes:text blockers:text asks:text confidence_decile_at_check_in:int?
cargo loco generate model okr_grade okr_objective_id:uuid score_by_progress_percent:decimal score_by_confidence_decile:int score_by_stretch_tier:int score_by_alignment_grade:int score_by_impact_tier:int score_by_smart_quality:int score_by_pace_deviation_percent:decimal computed_composite_rag:string final_composite_rag:string override_reason:string recommendation:string triage_notes:text signed_by:string signed_at:timestamp? graded_at:timestamp
cargo loco generate model okr_grade_rule okr_grade_id:uuid rule_id:string instrument:string grade:string category:string description:text
cargo loco generate model okr_grade_flag okr_grade_id:uuid flag_code:string priority:string description:text
```

Each `cargo loco generate model` creates:
- `migration/src/mYYYYMMDD_HHMMSS_<entity>.rs` — SeaORM up/down
- `src/models/_entities/<entity>.rs` — auto-generated
- `src/models/<entity>.rs` — extension trait stub
- entry in `migration/src/lib.rs`

- [ ] **Step 4: Hand-edit the generated migrations** so that:
  - `okr_objective.parent_objective_id` is a self-referential FK
  - All `CHECK` constraints from Plan 1's SQL are reproduced via SeaORM's `check` syntax
  - `okr_key_result.position` has the `UNIQUE (okr_objective_id, position)` constraint
  - `pgcrypto` extension and the `set_updated_at` trigger function are added in `m20260510_000001_extensions.rs` (you'll need a `raw_sql` migration since SeaORM doesn't generate triggers)

Cross-check each migration against the equivalent file in `forms/objectives-and-key-results-tracker/sql-migrations/`. The schemas must match column-for-column so the existing Plan 1 SQL migrations could (in principle) interoperate with this SeaORM schema.

- [ ] **Step 5: Run migrations against the development DB**

```sh
cargo loco db migrate
cargo loco db schema | head -50    # Sanity check
```

- [ ] **Step 6: Commit** all generated and edited files in one commit per logical group:

```sh
git add ...
git commit -m "OKR tracker: Loco app + 8 entity scaffolds + migrations"
```

---

## Task 3: Base template (HTMX + Alpine + hx-boost)

**Files:**
- Create: `templates/base.html.tera`

`bin/test-form` requires this template to include HTMX 2.0.8 and Alpine.js 3.14.8 from the specific CDN URLs, plus `<body hx-boost="true">`. Match the issue-tracker form's base template byte-for-byte except for the page title.

- [ ] **Step 1: Write `templates/base.html.tera`**

```jinja
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>{% block title %}OKR Tracker{% endblock %}</title>
  <link rel="stylesheet" href="/static/style.css" />
  <script defer src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
</head>
<body hx-boost="true">
  <header><h1><a href="/">OKR Tracker</a></h1></header>
  <main>
    {% block content %}{% endblock %}
  </main>
</body>
</html>
```

- [ ] **Step 2: Add a basic `/static/style.css` with RAG-band colours** (mirror the HTML form's tokens).

- [ ] **Step 3: Commit**

```sh
git add forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/{templates/base.html.tera,assets/static/style.css}
git commit -m "OKR tracker: Rust full-stack base template (HTMX + Alpine)"
```

---

## Task 4: Wizard route and Step01–Step10 partials

**Files:**
- Create: `src/controllers/objectives.rs`
- Create: `templates/objectives/wizard.html.tera` plus `_stepNN.html.tera` partials

- [ ] **Step 1: Controller scaffold** — `get_new`, `post_create`, `get_edit`, `patch_update`:

```rust
use crate::models::_entities::okr_objective::{self, Entity as OkrObjective, ActiveModel};
use loco_rs::prelude::*;
use sea_orm::{ActiveModelTrait, Set};
use serde::Deserialize;

pub async fn new(ViewEngine(v): ViewEngine<TeraView>) -> Result<Response> {
    format::render().view(&v, "objectives/wizard.html.tera", data!({ "obj": null }))
}

#[derive(Deserialize)]
pub struct CreateObjective { /* mirror all wizard fields */ }

pub async fn create(State(ctx): State<AppContext>, Form(p): Form<CreateObjective>) -> Result<Response> {
    let am = ActiveModel {
        // fill all Set(...) calls from p
        ..Default::default()
    };
    let row = am.insert(&ctx.db).await?;
    format::redirect(&format!("/objectives/{}", row.id))
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("/objectives")
        .add("/new", get(new))
        .add("/", post(create))
        .add("/:id", get(edit))
        .add("/:id", patch(update))
}
```

- [ ] **Step 2: Wizard template** — single page that includes all ten step partials in order via `{% include "objectives/_step01.html.tera" %}` … `_step10`.

- [ ] **Step 3: Write each step partial.** Each is an HTML fragment with form inputs named after columns. HTMX wires inputs to autosave: each input has `hx-patch="/objectives/{{obj.id}}"` `hx-trigger="change delay:300ms"` `hx-include="this"` `hx-swap="none"`.

- [ ] **Step 4: Step 5 (Key Results) partial** uses HTMX for add/remove:

```jinja
{# _step05.html.tera #}
<section class="step" data-step="5">
  <h2>5. Key Results (1–5)</h2>
  <div id="kr-list">
    {% for kr in obj.key_results %}
      {% include "objectives/_kr_fieldset.html.tera" %}
    {% endfor %}
  </div>
  <button hx-post="/objectives/{{obj.id}}/key-results" hx-target="#kr-list" hx-swap="beforeend" {% if obj.key_results|length >= 5 %}disabled{% endif %}>Add Key Result</button>
</section>
```

`_kr_fieldset.html.tera` is a single KR's inputs with a remove button (`hx-delete="/objectives/{{obj.id}}/key-results/{{kr.position}}" hx-target="closest fieldset" hx-swap="outerHTML swap:200ms"`).

- [ ] **Step 5: Commit** in logical groups (controller, wizard skeleton, each partial group).

---

## Task 5: HTMX partials for KR add/remove and check-ins

**Files:**
- Create: `src/controllers/key_results.rs`, `src/controllers/check_ins.rs`

- [ ] **Step 1: KR controller** — POST returns one new `_kr_fieldset.html.tera`; DELETE returns empty body (HTMX removes the closest fieldset via `hx-swap=outerHTML`).

- [ ] **Step 2: Check-in controller** — POST creates a row in `okr_check_in` and returns a confirmation snippet.

- [ ] **Step 3: Register these in `app.rs` route map.**

- [ ] **Step 4: Commit**

```sh
git commit -m "OKR tracker: Rust full-stack HTMX KR + check-in endpoints"
```

---

## Task 6: Scoring endpoint — `POST /objectives/:id/score`

This is the most important endpoint: it bridges the persistence layer with the existing Plan 1 scoring engine.

**Files:**
- Modify: `src/controllers/objectives.rs`

- [ ] **Step 1: Write the handler.**

```rust
use crate::scoring::{composite::grade_objective, types::{ObjectiveAssessment, ObjectiveContext, RawScores, KeyResult as ScoringKR, FlagCode}};

pub async fn score(State(ctx): State<AppContext>, Path(id): Path<Uuid>, ViewEngine(v): ViewEngine<TeraView>) -> Result<Response> {
    let obj = OkrObjective::find_by_id(id).one(&ctx.db).await?.ok_or(Error::NotFound)?;
    let krs = okr_key_result::Entity::find().filter(okr_key_result::Column::OkrObjectiveId.eq(id)).all(&ctx.db).await?;
    let latest_check_in = okr_check_in::Entity::find().filter(okr_check_in::Column::OkrObjectiveId.eq(id))
        .order_by_desc(okr_check_in::Column::CheckedInAt).one(&ctx.db).await?;

    let assessment = ObjectiveAssessment {
        scores: RawScores {
            progress_percent: obj.score_by_progress_percent.map(|d| d.to_f64().unwrap_or(0.0)),
            confidence_decile: obj.score_by_confidence_decile,
            stretch_tier: obj.score_by_stretch_tier,
            alignment_grade: obj.score_by_alignment_grade,
            impact_tier: obj.score_by_impact_tier,
            smart_quality: obj.score_by_smart_quality,
            pace_deviation_percent: obj.score_by_pace_deviation_percent.map(|d| d.to_f64().unwrap_or(0.0)),
        },
        key_results: krs.iter().map(|k| ScoringKR { /* map columns */ }).collect(),
        context: ObjectiveContext {
            level: obj.level.clone(),
            parent_objective_id: obj.parent_objective_id.map(|u| u.to_string()),
            parent_objective_status: /* look up parent status if any */ None,
            dri_present: /* query participants */ true,
            cycle_start_date: obj.cycle_start_date.map(|d| d.to_string()),
            cycle_end_date: obj.cycle_end_date.map(|d| d.to_string()),
            checked_in_at: latest_check_in.as_ref().map(|c| c.checked_in_at.to_rfc3339()),
            previous_confidence_decile: /* lookup */ None,
        },
        now: chrono::Utc::now().to_rfc3339(),
    };

    let result = grade_objective(&assessment);

    // Persist to okr_grade + okr_grade_rule + okr_grade_flag
    let grade_am = okr_grade::ActiveModel {
        okr_objective_id: Set(id),
        computed_composite_rag: Set(result.computed_composite_rag.as_str().into()),
        final_composite_rag: Set(result.computed_composite_rag.as_str().into()),
        graded_at: Set(chrono::Utc::now().naive_utc()),
        // echo all seven scores
        ..Default::default()
    };
    let grade_row = grade_am.insert(&ctx.db).await?;

    for rule in &result.rules_fired {
        okr_grade_rule::ActiveModel {
            okr_grade_id: Set(grade_row.id),
            rule_id: Set(rule.rule_id.clone()),
            instrument: Set(format!("{:?}", rule.instrument).to_lowercase()),
            grade: Set(rule.grade.clone()),
            category: Set(rule.category.clone()),
            description: Set(rule.description.clone()),
            ..Default::default()
        }.insert(&ctx.db).await?;
    }
    for flag in &result.flags {
        let code: String = serde_json::to_value(&flag.flag_code).unwrap().as_str().unwrap().into();
        let priority: String = serde_json::to_value(&flag.priority).unwrap().as_str().unwrap().into();
        okr_grade_flag::ActiveModel {
            okr_grade_id: Set(grade_row.id),
            flag_code: Set(code),
            priority: Set(priority),
            description: Set(flag.description.clone()),
            ..Default::default()
        }.insert(&ctx.db).await?;
    }

    format::render().view(&v, "objectives/_score_result.html.tera", data!({ "result": result, "obj": obj }))
}
```

- [ ] **Step 2: Wire route** `add("/:id/score", post(score))`.

- [ ] **Step 3: Write `_score_result.html.tera`** — renders the RAG badge, the rules-fired list, the flags list.

- [ ] **Step 4: Add `data-test` attributes** so the Playwright test can assert specific RAG band and flag codes.

- [ ] **Step 5: Commit**

```sh
git commit -m "OKR tracker: Rust full-stack score endpoint + persistence"
```

---

## Task 7: Dashboard route

**Files:**
- Modify: `src/controllers/home.rs`
- Create: `templates/dashboard/index.html.tera`, `_row.html.tera`, `_detail.html.tera`

- [ ] **Step 1: Controller** — query `okr_objective` joined with the latest `okr_grade` per objective, applying filters from query string (`?level=team&rag=red&owner=alice`).

- [ ] **Step 2: Table template.** RAG badge cell, KR count, flag count, click-row uses HTMX `hx-get="/objectives/:id/detail" hx-target="#detail-panel"`.

- [ ] **Step 3: Detail partial** shows KRs (with progress bars), flags, latest check-in.

- [ ] **Step 4: Commit**

```sh
git commit -m "OKR tracker: Rust full-stack dashboard route"
```

---

## Task 8: Export endpoints

**Files:**
- Modify: `src/controllers/objectives.rs`

Five export endpoints, one per format:

- [ ] **Step 1: `/objectives/:id/export.txt`** — plain-text triage summary (same lines as Plan 2 Task 9).
- [ ] **Step 2: `/objectives/:id/export.json`** — full OKR + KRs + grade + flags as a single JSON document.
- [ ] **Step 3: `/objectives/:id/export.xml`** — render via Tera against the XML representations generated in Plan 1.
- [ ] **Step 4: `/objectives/:id/export.fhir.json`** — render a FHIR R5 `Goal` resource with `target[]` per KR, plus `Provenance` per check-in.
- [ ] **Step 5: `/objectives/:id/export.pdf`** — render the wizard's review template as HTML, convert to PDF via `printpdf` (or shell out to `chromium --headless --print-to-pdf` — pick one and document the choice).
- [ ] **Step 6: Commit each export endpoint separately.**

---

## Task 9: Loco integration tests

**Files:**
- Create: `tests/requests/objectives.rs`

- [ ] **Step 1: Per-handler test** using `loco_rs::testing::request`:

```rust
#[tokio::test]
#[serial_test::serial]
async fn create_and_score_fixture_01() {
    request::<App, _, _>(|request, ctx| async move {
        // POST /objectives with fixture-01 payload
        // GET /objectives/:id
        // POST /objectives/:id/score
        // Assert response contains "GREEN"
        // Assert okr_grade table has one row with computed_composite_rag='green'
    }).await;
}
```

- [ ] **Step 2: Write tests for fixtures 01, 03, 04, 12** (one each from green/red/red/red bands).

- [ ] **Step 3: Run `cargo test`. All pass.**

- [ ] **Step 4: Commit**

```sh
git commit -m "OKR tracker: Rust full-stack integration tests"
```

---

## Task 10: Playwright end-to-end happy path

**Files:**
- Create: `tests/playwright/{package.json,playwright.config.ts,e2e.spec.ts}`

- [ ] **Step 1: Playwright config** — `webServer` runs `cargo loco start`, `baseURL: http://localhost:5150`.

- [ ] **Step 2: Happy-path test** — visit `/objectives/new`, fill fixture 01 fields, click Compute, assert GREEN appears, navigate to `/`, assert the new objective appears in the dashboard with the GREEN RAG chip.

- [ ] **Step 3: Run** `pnpm install && pnpm exec playwright install --with-deps chromium && pnpm test:e2e`. Passes.

- [ ] **Step 4: Commit**

```sh
git commit -m "OKR tracker: Rust full-stack Playwright happy path"
```

---

## Task 11: Form-level docs + repo-level test

- [ ] **Step 1: Fill in** `forms/objectives-and-key-results-tracker/full-stack-with-loco-tera-htmx-alpine/{index.md,AGENTS.md,plan.md,tasks.md}`. Reference Plan 1's scoring engine, this plan, the parent design spec.

- [ ] **Step 2: Run `bin/test-form objectives-and-key-results-tracker` and expect it to PASS now** that the full-stack scaffold + base template exist.

- [ ] **Step 3: Commit**

```sh
git commit -m "OKR tracker: Rust full-stack sub-project docs"
```

---

## Task 12: Final acceptance gate

- [ ] **Step 1:** `cargo build` succeeds.
- [ ] **Step 2:** `cargo loco db migrate` succeeds.
- [ ] **Step 3:** `cargo test` — all unit + integration tests pass.
- [ ] **Step 4:** `cargo loco start` — server listens on 5150.
- [ ] **Step 5:** `pnpm test:e2e` (Playwright) — happy path passes.
- [ ] **Step 6:** `bin/test-form objectives-and-key-results-tracker` — passes.
- [ ] **Step 7:** Tag

```sh
git tag okr-tracker-plan-6-full-stack
```

Plan 6 done. The form is complete: all six sub-projects ship, the wizard persists OKRs, the dashboard lists them, scoring is consistent across HTML / Svelte / Rust, and the repo-wide `bin/test-form` gate passes.
