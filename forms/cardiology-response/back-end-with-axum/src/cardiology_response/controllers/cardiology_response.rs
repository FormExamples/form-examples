//! Cardiology-response CRUD + grade endpoints under `/api/cardiology_responses`.
//!
//! The relational schema is the source of truth: a response row references a
//! patient and a clinician; the four-axis grade is persisted across the
//! `cardiology_response_grades`, `cardiology_response_grade_rules`, and
//! `cardiology_response_grade_flags` tables.

use crate::support::prelude::*;
use axum::{Json, debug_handler};
use chrono::Utc;
use serde::Deserialize;
use serde_json::{Value, json};
use uuid::Uuid;

use crate::engine::grader::calculate_grade;
use crate::engine::types::CardiologyResponse;
use crate::models::cardiology_response_grade_flags;
use crate::models::cardiology_response_grade_rules;
use crate::models::cardiology_response_grades::{self, Model as GradeModel};
use crate::models::cardiology_responses::{self, Model, find_by_id};
use crate::models::{clinicians, patients};

/// Body for creating a response: an optional patient / clinician foreign key
/// plus the response payload. When a foreign key is omitted a minimal owning
/// row is created so the response can stand alone.
#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateBody {
    patient_id: Option<Uuid>,
    clinician_id: Option<Uuid>,
    #[serde(flatten)]
    payload: CardiologyResponse,
}

/// Serialize a response row to the camelCase JSON the front-end expects.
fn response_to_json(m: &Model) -> Value {
    serde_json::to_value(m).unwrap_or(Value::Null)
}

/// Serialize a grade row plus its rule and flag rows into a result document.
fn grade_to_json(
    grade: &GradeModel,
    rules: &[cardiology_response_grade_rules::Model],
    flags: &[cardiology_response_grade_flags::Model],
) -> Value {
    json!({
        "grade": grade,
        "firedRules": rules,
        "flags": flags,
    })
}

/// Ensure a patient row exists, creating a minimal one when `id` is `None`.
async fn ensure_patient(ctx: &AppContext, id: Option<Uuid>) -> Result<Uuid> {
    if let Some(id) = id {
        return Ok(id);
    }
    let now = Utc::now();
    Ok(sqlx::query_as::<_, patients::Model>(
        "INSERT INTO patients (created_at, updated_at, name, birth_date) VALUES ($1, $2, \
        $3, $4) RETURNING *",
    )
    .bind(now)
    .bind(now)
    .bind(String::new())
    .bind(now.date_naive())
    .fetch_one(&db(ctx))
    .await?
    .id)
}

/// Ensure a clinician row exists, creating a minimal one when `id` is `None`.
async fn ensure_clinician(ctx: &AppContext, id: Option<Uuid>) -> Result<Uuid> {
    if let Some(id) = id {
        return Ok(id);
    }
    let now = Utc::now();
    Ok(sqlx::query_as::<_, clinicians::Model>(
        "INSERT INTO clinicians (created_at, updated_at, name, role, registration_body, \
        registration_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
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

/// POST /`api/cardiology_responses` — create a response (draft or filled).
#[debug_handler]
async fn create(State(ctx): State<AppContext>, Json(body): Json<CreateBody>) -> Result<Response> {
    let patient_id = ensure_patient(&ctx, body.patient_id).await?;
    let clinician_id = ensure_clinician(&ctx, body.clinician_id).await?;
    let model = Model::insert_payload(&db(&ctx), patient_id, clinician_id, &body.payload).await?;
    Ok(Json(response_to_json(&model)).into_response())
}

/// GET /`api/cardiology_responses` — list responses (newest first).
#[debug_handler]
async fn list(State(ctx): State<AppContext>, Query(params): Query<PageParams>) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (models, total) = cardiology_responses::page(&db(&ctx), page).await?;
    let items: Vec<Value> = models.iter().map(response_to_json).collect();
    let headers = page.headers(u64::try_from(total).unwrap_or(0));
    Ok((headers, Json(json!({ "items": items, "total": total }))).into_response())
}

/// GET /`api/cardiology_responses/{id`} — fetch one response.
#[debug_handler]
async fn show(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let model = find_by_id(&db(&ctx), id)
        .await?
        .ok_or_else(|| Error::NotFound)?;
    Ok(Json(response_to_json(&model)).into_response())
}

/// PATCH /`api/cardiology_responses/{id`} — overwrite the response payload fields.
#[debug_handler]
async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(payload): Json<CardiologyResponse>,
) -> Result<Response> {
    let model = find_by_id(&db(&ctx), id)
        .await?
        .ok_or_else(|| Error::NotFound)?;
    let patient_id = model.patient_id;
    let clinician_id = model.clinician_id;

    // Re-map the incoming payload, preserving identity and creation time.
    let model = Model::update_payload(&db(&ctx), id, patient_id, clinician_id, &payload).await?;
    Ok(Json(response_to_json(&model)).into_response())
}

/// DELETE /`api/cardiology_responses/{id`} — soft-delete the response.
#[debug_handler]
async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let model = find_by_id(&db(&ctx), id)
        .await?
        .ok_or_else(|| Error::NotFound)?;
    Model::soft_delete(&db(&ctx), model.id).await?;
    Ok(Json(json!({ "id": id, "deleted": true })).into_response())
}

/// POST /`api/cardiology_responses/{id}/submit` — run the four-axis engine over
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
    let rules = cardiology_response_grade_rules::list_for_grade(&db(&ctx), grade_row.id).await?;
    let flags = cardiology_response_grade_flags::list_for_grade(&db(&ctx), grade_row.id).await?;

    Ok(Json(grade_to_json(&grade_row, &rules, &flags)).into_response())
}

/// GET /`api/cardiology_responses/{id}/result` — read back the persisted grade.
#[debug_handler]
async fn result(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let grade = cardiology_response_grades::find_for_response(&db(&ctx), id)
        .await?
        .ok_or_else(|| Error::NotFound)?;
    let rules = cardiology_response_grade_rules::list_for_grade(&db(&ctx), grade.id).await?;
    let flags = cardiology_response_grade_flags::list_for_grade(&db(&ctx), grade.id).await?;
    Ok(Json(grade_to_json(&grade, &rules, &flags)).into_response())
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/cardiology_responses")
        .add("/", get(list))
        .add("/", post(create))
        .add("{id}", get(show))
        .add("{id}", axum::routing::patch(update))
        .add("{id}", axum::routing::delete(remove))
        .add("{id}/submit", post(submit))
        .add("{id}/result", get(result))
}
