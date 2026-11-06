//! Dashboard listing endpoint under `/api/dashboard`.
//!
//! Joins each request with its computed grade (left join: ungraded drafts are
//! still listed, with a null grade) for the cardiology vetting worklist.

use crate::support::prelude::*;
use axum::{Json, debug_handler};
use serde::Deserialize;
use serde_json::{Value, json};

use crate::models::{cardiology_request_grades, cardiology_requests};

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

    let requests: Vec<cardiology_requests::Model> = sqlx::query_as(
        "SELECT * FROM cardiology_requests WHERE ($1::text IS NULL OR status = $1) \
         ORDER BY created_at DESC LIMIT $2",
    )
    .bind(params.status)
    .bind(i64::try_from(limit).unwrap_or(i64::MAX))
    .fetch_all(&db(&ctx))
    .await?;

    let mut items: Vec<Value> = Vec::with_capacity(requests.len());
    for request in &requests {
        let grade = sqlx::query_as::<_, cardiology_request_grades::Model>(
            "SELECT * FROM cardiology_request_grades WHERE cardiology_request_id = $1",
        )
        .bind(request.id)
        .fetch_optional(&db(&ctx))
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
