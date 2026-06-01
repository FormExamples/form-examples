use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::AssessmentRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    overall_severity: Option<String>,
    asrm_stage: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the assessment dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<AssessmentRow> = models
        .iter()
        .filter_map(AssessmentRow::from_model)
        .collect();

    // Server-side search across first / last name.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.first_name.to_lowercase().contains(&term)
                || row.last_name.to_lowercase().contains(&term)
        });
    }

    if let Some(ref sev) = params.overall_severity {
        if !sev.is_empty() {
            items.retain(|row| row.overall_severity == *sev);
        }
    }

    if let Some(ref stage) = params.asrm_stage {
        if !stage.is_empty() {
            if let Ok(n) = stage.parse::<i32>() {
                items.retain(|row| row.asrm_stage == Some(n));
            }
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by created_at descending (most recent first).
    items.sort_by(|a, b| b.created_at.cmp(&a.created_at));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "overall_severity",
        &params.overall_severity.unwrap_or_default(),
    );
    context.insert("asrm_stage", &params.asrm_stage.unwrap_or_default());
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
