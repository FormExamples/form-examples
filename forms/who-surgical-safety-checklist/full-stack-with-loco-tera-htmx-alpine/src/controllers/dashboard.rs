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
    checklist_status: Option<String>,
    urgency: Option<String>,
    surgical_specialty: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the operating-team dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<CaseRow> = models.iter().filter_map(CaseRow::from_model).collect();

    // Server-side search across patient name, NHS number, and procedure.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.patient_name.to_lowercase().contains(&term)
                || row.patient_nhs_number.to_lowercase().contains(&term)
                || row.planned_procedure.to_lowercase().contains(&term)
        });
    }

    if let Some(ref status) = params.checklist_status {
        if !status.is_empty() {
            items.retain(|row| row.checklist_status == *status);
        }
    }

    if let Some(ref urg) = params.urgency {
        if !urg.is_empty() {
            items.retain(|row| row.urgency == *urg);
        }
    }

    if let Some(ref spec) = params.surgical_specialty {
        if !spec.is_empty() {
            items.retain(|row| row.surgical_specialty == *spec);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by case date descending (most recent first).
    items.sort_by(|a, b| b.case_date.cmp(&a.case_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "checklist_status",
        &params.checklist_status.unwrap_or_default(),
    );
    context.insert("urgency", &params.urgency.unwrap_or_default());
    context.insert(
        "surgical_specialty",
        &params.surgical_specialty.unwrap_or_default(),
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
