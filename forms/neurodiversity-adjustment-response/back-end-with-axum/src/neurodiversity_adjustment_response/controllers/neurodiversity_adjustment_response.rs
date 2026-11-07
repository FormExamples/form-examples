//! Neurodiversity-adjustment-response CRUD + grade endpoints under `/api/neurodiversity_adjustment_responses`.
//!
//! The relational schema is the source of truth: a response row references a
//! worker and a manager; the four-axis grade is persisted across the
//! `neurodiversity_adjustment_response_grades`, `neurodiversity_adjustment_response_grade_rules`, and
//! `neurodiversity_adjustment_response_grade_flags` tables.

use crate::support::prelude::*;
use axum::debug_handler;
use chrono::Utc;
use serde::Deserialize;
use serde_json::{Value, json};
use uuid::Uuid;

use crate::engine::grader::calculate_grade;
use crate::engine::types::NeurodiversityAdjustmentResponse;
use crate::models::neurodiversity_adjustment_response_grade_flags;
use crate::models::neurodiversity_adjustment_response_grade_rules;
use crate::models::neurodiversity_adjustment_response_grades::{self, Model as GradeModel};
use crate::models::neurodiversity_adjustment_responses::{self, Model, find_by_id};
use crate::models::{managers, workers};

/// Body for creating a response: an optional worker / manager foreign key
/// plus the response payload. When a foreign key is omitted a minimal owning
/// row is created so the response can stand alone.
#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateBody {
    worker_id: Option<Uuid>,
    manager_id: Option<Uuid>,
    #[serde(flatten)]
    payload: NeurodiversityAdjustmentResponse,
}

/// Serialize a response row to the camelCase JSON the front-end expects.
fn response_to_json(m: &Model) -> Value {
    serde_json::to_value(m).unwrap_or(Value::Null)
}

/// Serialize a grade row plus its rule and flag rows into a result document.
fn grade_to_json(
    grade: &GradeModel,
    rules: &[neurodiversity_adjustment_response_grade_rules::Model],
    flags: &[neurodiversity_adjustment_response_grade_flags::Model],
) -> Value {
    json!({
        "grade": grade,
        "firedRules": rules,
        "flags": flags,
    })
}

/// Ensure a worker row exists, creating a minimal one when `id` is `None`.
async fn ensure_worker(ctx: &AppContext, id: Option<Uuid>) -> Result<Uuid> {
    if let Some(id) = id {
        return Ok(id);
    }
    let now = Utc::now();
    Ok(sqlx::query_as::<_, workers::Model>(
        "INSERT INTO workers (created_at, updated_at, name, job_title, department, \
        employment_type, work_pattern, work_location) VALUES ($1, $2, $3, $4, $5, $6, $7, \
        $8) RETURNING *",
    )
    .bind(now)
    .bind(now)
    .bind(String::new())
    .bind(String::new())
    .bind(String::new())
    .bind(String::new())
    .bind(String::new())
    .bind(String::new())
    .fetch_one(&db(ctx))
    .await?
    .id)
}

/// Ensure a manager row exists, creating a minimal one when `id` is `None`.
async fn ensure_manager(ctx: &AppContext, id: Option<Uuid>) -> Result<Uuid> {
    if let Some(id) = id {
        return Ok(id);
    }
    let now = Utc::now();
    Ok(sqlx::query_as::<_, managers::Model>(
        "INSERT INTO managers (created_at, updated_at, name, role, job_title, department) \
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    )
    .bind(now)
    .bind(now)
    .bind(String::new())
    .bind(String::new())
    .bind(String::new())
    .bind(String::new())
    .fetch_one(&db(ctx))
    .await?
    .id)
}

/// POST /`api/neurodiversity_adjustment_responses` — create a response (draft or filled).
#[debug_handler]
async fn create(State(ctx): State<AppContext>, Json(body): Json<CreateBody>) -> Result<Response> {
    let worker_id = ensure_worker(&ctx, body.worker_id).await?;
    let manager_id = ensure_manager(&ctx, body.manager_id).await?;
    let model = Model::insert_payload(&db(&ctx), worker_id, manager_id, &body.payload).await?;
    Ok(Json(response_to_json(&model)).into_response())
}

/// GET /`api/neurodiversity_adjustment_responses` — list responses (newest first).
#[debug_handler]
async fn list(State(ctx): State<AppContext>, OriginalUri(uri): OriginalUri) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let models = neurodiversity_adjustment_responses::page(&db(&ctx), &page).await?;
    let items: Vec<Value> = models.iter().map(response_to_json).collect();
    Ok(page.respond(items))
}

/// GET /`api/neurodiversity_adjustment_responses/{id`} — fetch one response.
#[debug_handler]
async fn show(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let model = find_by_id(&db(&ctx), id)
        .await?
        .ok_or_else(|| Error::NotFound)?;
    Ok(Json(response_to_json(&model)).into_response())
}

/// PATCH /`api/neurodiversity_adjustment_responses/{id`} — overwrite the response payload fields.
#[debug_handler]
async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(payload): Json<NeurodiversityAdjustmentResponse>,
) -> Result<Response> {
    let model = find_by_id(&db(&ctx), id)
        .await?
        .ok_or_else(|| Error::NotFound)?;
    let worker_id = model.worker_id;
    let manager_id = model.manager_id;

    // Re-map the incoming payload, preserving identity and creation time.
    let model = Model::update_payload(&db(&ctx), id, worker_id, manager_id, &payload).await?;
    Ok(Json(response_to_json(&model)).into_response())
}

/// DELETE /`api/neurodiversity_adjustment_responses/{id`} — soft-delete the response.
#[debug_handler]
async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let model = find_by_id(&db(&ctx), id)
        .await?
        .ok_or_else(|| Error::NotFound)?;
    Model::soft_delete(&db(&ctx), model.id).await?;
    Ok(Json(json!({ "id": id, "deleted": true })).into_response())
}

/// POST /`api/neurodiversity_adjustment_responses/{id}/submit` — run the four-axis engine over
/// the stored response and transactionally persist the grade, fired rules, and
/// flags. Idempotent: re-submitting replaces the prior grade.
#[debug_handler]
async fn submit(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let model = find_by_id(&db(&ctx), id)
        .await?
        .ok_or_else(|| Error::NotFound)?;
    let payload = model.to_payload();
    let grade = calculate_grade(&payload);

    let grade_row = GradeModel::persist_grade(&db(&ctx), id, &grade).await?;
    let rules =
        neurodiversity_adjustment_response_grade_rules::list_for_grade(&db(&ctx), grade_row.id)
            .await?;
    let flags =
        neurodiversity_adjustment_response_grade_flags::list_for_grade(&db(&ctx), grade_row.id)
            .await?;

    Ok(Json(grade_to_json(&grade_row, &rules, &flags)).into_response())
}

/// GET /`api/neurodiversity_adjustment_responses/{id}/result` — read back the persisted grade.
#[debug_handler]
async fn result(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let grade = neurodiversity_adjustment_response_grades::find_for_response(&db(&ctx), id)
        .await?
        .ok_or_else(|| Error::NotFound)?;
    let rules =
        neurodiversity_adjustment_response_grade_rules::list_for_grade(&db(&ctx), grade.id).await?;
    let flags =
        neurodiversity_adjustment_response_grade_flags::list_for_grade(&db(&ctx), grade.id).await?;
    Ok(Json(grade_to_json(&grade, &rules, &flags)).into_response())
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/neurodiversity_adjustment_responses")
        .add("/", get(list))
        .add("/", post(create))
        .add("{id}", get(show))
        .add("{id}", axum::routing::patch(update))
        .add("{id}", axum::routing::delete(remove))
        .add("{id}/submit", post(submit))
        .add("{id}/result", get(result))
}
