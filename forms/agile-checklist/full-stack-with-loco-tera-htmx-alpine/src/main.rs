mod comparison;
mod dashboard;
mod db;
mod engine;
mod items;

use axum::{
    Form, Json, Router,
    extract::{Path as AxumPath, State},
    response::{Html, IntoResponse, Redirect},
    routing::{get, post},
};
use chrono::Utc;
use serde::Deserialize;
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use tera::{Context, Tera};
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::EnvFilter;
use uuid::Uuid;

#[derive(Clone)]
struct AppState {
    tera: Arc<Tera>,
    answers: Arc<Mutex<HashMap<String, String>>>,
    db: Arc<db::Db>,
}

#[derive(Debug, Deserialize)]
struct ToggleForm {
    id: String,
    value: String,
}

#[derive(Debug, Deserialize)]
struct SubmitForm {
    #[serde(default)]
    respondent: String,
    #[serde(default)]
    role: String,
    #[serde(default)]
    team: String,
    #[serde(default)]
    organisation: String,
    #[serde(default)]
    top_action_1: String,
    #[serde(default)]
    top_action_2: String,
    #[serde(default)]
    top_action_3: String,
    #[serde(default)]
    coach_notes: String,
    #[serde(default)]
    overall_notes: String,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .init();

    let mut tera = Tera::default();
    tera.add_raw_template("base.html.tera", include_str!("../templates/base.html.tera"))
        .expect("base template parses");
    tera.add_raw_template(
        "index.html.tera",
        include_str!("../templates/index.html.tera"),
    )
    .expect("index template parses");
    tera.add_raw_template(
        "_summary.html.tera",
        include_str!("../templates/_summary.html.tera"),
    )
    .expect("summary partial parses");
    tera.add_raw_template(
        "dashboard.html.tera",
        include_str!("../templates/dashboard.html.tera"),
    )
    .expect("dashboard template parses");
    tera.add_raw_template(
        "submission.html.tera",
        include_str!("../templates/submission.html.tera"),
    )
    .expect("submission template parses");
    tera.add_raw_template(
        "comparison.html.tera",
        include_str!("../templates/comparison.html.tera"),
    )
    .expect("comparison template parses");

    let db_path: PathBuf = std::env::var("DB_PATH")
        .unwrap_or_else(|_| ":memory:".into())
        .into();
    let db = db::Db::open(&db_path).expect("sqlite database opens");
    tracing::info!("sqlite at {}", db_path.display());

    let state = AppState {
        tera: Arc::new(tera),
        answers: Arc::new(Mutex::new(HashMap::new())),
        db: Arc::new(db),
    };

    let app = Router::new()
        .route("/", get(index))
        .route("/toggle", post(toggle))
        .route("/reset", post(reset))
        .route("/submit", post(submit))
        .route("/dashboard", get(dashboard_view))
        .route("/submission/{id}", get(submission_view))
        .route("/comparison", get(comparison_view).post(comparison_submit))
        .route("/api/checklists", get(api_checklists))
        .layer(CorsLayer::new().allow_origin(Any))
        .with_state(state);

    let addr = std::env::var("BIND").unwrap_or_else(|_| "127.0.0.1:5193".into());
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("bind succeeds");
    tracing::info!("listening on http://{addr}");
    axum::serve(listener, app).await.expect("server runs");
}

fn render(state: &AppState, ctx: Context, template: &str) -> Html<String> {
    let body = state
        .tera
        .render(template, &ctx)
        .unwrap_or_else(|e| format!("<pre>tera error: {e}</pre>"));
    Html(body)
}

fn build_context(answers: &HashMap<String, String>) -> Context {
    let result = engine::calculate_maturity(answers);
    let mut ctx = Context::new();
    ctx.insert("teams_items", items::TEAMS_ITEMS);
    ctx.insert("stakeholders_items", items::STAKEHOLDERS_ITEMS);
    ctx.insert("practices_items", items::PRACTICES_ITEMS);
    ctx.insert("all_items", &items::all_items());
    ctx.insert("answers", answers);
    ctx.insert("result", &result);
    ctx.insert("total_items", &items::all_items().len());
    ctx
}

async fn index(State(state): State<AppState>) -> impl IntoResponse {
    let answers = state.answers.lock().unwrap().clone();
    let ctx = build_context(&answers);
    render(&state, ctx, "index.html.tera")
}

async fn toggle(State(state): State<AppState>, Form(body): Form<ToggleForm>) -> impl IntoResponse {
    {
        let mut answers = state.answers.lock().unwrap();
        let previous = answers.get(&body.id).cloned().unwrap_or_default();
        if previous == body.value {
            answers.remove(&body.id);
        } else {
            answers.insert(body.id.clone(), body.value.clone());
        }
    }
    let answers = state.answers.lock().unwrap().clone();
    let ctx = build_context(&answers);
    render(&state, ctx, "_summary.html.tera")
}

async fn reset(State(state): State<AppState>) -> impl IntoResponse {
    state.answers.lock().unwrap().clear();
    let answers = state.answers.lock().unwrap().clone();
    let ctx = build_context(&answers);
    render(&state, ctx, "index.html.tera")
}

async fn submit(
    State(state): State<AppState>,
    Form(body): Form<SubmitForm>,
) -> impl IntoResponse {
    let answers = state.answers.lock().unwrap().clone();
    let result = engine::calculate_maturity(&answers);

    let id = format!("S{}", &Uuid::new_v4().to_string()[..8]);
    let date = Utc::now().format("%Y-%m-%d").to_string();
    let respondent = if body.respondent.trim().is_empty() {
        "Anonymous".to_string()
    } else {
        body.respondent.trim().to_string()
    };
    let is_anonymous = respondent == "Anonymous";
    let role = if is_anonymous { String::new() } else { body.role };
    let team = if body.team.trim().is_empty() {
        "Unnamed".to_string()
    } else {
        body.team.trim().to_string()
    };
    let organisation = if body.organisation.trim().is_empty() {
        "Self-hosted".to_string()
    } else {
        body.organisation.trim().to_string()
    };

    // Compute weak sections from bands.
    let mut weak: Vec<&'static str> = Vec::new();
    if result.teams.band_slug == "low" {
        weak.push("Teams");
    }
    if result.stakeholders.band_slug == "low" {
        weak.push("Stakeholders");
    }
    if result.practices.band_slug == "low" {
        weak.push("Practices");
    }

    let id_static: &'static str = Box::leak(id.into_boxed_str());
    let date_static: &'static str = Box::leak(date.into_boxed_str());
    let respondent_static: &'static str = Box::leak(respondent.into_boxed_str());
    let role_static: &'static str = Box::leak(role.into_boxed_str());
    let team_static: &'static str = Box::leak(team.into_boxed_str());
    let organisation_static: &'static str = Box::leak(organisation.into_boxed_str());
    let maturity_static: &'static str = result.maturity;

    let row = dashboard::ChecklistRow {
        id: id_static,
        date: date_static,
        respondent: respondent_static,
        role: role_static,
        team: team_static,
        organisation: organisation_static,
        answered: result.answered_count as u8,
        teams_percent: result.teams.percent.map(|p| p as u8),
        stakeholders_percent: result.stakeholders.percent.map(|p| p as u8),
        practices_percent: result.practices.percent.map(|p| p as u8),
        overall_percent: result.overall_percent.map(|p| p as u8),
        maturity: maturity_static,
        maturity_class: maturity_static,
        weak_sections: weak,
        flags: result.additional_flags.iter().map(|f| f.category).collect(),
        is_anonymous,
    };
    let plan = db::ActionPlan {
        top_action_1: body.top_action_1.trim().to_string(),
        top_action_2: body.top_action_2.trim().to_string(),
        top_action_3: body.top_action_3.trim().to_string(),
        coach_notes: body.coach_notes.trim().to_string(),
        overall_notes: body.overall_notes.trim().to_string(),
    };
    if let Err(e) = state.db.insert(&row, &answers, &plan) {
        tracing::error!("db insert failed: {e}");
    }
    state.answers.lock().unwrap().clear();
    Redirect::to("/dashboard")
}

fn persisted_to_row(p: &db::PersistedRow) -> dashboard::ChecklistRow {
    let weak: Vec<&'static str> = p
        .weak_sections
        .iter()
        .map(|s| -> &'static str { Box::leak(s.clone().into_boxed_str()) })
        .collect();
    let flags: Vec<&'static str> = p
        .flags
        .iter()
        .map(|s| -> &'static str { Box::leak(s.clone().into_boxed_str()) })
        .collect();
    dashboard::ChecklistRow {
        id: Box::leak(p.id.clone().into_boxed_str()),
        date: Box::leak(p.date.clone().into_boxed_str()),
        respondent: Box::leak(p.respondent.clone().into_boxed_str()),
        role: Box::leak(p.role.clone().into_boxed_str()),
        team: Box::leak(p.team.clone().into_boxed_str()),
        organisation: Box::leak(p.organisation.clone().into_boxed_str()),
        answered: p.answered,
        teams_percent: p.teams_percent,
        stakeholders_percent: p.stakeholders_percent,
        practices_percent: p.practices_percent,
        overall_percent: p.overall_percent,
        maturity: Box::leak(p.maturity.clone().into_boxed_str()),
        maturity_class: Box::leak(p.maturity.clone().into_boxed_str()),
        weak_sections: weak,
        flags,
        is_anonymous: p.is_anonymous,
    }
}

async fn submission_view(
    State(state): State<AppState>,
    AxumPath(id): AxumPath<String>,
) -> impl IntoResponse {
    let persisted = state.db.find(&id).unwrap_or(None);
    let answers = state.db.answers_for(&id).unwrap_or(None).unwrap_or_default();

    #[derive(serde::Serialize)]
    struct ItemAnswer {
        id: &'static str,
        section: &'static str,
        ordinal: u8,
        text: &'static str,
        answer: String,
    }

    let item_answers: Vec<ItemAnswer> = items::all_items()
        .iter()
        .map(|item| ItemAnswer {
            id: item.id,
            section: item.section.slug(),
            ordinal: item.ordinal,
            text: item.text,
            answer: answers.get(item.id).cloned().unwrap_or_default(),
        })
        .collect();

    let plan = state.db.action_plan_for(&id).unwrap_or(None);
    let has_plan = plan.as_ref().map(|p| !p.is_empty()).unwrap_or(false);

    let mut ctx = Context::new();
    ctx.insert("id", &id);
    ctx.insert("row", &persisted);
    ctx.insert("found", &persisted.is_some());
    ctx.insert("item_answers", &item_answers);
    ctx.insert("has_answers", &(!answers.is_empty()));
    ctx.insert("plan", &plan);
    ctx.insert("has_plan", &has_plan);
    render(&state, ctx, "submission.html.tera")
}

async fn api_checklists(State(state): State<AppState>) -> impl IntoResponse {
    let persisted = state.db.list().unwrap_or_default();
    let rows: Vec<dashboard::ChecklistRow> = persisted.iter().map(persisted_to_row).collect();
    Json(rows)
}

async fn dashboard_view(State(state): State<AppState>) -> impl IntoResponse {
    let persisted = state.db.list().unwrap_or_default();
    let source = if persisted.is_empty() { "sample" } else { "db" };
    let rows: Vec<dashboard::ChecklistRow> = if persisted.is_empty() {
        dashboard::sample_rows()
    } else {
        persisted.iter().map(persisted_to_row).collect()
    };
    let teams = dashboard::aggregate_by_team(&rows);
    let totals = dashboard::totals(&rows);
    let mut ctx = Context::new();
    ctx.insert("rows", &rows);
    ctx.insert("teams", &teams);
    ctx.insert("totals", &totals);
    ctx.insert("source", source);
    ctx.insert("submission_count", &persisted.len());
    render(&state, ctx, "dashboard.html.tera")
}

#[derive(Debug, Deserialize)]
struct ComparisonForm {
    #[serde(default)]
    principles_csv: String,
    #[serde(default)]
    behaviour_csv: String,
    #[serde(default)]
    behaviour_source: String, // "csv" (default) or "db"
}

fn db_rows_as_sister(state: &AppState) -> Vec<comparison::SisterRow> {
    state
        .db
        .list()
        .unwrap_or_default()
        .into_iter()
        .map(|r| comparison::SisterRow {
            team: r.team,
            organisation: r.organisation,
            date: r.date,
            maturity: r.maturity,
            score: r.overall_percent.map(|p| p as f64),
            score_display: match r.overall_percent {
                Some(p) => format!("{p}%"),
                None => "—".to_string(),
            },
        })
        .collect()
}

async fn comparison_view(State(state): State<AppState>) -> impl IntoResponse {
    let db_rows = state.db.list().unwrap_or_default().len();
    let mut ctx = Context::new();
    ctx.insert("rendered", &false);
    ctx.insert("principles_csv", "");
    ctx.insert("behaviour_csv", "");
    ctx.insert("behaviour_source", "csv");
    ctx.insert("db_row_count", &db_rows);
    ctx.insert("error", "");
    render(&state, ctx, "comparison.html.tera")
}

async fn comparison_submit(
    State(state): State<AppState>,
    Form(body): Form<ComparisonForm>,
) -> impl IntoResponse {
    let use_db = body.behaviour_source == "db";
    let db_rows = state.db.list().unwrap_or_default().len();

    let mut ctx = Context::new();
    ctx.insert("principles_csv", &body.principles_csv);
    ctx.insert("behaviour_csv", &body.behaviour_csv);
    ctx.insert(
        "behaviour_source",
        if use_db { "db" } else { "csv" },
    );
    ctx.insert("db_row_count", &db_rows);

    let principles_result = comparison::read_sister_csv(&body.principles_csv);
    let behaviour_result: Result<Vec<comparison::SisterRow>, String> = if use_db {
        let rows = db_rows_as_sister(&state);
        if rows.is_empty() {
            Err("no submissions in the database yet — submit one first or paste a CSV".into())
        } else {
            Ok(rows)
        }
    } else {
        comparison::read_sister_csv(&body.behaviour_csv)
    };

    match (principles_result, behaviour_result) {
        (Ok(p), Ok(b)) => {
            let pairs = comparison::pair_submissions(p, b);
            let totals = comparison::totals(&pairs);
            ctx.insert("pairs", &pairs);
            ctx.insert("totals", &totals);
            ctx.insert("rendered", &true);
            ctx.insert("error", "");
        }
        (Err(e), _) => {
            ctx.insert("rendered", &false);
            ctx.insert("error", &format!("Principles CSV: {e}"));
        }
        (_, Err(e)) => {
            let label = if use_db { "Database" } else { "Behaviour CSV" };
            ctx.insert("rendered", &false);
            ctx.insert("error", &format!("{label}: {e}"));
        }
    }
    render(&state, ctx, "comparison.html.tera")
}
