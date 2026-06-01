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
    depression_severity: Option<String>,
    anxiety_severity: Option<String>,
    stress_severity: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the clinician dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<CaseRow> = models.iter().filter_map(CaseRow::from_model).collect();

    // Server-side search across patient name and primary concern.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.patient_name.to_lowercase().contains(&term)
                || row.primary_concern.to_lowercase().contains(&term)
        });
    }

    if let Some(ref sev) = params.depression_severity {
        if !sev.is_empty() {
            items.retain(|row| row.depression_severity == *sev);
        }
    }

    if let Some(ref sev) = params.anxiety_severity {
        if !sev.is_empty() {
            items.retain(|row| row.anxiety_severity == *sev);
        }
    }

    if let Some(ref sev) = params.stress_severity {
        if !sev.is_empty() {
            items.retain(|row| row.stress_severity == *sev);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.urgent_flag_count > 0 || row.high_flag_count > 0),
            "no" => items.retain(|row| row.urgent_flag_count == 0 && row.high_flag_count == 0),
            _ => {}
        }
    }

    // Sort by created_at descending (most recent first); use case id as proxy.
    items.sort_by(|a, b| b.created_at.cmp(&a.created_at));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "depression_severity",
        &params.depression_severity.unwrap_or_default(),
    );
    context.insert(
        "anxiety_severity",
        &params.anxiety_severity.unwrap_or_default(),
    );
    context.insert(
        "stress_severity",
        &params.stress_severity.unwrap_or_default(),
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
