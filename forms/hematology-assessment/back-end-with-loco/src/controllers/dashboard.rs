//! Dashboard listing endpoints under `/api/dashboard`.

use axum::{debug_handler, Json};
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

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api")
        .add("dashboard", get(dashboard))
}
