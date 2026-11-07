//! Dashboard listing endpoint under `/api/dashboard`.
//!
//! Joins each computed grade back to its parent review so the dashboard can
//! show one row per graded review with the four-axis summary.

use crate::support::prelude::*;
use axum::{Json, debug_handler};
use serde::Deserialize;
use serde_json::{Value, json};

use crate::models::neurodiversity_adjustment_review_grades;
use crate::models::neurodiversity_adjustment_reviews;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    limit: Option<u64>,
}

/// GET /api/dashboard — list graded reviews (review joined to its grade).
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
) -> Result<Response> {
    let limit = params.limit.unwrap_or(500);

    // Each grade row, newest first, paired with its parent review.
    let grades: Vec<neurodiversity_adjustment_review_grades::Model> = sqlx::query_as(
        "SELECT * FROM neurodiversity_adjustment_review_grades WHERE deleted_at IS \
            NULL ORDER BY graded_at DESC LIMIT $1",
    )
    .bind(i64::try_from(limit).unwrap_or(i64::MAX))
    .fetch_all(&db(&ctx))
    .await?;
    let mut rows = Vec::with_capacity(grades.len());
    for grade in grades {
        let parent = neurodiversity_adjustment_reviews::Model::find_by_id(
            &db(&ctx),
            grade.neurodiversity_adjustment_review_id,
        )
        .await?;
        rows.push((grade, parent));
    }

    let items: Vec<Value> = rows
        .into_iter()
        .map(|(grade, review)| {
            json!({
                "review": review,
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
