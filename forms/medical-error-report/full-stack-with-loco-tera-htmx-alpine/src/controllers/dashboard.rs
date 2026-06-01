use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::ReportRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    error_type: Option<String>,
    who_severity: Option<String>,
    overall_risk: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the medical-error-report dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<ReportRow> = models.iter().filter_map(ReportRow::from_model).collect();

    // Server-side search across facility name, ward, and location type.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.facility_name.to_lowercase().contains(&term)
                || row.facility_ward.to_lowercase().contains(&term)
                || row.location_type.to_lowercase().contains(&term)
                || row.error_type.to_lowercase().contains(&term)
        });
    }

    if let Some(ref et) = params.error_type {
        if !et.is_empty() {
            items.retain(|row| row.error_type == *et);
        }
    }

    if let Some(ref sev) = params.who_severity {
        if !sev.is_empty() {
            items.retain(|row| row.who_severity == *sev);
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

    // Sort by report date descending (most recent first).
    items.sort_by(|a, b| b.report_date.cmp(&a.report_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("reports", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("error_type", &params.error_type.unwrap_or_default());
    context.insert("who_severity", &params.who_severity.unwrap_or_default());
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
