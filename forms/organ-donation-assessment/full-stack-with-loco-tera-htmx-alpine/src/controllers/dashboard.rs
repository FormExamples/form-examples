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
    eligibility: Option<String>,
    risk_level: Option<String>,
    donor_type: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the organ-donation dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<CaseRow> = models.iter().filter_map(CaseRow::from_model).collect();

    // Server-side search across donor name, intended organs, assessor name.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.donor_name.to_lowercase().contains(&term)
                || row.intended_organs.to_lowercase().contains(&term)
                || row.assessor_name.to_lowercase().contains(&term)
        });
    }

    if let Some(ref e) = params.eligibility {
        if !e.is_empty() {
            items.retain(|row| row.eligibility == *e);
        }
    }

    if let Some(ref r) = params.risk_level {
        if !r.is_empty() {
            items.retain(|row| row.risk_level == *r);
        }
    }

    if let Some(ref dt) = params.donor_type {
        if !dt.is_empty() {
            items.retain(|row| row.donor_type == *dt);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by assessment date descending (most recent first).
    items.sort_by(|a, b| b.assessment_date.cmp(&a.assessment_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("eligibility", &params.eligibility.unwrap_or_default());
    context.insert("risk_level", &params.risk_level.unwrap_or_default());
    context.insert("donor_type", &params.donor_type.unwrap_or_default());
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
