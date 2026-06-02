use axum::{debug_handler, Json};
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
