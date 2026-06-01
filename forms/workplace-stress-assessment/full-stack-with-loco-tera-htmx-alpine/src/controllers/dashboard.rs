use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::AssessmentRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    department: Option<String>,
    tenure_band: Option<String>,
    hours_band: Option<String>,
    overall_risk: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the occupational-health dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<AssessmentRow> =
        models.iter().filter_map(AssessmentRow::from_model).collect();

    if let Some(ref dept) = params.department {
        if !dept.is_empty() {
            items.retain(|row| row.department == *dept);
        }
    }
    if let Some(ref tb) = params.tenure_band {
        if !tb.is_empty() {
            items.retain(|row| row.tenure_band == *tb);
        }
    }
    if let Some(ref hb) = params.hours_band {
        if !hb.is_empty() {
            items.retain(|row| row.hours_band == *hb);
        }
    }
    if let Some(ref risk) = params.overall_risk {
        if !risk.is_empty() {
            items.retain(|row| row.overall_risk == *risk);
        }
    }
    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by timestamp descending (most recent first).
    items.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));

    let total = items.len();
    let mut context = Context::new();
    context.insert("assessments", &items);
    context.insert("total", &total);
    context.insert("department", &params.department.unwrap_or_default());
    context.insert("tenure_band", &params.tenure_band.unwrap_or_default());
    context.insert("hours_band", &params.hours_band.unwrap_or_default());
    context.insert("overall_risk", &params.overall_risk.unwrap_or_default());
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
