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
    outcome: Option<String>,
    department_area: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the safety-officer dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<CaseRow> = models.iter().filter_map(CaseRow::from_model).collect();

    // Server-side search across site name, department, and auditor name.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.site_name.to_lowercase().contains(&term)
                || row.department_area.to_lowercase().contains(&term)
                || row.auditor_name.to_lowercase().contains(&term)
        });
    }

    if let Some(ref outcome) = params.outcome {
        if !outcome.is_empty() {
            items.retain(|row| row.outcome == *outcome);
        }
    }

    if let Some(ref dept) = params.department_area {
        if !dept.is_empty() {
            items.retain(|row| row.department_area == *dept);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by audit date descending (most recent first).
    items.sort_by(|a, b| b.audit_date.cmp(&a.audit_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("outcome", &params.outcome.unwrap_or_default());
    context.insert(
        "department_area",
        &params.department_area.unwrap_or_default(),
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
