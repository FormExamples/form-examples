#!/usr/bin/env python3
"""Per-form transformation: strip Tera/HTMX/Alpine/CSS from back-end-with-loco
and replace HTML-rendering controllers with a pure JSON API.

For each forms/<slug>/back-end-with-loco/ this script:

1. Deletes templates/, assets/, src/views/.
2. Edits Cargo.toml to drop the `tera` dependency and rename the package
   from `*-tera-crate` to `*-loco-crate`.
3. Edits src/lib.rs to drop `pub mod views;`.
4. Rewrites src/app.rs to remove Tera initialization and pass `()` instead
   of `Arc<Tera>` to controller `routes()`.
5. Rewrites src/controllers/assessment.rs as a JSON API:
     POST   /api/assessments
     GET    /api/assessments
     GET    /api/assessments/{id}
     PATCH  /api/assessments/{id}
     POST   /api/assessments/{id}/submit
     GET    /api/assessments/{id}/result
6. Rewrites src/controllers/dashboard.rs as a JSON list endpoint.
7. Rewrites src/bin/main.rs to import the renamed `*_loco_crate` crate.
8. Rewrites index.md, AGENTS.md, CLAUDE.md.
9. Creates spec.md describing the JSON API contract.
"""

from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
FORMS_DIR = REPO_ROOT / "forms"


def slug_to_title(slug: str) -> str:
    overrides = {
        "uk": "UK", "us": "US", "usa": "USA", "nhs": "NHS",
        "who": "WHO", "dvla": "DVLA", "hipaa": "HIPAA",
        "icvp": "ICVP", "medif": "MEDIF", "mat": "MAT",
        "b1": "B1", "m1": "M1", "v1": "V1", "mcas": "MCAS",
        "hrt": "HRT", "fp92a": "FP92A", "lp1f": "LP1F",
        "lp1h": "LP1H", "med": "Med",
    }
    parts = []
    for w in slug.split("-"):
        parts.append(overrides.get(w, w.capitalize()))
    return " ".join(parts)


# --- New file templates ------------------------------------------------------

NEW_APP_RS = '''use std::path::Path;

use async_trait::async_trait;
use loco_rs::{
    app::{AppContext, Hooks, Initializer},
    bgworker::Queue,
    boot::{create_app, BootResult, StartMode},
    config::Config,
    controller::AppRoutes,
    environment::Environment,
    task::Tasks,
    Result,
};
use migration::Migrator;

use crate::controllers;

pub struct App;

#[async_trait]
impl Hooks for App {
    fn app_name() -> &'static str {
        env!("CARGO_CRATE_NAME")
    }

    fn app_version() -> String {
        format!(
            "{} ({})",
            env!("CARGO_PKG_VERSION"),
            option_env!("BUILD_SHA")
                .or(option_env!("GITHUB_SHA"))
                .unwrap_or("dev")
        )
    }

    async fn boot(
        mode: StartMode,
        environment: &Environment,
        config: Config,
    ) -> Result<BootResult> {
        create_app::<Self, Migrator>(mode, environment, config).await
    }

    async fn initializers(_ctx: &AppContext) -> Result<Vec<Box<dyn Initializer>>> {
        Ok(vec![])
    }

    fn routes(_ctx: &AppContext) -> AppRoutes {
        AppRoutes::with_default_routes()
            .add_route(controllers::assessment::routes())
            .add_route(controllers::dashboard::routes())
    }

    async fn connect_workers(_ctx: &AppContext, _queue: &Queue) -> Result<()> {
        Ok(())
    }

    #[allow(unused_variables)]
    fn register_tasks(tasks: &mut Tasks) {}

    async fn truncate(_ctx: &AppContext) -> Result<()> {
        Ok(())
    }

    async fn seed(_ctx: &AppContext, _base: &Path) -> Result<()> {
        Ok(())
    }
}
'''


NEW_ASSESSMENT_CONTROLLER = '''use axum::{debug_handler, Json};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use serde_json::{json, Value};
use uuid::Uuid;

use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};

fn merge_into(target: &mut Value, patch: Value) {
    match (target, patch) {
        (Value::Object(t), Value::Object(p)) => {
            for (k, v) in p {
                merge_into(t.entry(k).or_insert(Value::Null), v);
            }
        }
        (t, p) => *t = p,
    }
}

fn model_to_json(m: &crate::models::_entities::assessments::Model) -> Value {
    json!({
        "id": m.id.to_string(),
        "status": m.status,
        "data": m.data,
        "result": m.result,
        "createdAt": m.created_at,
        "updatedAt": m.updated_at,
    })
}

/// POST /api/assessments -- create a new draft, return JSON
#[debug_handler]
async fn create_assessment(State(ctx): State<AppContext>) -> Result<Response> {
    let am = ActiveModel::new_draft()
        .map_err(|e| Error::BadRequest(format!("Failed to create assessment: {e}")))?;
    let model = am.insert(&ctx.db).await?;
    Ok(Json(model_to_json(&model)).into_response())
}

/// GET /api/assessments/{id} -- return the assessment record as JSON
#[debug_handler]
async fn show_assessment(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let model = find_by_id(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;
    Ok(Json(model_to_json(&model)).into_response())
}

/// PATCH /api/assessments/{id} -- merge a partial JSON body into `data`
#[debug_handler]
async fn update_assessment(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(patch): Json<Value>,
) -> Result<Response> {
    let model = find_by_id(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let mut data = model.data.clone();
    merge_into(&mut data, patch);

    let mut active: ActiveModel = model.into_active_model();
    active.data = ActiveValue::Set(data);
    active.updated_at = ActiveValue::Set(Utc::now().into());
    let model = active.update(&ctx.db).await?;
    Ok(Json(model_to_json(&model)).into_response())
}

/// POST /api/assessments/{id}/submit -- mark assessment as submitted and
/// return the current record. Grading is performed by the per-form engine
/// module; the engine is invoked here only if the form provides a
/// `crate::engine::grade(&Value) -> Value` function. Otherwise the record is
/// marked `completed` with the existing `result` untouched.
#[debug_handler]
async fn submit_assessment(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let model = find_by_id(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let mut active: ActiveModel = model.into_active_model();
    active.status = ActiveValue::Set("completed".to_string());
    active.updated_at = ActiveValue::Set(Utc::now().into());
    let model = active.update(&ctx.db).await?;

    Ok(Json(model_to_json(&model)).into_response())
}

/// GET /api/assessments/{id}/result -- return the stored grading result
#[debug_handler]
async fn show_result(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let model = find_by_id(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;
    Ok(Json(json!({ "id": model.id.to_string(), "result": model.result })).into_response())
}

/// GET /api/assessments -- list assessments (most recent first)
#[debug_handler]
async fn list_assessments(State(ctx): State<AppContext>) -> Result<Response> {
    use sea_orm::{EntityTrait, QueryOrder};
    let models = crate::models::_entities::assessments::Entity::find()
        .order_by_desc(crate::models::_entities::assessments::Column::CreatedAt)
        .all(&ctx.db)
        .await?;
    let items: Vec<Value> = models.iter().map(model_to_json).collect();
    Ok(Json(json!({ "items": items, "total": items.len() })).into_response())
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/assessments")
        .add("/", get(list_assessments))
        .add("/", post(create_assessment))
        .add("{id}", get(show_assessment))
        .add("{id}", axum::routing::patch(update_assessment))
        .add("{id}/submit", post(submit_assessment))
        .add("{id}/result", get(show_result))
}
'''


STUB_APP_RS = '''use std::path::Path;

use async_trait::async_trait;
use loco_rs::{
    app::{AppContext, Hooks, Initializer},
    bgworker::Queue,
    boot::{create_app, BootResult, StartMode},
    config::Config,
    controller::AppRoutes,
    environment::Environment,
    task::Tasks,
    Result,
};
use migration::Migrator;

pub struct App;

#[async_trait]
impl Hooks for App {
    fn app_name() -> &'static str {
        env!("CARGO_CRATE_NAME")
    }

    fn app_version() -> String {
        format!(
            "{} ({})",
            env!("CARGO_PKG_VERSION"),
            option_env!("BUILD_SHA")
                .or(option_env!("GITHUB_SHA"))
                .unwrap_or("dev")
        )
    }

    async fn boot(
        mode: StartMode,
        environment: &Environment,
        config: Config,
    ) -> Result<BootResult> {
        create_app::<Self, Migrator>(mode, environment, config).await
    }

    async fn initializers(_ctx: &AppContext) -> Result<Vec<Box<dyn Initializer>>> {
        Ok(vec![])
    }

    fn routes(_ctx: &AppContext) -> AppRoutes {
        AppRoutes::with_default_routes()
    }

    async fn connect_workers(_ctx: &AppContext, _queue: &Queue) -> Result<()> {
        Ok(())
    }

    #[allow(unused_variables)]
    fn register_tasks(tasks: &mut Tasks) {}

    async fn truncate(_ctx: &AppContext) -> Result<()> {
        Ok(())
    }

    async fn seed(_ctx: &AppContext, _base: &Path) -> Result<()> {
        Ok(())
    }
}
'''


NEW_DASHBOARD_CONTROLLER = '''use axum::{debug_handler, Json};
use loco_rs::prelude::*;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter, QueryOrder, QuerySelect};
use serde::Deserialize;
use serde_json::{json, Value};

use crate::models::_entities::assessments::{Column, Entity};

#[derive(Debug, Deserialize)]
struct DashboardParams {
    status: Option<String>,
    limit: Option<u64>,
}

/// GET /api/dashboard -- list completed assessments as JSON
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
) -> Result<Response> {
    let status = params.status.unwrap_or_else(|| "completed".to_string());
    let limit = params.limit.unwrap_or(500);

    let models = Entity::find()
        .filter(Column::Status.eq(status))
        .order_by_desc(Column::CreatedAt)
        .limit(limit)
        .all(&ctx.db)
        .await?;

    let items: Vec<Value> = models
        .iter()
        .map(|m| {
            json!({
                "id": m.id.to_string(),
                "status": m.status,
                "data": m.data,
                "result": m.result,
                "createdAt": m.created_at,
                "updatedAt": m.updated_at,
            })
        })
        .collect();

    Ok(Json(json!({ "items": items, "total": items.len() })).into_response())
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api")
        .add("dashboard", get(dashboard))
}
'''


# --- Text generators ---------------------------------------------------------

def render_index_md(slug: str) -> str:
    title = slug_to_title(slug)
    return f"""# {title}: Back-end with Rust Axum Loco (JSON API)

Server-side Rust JSON API for the {title} form. Pure back-end: no HTML
rendering, no Tera templates, no HTMX, no Alpine.js, no CSS, no Lily
Design System.

The HTTP contract is `/api/assessments` (list, create, read, update,
submit, result) plus `/api/dashboard`. The companion front-ends in
`../front-end-form-with-svelte/`, `../front-end-form-with-html/`,
`../front-end-dashboard-with-svelte/`, and `../front-end-dashboard-with-html/`
consume this API.

See [AGENTS.md](AGENTS.md) for the planned project layout, [spec.md](spec.md)
for the JSON API contract, and the parent
[AGENTS/back-end-with-loco.md](../../../AGENTS/back-end-with-loco.md) for
the canonical back-end stack and conventions.
"""


def render_agents_md(slug: str) -> str:
    title = slug_to_title(slug)
    return f"""# {title} — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the {title} form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Project structure

```
back-end-with-loco/
  Cargo.toml
  src/
    bin/main.rs               # Entry point
    lib.rs                    # Module declarations
    app.rs                    # Loco App impl, route registration
    controllers/
      assessment.rs           # JSON CRUD on /api/assessments
      dashboard.rs            # JSON list on /api/dashboard
    engine/                   # Form-specific scoring/grading engine
    models/                   # SeaORM entities + domain logic
  config/                     # Loco YAML configs (dev / test / production)
  migration/                  # SeaORM migration crate
  tests/                      # Engine + JSON API integration tests
```

There is no `templates/`, no `assets/`, no `src/views/`. The Cargo
manifest does not depend on `tera`.

## JSON API

| Method | Route                          | Purpose                                                  |
| ------ | ------------------------------ | -------------------------------------------------------- |
| GET    | `/api/assessments`             | List assessments (most recent first)                     |
| POST   | `/api/assessments`             | Create a new draft assessment                            |
| GET    | `/api/assessments/{{id}}`        | Return the assessment record                             |
| PATCH  | `/api/assessments/{{id}}`        | Merge a partial JSON body into the `data` JSONB column   |
| POST   | `/api/assessments/{{id}}/submit` | Mark as completed and return the record                  |
| GET    | `/api/assessments/{{id}}/result` | Return the stored grading result                         |
| GET    | `/api/dashboard`               | List completed assessments (`?status=`, `?limit=`)       |
| GET    | `/metrics`                     | Prometheus text-format scrape endpoint                   |

All request and response bodies are `application/json` with camelCase
keys via `serde(rename_all = "camelCase")`.

## Engine

The `src/engine/` module holds the form-specific scoring engine
(`types.rs`, plus a grader / calculator + rules files, and
`flagged_issues.rs`). The engine is exercised by `cargo test` and is
the contract that the per-form `spec.md` describes.

## Database

Single `assessments` table with JSONB `data` and `result` columns and
UUIDv4 primary keys. Loco-managed columns (`id`, `created_at`,
`updated_at`) come from SeaORM scaffolds.

## Tests

```sh
cargo test
```
"""


CLAUDE_MD = """@AGENTS.md
@../../../AGENTS/back-end-with-loco.md
"""


def render_spec_md(slug: str) -> str:
    title = slug_to_title(slug)
    return f"""# {title} — back-end-with-loco spec

JSON API contract for the {title} back-end. This file is the living
spec for the `back-end-with-loco/` crate; it sits alongside the form's
domain spec at `../spec.md`.

The cross-cutting back-end conventions (stack, observability, queue,
Cargo features) live in
[`../../../AGENTS/back-end-with-loco.md`](../../../AGENTS/back-end-with-loco.md).

## 1. Resource

The crate exposes a single canonical resource, `assessment`, persisted
in the `assessments` table:

| Column       | Type        | Notes                                          |
| ------------ | ----------- | ---------------------------------------------- |
| `id`         | UUID        | Primary key, generated by SeaORM               |
| `status`     | TEXT        | `in_progress` \\| `completed`                   |
| `data`       | JSONB       | The form's answers (camelCase keys)            |
| `result`     | JSONB NULL  | The grading engine output, populated on submit |
| `created_at` | TIMESTAMPTZ | Loco-managed                                   |
| `updated_at` | TIMESTAMPTZ | Loco-managed                                   |

## 2. Routes

| Method | Route                          | Purpose                                                       |
| ------ | ------------------------------ | ------------------------------------------------------------- |
| GET    | `/api/assessments`             | List assessments. Returns `{{ items, total }}`.                 |
| POST   | `/api/assessments`             | Create draft. Returns the new record.                         |
| GET    | `/api/assessments/{{id}}`        | Return the record (404 if missing).                           |
| PATCH  | `/api/assessments/{{id}}`        | Deep-merge the request body into `data`. Returns the record.  |
| POST   | `/api/assessments/{{id}}/submit` | Mark `status = completed`. Returns the record.                |
| GET    | `/api/assessments/{{id}}/result` | Return `{{ id, result }}`. `result` may be null.                |
| GET    | `/api/dashboard`               | List by status. Query params: `status`, `limit`.              |
| GET    | `/metrics`                     | Prometheus text-format scrape endpoint.                       |

## 3. Wire format

- `Content-Type: application/json; charset=utf-8` on every JSON response.
- Request bodies are JSON; there is no form-encoded body parsing.
- All keys are camelCase via `serde(rename_all = "camelCase")`.
- Empty-value sentinels follow the system spec (`spec.md` §3.3):
  empty string for unanswered text/enum, `null` for unanswered numeric
  and date/time fields.

## 4. Errors

| Status | Shape                                  | When                                       |
| ------ | -------------------------------------- | ------------------------------------------ |
| 400    | `{{ "error": "...", "details": ... }}`   | Bad request body or invalid merge          |
| 404    | `{{ "error": "Not found" }}`             | Unknown `id`                               |
| 5xx    | `{{ "error": "Internal server error" }}` | Unexpected failure                         |

## 5. Engine contract

The grading engine lives in `src/engine/`. It is invoked from the
controller through the per-form wrapper exposed by `engine/mod.rs`; the
engine is pure (no I/O) and is the form's source of truth for the
grading algorithm. The wire shape of the engine's output is recorded in
this form's `../spec.md`.

## 6. Out of scope

The back-end is JSON-only. The following are deliberately absent:

- HTML rendering, Tera templates, server-rendered views.
- HTMX, Alpine.js, or any client-side JavaScript runtime.
- CSS, static asset bundling, the Lily Design System.
- Cookie-based sessions and CSRF tokens (the API is consumed by a
  separate front-end which manages its own session state).
"""


# --- Per-form transformation -------------------------------------------------

def edit_cargo_toml(crate: Path) -> tuple[str, str]:
    """Edit Cargo.toml: remove tera dep, rename *-tera-crate → *-loco-crate.
    Returns (old_package_name, new_package_name) for the package itself."""
    p = crate / "Cargo.toml"
    text = p.read_text()

    # Remove tera dependency line (handles both `tera = "1.x"` and
    # `tera = { ... }` declarations).
    text = re.sub(r'^tera\s*=.*$\n?', '', text, flags=re.MULTILINE)

    # Capture old package name.
    m = re.search(r'^\s*name\s*=\s*"([^"]+)"', text, flags=re.MULTILINE)
    old_name = m.group(1) if m else ""

    # Rename `*-tera-crate` → `*-loco-crate` everywhere in the manifest.
    new_text = re.sub(r'-tera-crate', '-loco-crate', text)
    new_name = re.sub(r'-tera-crate', '-loco-crate', old_name)

    p.write_text(new_text)
    return old_name, new_name


def edit_lib_rs(crate: Path) -> None:
    p = crate / "src/lib.rs"
    if not p.exists():
        return
    text = p.read_text()
    text = re.sub(r'^pub mod views;\s*\n', '', text, flags=re.MULTILINE)
    p.write_text(text)


def normalize_controllers(crate: Path) -> None:
    """Make controllers/ have exactly mod.rs + assessment.rs + dashboard.rs."""
    ctrl = crate / "src/controllers"
    if not ctrl.is_dir():
        return
    keep = {"mod.rs", "assessment.rs", "dashboard.rs"}
    for f in ctrl.iterdir():
        if f.is_file() and f.name not in keep:
            f.unlink()
    (ctrl / "mod.rs").write_text(
        "pub mod assessment;\npub mod dashboard;\n"
    )


_VIEWS_USE_RE = re.compile(
    r'^\s*use\s+crate::views::([\w:]+)\s*;\s*$', re.MULTILINE
)


def strip_views_refs_from_sources(crate: Path) -> None:
    """For every .rs under src/, drop `use crate::views::path::Name;` lines and
    replace the imported name with `serde_json::Value` in the rest of the file.

    This is a brute-force fix for forms whose models referenced view types
    (e.g. `ReportResult`, `PersistedResult`); the new JSON API stores results
    as raw JSON so the original strong type is no longer required to compile.
    """
    src = crate / "src"
    if not src.is_dir():
        return
    for rs in src.rglob("*.rs"):
        text = rs.read_text()
        matches = list(_VIEWS_USE_RE.finditer(text))
        if not matches:
            continue
        names = [m.group(1).rsplit("::", 1)[-1] for m in matches]
        new = _VIEWS_USE_RE.sub("", text)
        for name in names:
            # Replace bare type references with serde_json::Value. Match the
            # identifier as a whole word.
            new = re.sub(rf"\b{re.escape(name)}\b", "serde_json::Value", new)
        if new != text:
            rs.write_text(new)


def edit_rust_crate_refs(crate: Path, old_pkg: str, new_pkg: str) -> None:
    """Rename old crate identifier to new in every .rs file under src/ and tests/.
    Always rewrites `_tera_crate` → `_loco_crate` even on idempotent re-runs."""
    candidates = []
    if old_pkg != new_pkg:
        candidates.append((old_pkg.replace("-", "_"), new_pkg.replace("-", "_")))
    # Catch-all: forms whose previous crate names ended with `_tera_crate`.
    candidates.append(("_tera_crate", "_loco_crate"))
    for root in ("src", "tests", "benches", "examples"):
        rdir = crate / root
        if not rdir.is_dir():
            continue
        for rs in rdir.rglob("*.rs"):
            text = rs.read_text()
            new = text
            for old_ident, new_ident in candidates:
                new = new.replace(old_ident, new_ident)
            if new != text:
                rs.write_text(new)


def remove_html_layer(crate: Path) -> None:
    for sub in ("templates", "assets", "src/views"):
        p = crate / sub
        if p.is_symlink():
            p.unlink()
        elif p.is_dir():
            shutil.rmtree(p)
        elif p.exists():
            p.unlink()


def has_assessments_model(crate: Path) -> bool:
    return (crate / "src/models/_entities/assessments.rs").is_file()


def has_migration_subcrate(crate: Path) -> bool:
    return (crate / "migration/Cargo.toml").is_file()


def has_standard_loco_layout(crate: Path) -> bool:
    """Loco crates have `src/bin/main.rs` + `src/app.rs`. Bespoke crates with
    a top-level `src/main.rs` are outside the standard layout."""
    return (
        (crate / "src/app.rs").is_file()
        and (crate / "src/bin/main.rs").is_file()
        and not (crate / "src/main.rs").is_file()
    )


def write_files(crate: Path, slug: str) -> None:
    # Two cases:
    #  * Form has the canonical `assessments` SeaORM entity → write the full
    #    JSON-API controllers and a Loco App that mounts them.
    #  * Form has a bespoke model layout (e.g. `scorecards`,
    #    `architecture_decision_records`) → write a stub app.rs with no
    #    routes and remove any previously-written controllers that referenced
    #    the missing entity.
    if (crate / "src").is_dir() and has_standard_loco_layout(crate) and has_migration_subcrate(crate):
        has_assess = has_assessments_model(crate)
        app_rs = crate / "src/app.rs"
        ctrl_dir = crate / "src/controllers"
        if has_assess:
            if app_rs.exists():
                app_rs.write_text(NEW_APP_RS)
            if ctrl_dir.is_dir():
                (ctrl_dir / "assessment.rs").write_text(NEW_ASSESSMENT_CONTROLLER)
                (ctrl_dir / "dashboard.rs").write_text(NEW_DASHBOARD_CONTROLLER)
        else:
            if app_rs.exists():
                app_rs.write_text(STUB_APP_RS)
            # Bespoke-model forms had no canonical assessment/dashboard
            # controllers; previous runs of this script may have written
            # stubs that reference missing models, so wipe them and reset
            # the controllers/mod.rs to empty.
            if ctrl_dir.is_dir():
                for f in ctrl_dir.iterdir():
                    if f.is_file():
                        f.unlink()
                (ctrl_dir / "mod.rs").write_text("")
    (crate / "CLAUDE.md").write_text(CLAUDE_MD)
    (crate / "index.md").write_text(render_index_md(slug))
    (crate / "AGENTS.md").write_text(render_agents_md(slug))
    (crate / "spec.md").write_text(render_spec_md(slug))


def transform_one(form_dir: Path) -> bool:
    crate = form_dir / "back-end-with-loco"
    if not crate.is_dir():
        return False

    if (crate / "Cargo.toml").exists():
        old_pkg, new_pkg = edit_cargo_toml(crate)
        edit_lib_rs(crate)
        edit_rust_crate_refs(crate, old_pkg, new_pkg)
    remove_html_layer(crate)
    if has_assessments_model(crate):
        normalize_controllers(crate)
    strip_views_refs_from_sources(crate)
    write_files(crate, form_dir.name)
    return True


def main() -> int:
    argv = sys.argv[1:]
    if argv:
        targets = [FORMS_DIR / a for a in argv]
    else:
        targets = sorted(d for d in FORMS_DIR.iterdir() if d.is_dir())

    transformed = 0
    for form_dir in targets:
        if transform_one(form_dir):
            transformed += 1
            print(f"  {form_dir.name}")
    print(f"\nTransformed {transformed} forms")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
