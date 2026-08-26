//! Cardiology-response CRUD + grade endpoints under `/api/cardiology_responses`.
//!
//! The relational schema is the source of truth: a response row references a
//! patient and a clinician; the four-axis grade is persisted across the
//! `cardiology_response_grades`, `cardiology_response_grade_rules`, and
//! `cardiology_response_grade_flags` tables.

use axum::{debug_handler, Json};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use serde::Deserialize;
use serde_json::{json, Value};
use uuid::Uuid;

use crate::engine::grader::calculate_grade;
use crate::engine::types::CardiologyResponse;
use crate::models::_entities::{clinicians as clinician_entity, patients as patient_entity};
use crate::models::cardiology_response_grade_flags;
use crate::models::cardiology_response_grade_rules;
use crate::models::cardiology_response_grades::{self, Model as GradeModel};
use crate::models::cardiology_responses::{self, find_by_id, ActiveModel, Model};

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
    let am = patient_entity::ActiveModel {
        id: ActiveValue::NotSet,
        created_at: ActiveValue::Set(now.into()),
        updated_at: ActiveValue::Set(now.into()),
        deleted_at: ActiveValue::Set(None),
        name: ActiveValue::Set(String::new()),
        birth_date: ActiveValue::Set(now.date_naive()),
        ..Default::default()
    };
    Ok(am.insert(&ctx.db).await?.id)
}

/// Ensure a clinician row exists, creating a minimal one when `id` is `None`.
async fn ensure_clinician(ctx: &AppContext, id: Option<Uuid>) -> Result<Uuid> {
    if let Some(id) = id {
        return Ok(id);
    }
    let now = Utc::now();
    let am = clinician_entity::ActiveModel {
        id: ActiveValue::NotSet,
        created_at: ActiveValue::Set(now.into()),
        updated_at: ActiveValue::Set(now.into()),
        deleted_at: ActiveValue::Set(None),
        name: ActiveValue::Set(String::new()),
        role: ActiveValue::Set(String::new()),
        registration_body: ActiveValue::Set(String::new()),
        registration_number: ActiveValue::Set(String::new()),
        ..Default::default()
    };
    Ok(am.insert(&ctx.db).await?.id)
}

/// POST /`api/cardiology_responses` — create a response (draft or filled).
#[debug_handler]
async fn create(State(ctx): State<AppContext>, Json(body): Json<CreateBody>) -> Result<Response> {
    let patient_id = ensure_patient(&ctx, body.patient_id).await?;
    let clinician_id = ensure_clinician(&ctx, body.clinician_id).await?;
    let am = ActiveModel::from_payload(patient_id, clinician_id, &body.payload);
    let model = am.insert(&ctx.db).await?;
    Ok(Json(response_to_json(&model)).into_response())
}

/// GET /`api/cardiology_responses` — list responses (newest first).
#[debug_handler]
async fn list(State(ctx): State<AppContext>) -> Result<Response> {
    let models = cardiology_responses::list_all(&ctx.db).await?;
    let items: Vec<Value> = models.iter().map(response_to_json).collect();
    Ok(Json(json!({ "items": items, "total": items.len() })).into_response())
}

/// GET /`api/cardiology_responses/{id`} — fetch one response.
#[debug_handler]
async fn show(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let model = find_by_id(&ctx.db, id).await?.ok_or_else(|| Error::NotFound)?;
    Ok(Json(response_to_json(&model)).into_response())
}

/// PATCH /`api/cardiology_responses/{id`} — overwrite the response payload fields.
#[debug_handler]
async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(payload): Json<CardiologyResponse>,
) -> Result<Response> {
    let model = find_by_id(&ctx.db, id).await?.ok_or_else(|| Error::NotFound)?;
    let patient_id = model.patient_id;
    let clinician_id = model.clinician_id;
    let created_at = model.created_at;

    // Re-map the incoming payload, preserving identity and creation time.
    let mut active = ActiveModel::from_payload(patient_id, clinician_id, &payload);
    active.id = ActiveValue::Unchanged(id);
    active.created_at = ActiveValue::Unchanged(created_at);
    active.updated_at = ActiveValue::Set(Utc::now().into());
    let model = active.update(&ctx.db).await?;
    Ok(Json(response_to_json(&model)).into_response())
}

/// DELETE /`api/cardiology_responses/{id`} — soft-delete the response.
#[debug_handler]
async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let model = find_by_id(&ctx.db, id).await?.ok_or_else(|| Error::NotFound)?;
    let mut active: ActiveModel = model.into_active_model();
    active.deleted_at = ActiveValue::Set(Some(Utc::now().into()));
    active.update(&ctx.db).await?;
    Ok(Json(json!({ "id": id, "deleted": true })).into_response())
}

/// POST /`api/cardiology_responses/{id}/submit` — run the four-axis engine over
/// the stored response and transactionally persist the grade, fired rules, and
/// flags. Idempotent: re-submitting replaces the prior grade.
#[debug_handler]
async fn submit(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let model = find_by_id(&ctx.db, id).await?.ok_or_else(|| Error::NotFound)?;
    let payload = model.to_payload();
    let grade = calculate_grade(&payload);

    let grade_row = GradeModel::persist_grade(&ctx.db, id, &grade).await?;
    let rules = cardiology_response_grade_rules::list_for_grade(&ctx.db, grade_row.id).await?;
    let flags = cardiology_response_grade_flags::list_for_grade(&ctx.db, grade_row.id).await?;

    Ok(Json(grade_to_json(&grade_row, &rules, &flags)).into_response())
}

/// GET /`api/cardiology_responses/{id}/result` — read back the persisted grade.
#[debug_handler]
async fn result(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let grade = cardiology_response_grades::find_for_response(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;
    let rules = cardiology_response_grade_rules::list_for_grade(&ctx.db, grade.id).await?;
    let flags = cardiology_response_grade_flags::list_for_grade(&ctx.db, grade.id).await?;
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
