use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::CandidateRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    outcome: Option<String>,
    venue_type: Option<String>,
    assessment_type: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the training-coordinator dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<CandidateRow> = models
        .iter()
        .filter_map(CandidateRow::from_model)
        .collect();

    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.candidate_first_name.to_lowercase().contains(&term)
                || row.candidate_last_name.to_lowercase().contains(&term)
                || row.candidate_id.to_lowercase().contains(&term)
                || row.venue_name.to_lowercase().contains(&term)
        });
    }

    if let Some(ref outcome) = params.outcome {
        if !outcome.is_empty() {
            items.retain(|row| row.outcome == *outcome);
        }
    }

    if let Some(ref vt) = params.venue_type {
        if !vt.is_empty() {
            items.retain(|row| row.venue_type == *vt);
        }
    }

    if let Some(ref at) = params.assessment_type {
        if !at.is_empty() {
            items.retain(|row| row.assessment_type == *at);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by session date descending (most recent first).
    items.sort_by(|a, b| b.session_date.cmp(&a.session_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("candidates", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("outcome", &params.outcome.unwrap_or_default());
    context.insert("venue_type", &params.venue_type.unwrap_or_default());
    context.insert(
        "assessment_type",
        &params.assessment_type.unwrap_or_default(),
    );
    context.insert("has_flags", &params.has_flags.unwrap_or_default());

    let rendered = tera
        .render("dashboard.html.tera", &context)
        .map_err(|e| Error::BadRequest(format!("Template error: {e}")))?;

    Ok(Response::builder()
        .header("Content-Type", "text/html; charset=utf-8")
        .body(axum::body::Body::from(rendered))
        .map_err(Error::wrap)?
        .into_response())
}

pub fn routes(tera: Arc<Tera>) -> Routes {
    Routes::new()
        .add("dashboard", get(dashboard))
        .layer(Extension(tera))
}
