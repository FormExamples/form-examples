//! Dashboard listing endpoint under `/api/dashboard`.
//!
//! Joins each request with its computed grade (left join: ungraded drafts are
//! still listed, with a null grade) for the reasonable-adjustments worklist.

use axum::{debug_handler, Json};
use loco_rs::prelude::*;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter, QueryOrder, QuerySelect};
use serde::Deserialize;
use serde_json::{json, Value};

use crate::models::_entities::{
    neurodiversity_adjustment_request_grades, neurodiversity_adjustment_requests,
};

/// Query parameters for the dashboard listing.
#[derive(Debug, Deserialize)]
struct DashboardParams {
    status: Option<String>,
    limit: Option<u64>,
}

/// GET /api/dashboard -- list requests joined with their grade as JSON.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
) -> Result<Response> {
    let limit = params.limit.unwrap_or(500);

    let mut query = neurodiversity_adjustment_requests::Entity::find()
        .order_by_desc(neurodiversity_adjustment_requests::Column::CreatedAt)
        .limit(limit);
    if let Some(status) = params.status {
        query = query.filter(neurodiversity_adjustment_requests::Column::Status.eq(status));
    }
    let requests = query.all(&ctx.db).await?;

    let mut items: Vec<Value> = Vec::with_capacity(requests.len());
    for request in &requests {
        let grade = neurodiversity_adjustment_request_grades::Entity::find()
            .filter(
                neurodiversity_adjustment_request_grades::Column::NeurodiversityAdjustmentRequestId
                    .eq(request.id),
            )
            .one(&ctx.db)
            .await?;
        items.push(json!({
            "request": request,
            "grade": grade,
        }));
    }

    let total = items.len();
    Ok(Json(json!({ "items": items, "total": total })).into_response())
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new().prefix("api").add("dashboard", get(dashboard))
}
