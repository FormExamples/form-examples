//! Dashboard listing endpoint under `/api/dashboard`.
//!
//! Joins each computed grade back to its parent response so the dashboard can
//! show one row per graded response with the four-axis summary.

use axum::{debug_handler, Json};
use loco_rs::prelude::*;
use sea_orm::{EntityTrait, QueryOrder, QuerySelect};
use serde::Deserialize;
use serde_json::{json, Value};

use crate::models::_entities::neurodiversity_adjustment_response_grades;
use crate::models::_entities::neurodiversity_adjustment_responses;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    limit: Option<u64>,
}

/// GET /api/dashboard — list graded responses (response joined to its grade).
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
) -> Result<Response> {
    let limit = params.limit.unwrap_or(500);

    // Each grade row, newest first, paired with its parent response.
    let rows = neurodiversity_adjustment_response_grades::Entity::find()
        .find_also_related(neurodiversity_adjustment_responses::Entity)
        .order_by_desc(neurodiversity_adjustment_response_grades::Column::GradedAt)
        .limit(limit)
        .all(&ctx.db)
        .await?;

    let items: Vec<Value> = rows
        .into_iter()
        .map(|(grade, response)| {
            json!({
                "response": response,
                "grade": grade,
            })
        })
        .collect();

    Ok(Json(json!({ "items": items, "total": items.len() })).into_response())
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new().prefix("api").add("dashboard", get(dashboard))
}
