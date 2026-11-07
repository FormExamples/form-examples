//! Dashboard listing endpoint under `/api/dashboard`.
//!
//! Joins each request with its computed grade (left join: ungraded drafts are
//! still listed, with a null grade) for the reasonable-adjustments worklist.

use crate::support::prelude::*;
use axum::debug_handler;
use serde::Deserialize;
use serde_json::{Value, json};

use crate::models::{neurodiversity_adjustment_request_grades, neurodiversity_adjustment_requests};

/// Query parameters for the dashboard listing.
#[derive(Debug, Deserialize)]
struct DashboardParams {
    status: Option<String>,
    #[serde(flatten)]
    page: PageParams,
}

/// GET /api/dashboard -- list requests joined with their grade as JSON.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
) -> Result<Response> {
    let page = params.page.resolve(PAGE_LIMITS)?;
    let (limit, offset) = page.bounds();

    let requests: Vec<neurodiversity_adjustment_requests::Model> = sqlx::query_as(
        "SELECT * FROM neurodiversity_adjustment_requests WHERE ($1::text IS NULL OR \
            status = $1) AND deleted_at IS NULL ORDER BY created_at DESC, id LIMIT $2 \
            OFFSET $3",
    )
    .bind(params.status.as_deref())
    .bind(limit)
    .bind(offset)
    .fetch_all(&db(&ctx))
    .await?;

    let mut items: Vec<Value> = Vec::with_capacity(requests.len());
    for request in &requests {
        let grade = sqlx::query_as::<_, neurodiversity_adjustment_request_grades::Model>(
            "SELECT * FROM neurodiversity_adjustment_request_grades WHERE \
            neurodiversity_adjustment_request_id = $1 AND deleted_at IS NULL",
        )
        .bind(request.id)
        .fetch_optional(&db(&ctx))
        .await?;
        items.push(json!({
            "request": request,
            "grade": grade,
        }));
    }

    let total: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM neurodiversity_adjustment_requests WHERE ($1::text IS NULL OR status = $1) \
            AND deleted_at IS NULL",
    )
    .bind(params.status.as_deref())
    .fetch_one(&db(&ctx))
    .await?;
    Ok(page.respond(total, items))
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new().prefix("api").add("dashboard", get(dashboard))
}
