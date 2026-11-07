//! Dashboard listing endpoint under `/api/dashboard`.
//!
//! Joins each computed grade back to its parent response so the dashboard can
//! show one row per graded response with the four-axis summary.

use crate::support::prelude::*;
use axum::debug_handler;
use serde::Deserialize;
use serde_json::{Value, json};

use crate::models::cardiology_response_grades;
use crate::models::cardiology_responses;

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
    let grades: Vec<cardiology_response_grades::Model> = sqlx::query_as(
        "SELECT * FROM cardiology_response_grades WHERE deleted_at IS NULL ORDER BY \
            graded_at DESC LIMIT $1",
    )
    .bind(i64::try_from(limit).unwrap_or(i64::MAX))
    .fetch_all(&db(&ctx))
    .await?;
    let mut rows = Vec::with_capacity(grades.len());
    for grade in grades {
        let parent =
            cardiology_responses::Model::find_by_id(&db(&ctx), grade.cardiology_response_id)
                .await?;
        rows.push((grade, parent));
    }

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
