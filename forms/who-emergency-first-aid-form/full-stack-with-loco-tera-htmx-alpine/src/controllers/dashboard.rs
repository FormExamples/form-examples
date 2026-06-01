use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::CaseRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    problem_type: Option<String>,
    pregnant: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the CFAR encounter dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<CaseRow> = models.iter().filter_map(CaseRow::from_model).collect();

    // Server-side search across patient name, referral facility, and responder.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.patient_name.to_lowercase().contains(&term)
                || row.referral_facility.to_lowercase().contains(&term)
                || row.responder_name.to_lowercase().contains(&term)
        });
    }

    if let Some(ref pt) = params.problem_type {
        if !pt.is_empty() {
            items.retain(|row| row.problem_type == *pt);
        }
    }

    if let Some(ref pr) = params.pregnant {
        if !pr.is_empty() {
            items.retain(|row| row.pregnant == *pr);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "urgent" => items.retain(|row| row.urgent_flag_count > 0),
            "high" => items.retain(|row| row.high_flag_count > 0),
            "none" => items.retain(|row| row.urgent_flag_count == 0 && row.high_flag_count == 0),
            _ => {}
        }
    }

    // Sort by event date/time descending (most recent first).
    items.sort_by(|a, b| b.event_date_time.cmp(&a.event_date_time));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("problem_type", &params.problem_type.unwrap_or_default());
    context.insert("pregnant", &params.pregnant.unwrap_or_default());
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
