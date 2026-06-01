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
    overall_grade: Option<String>,
    priority: Option<String>,
    disposition: Option<String>,
    has_urgent_flags: Option<String>,
}

/// GET /dashboard -- render the post-operative reports dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<CaseRow> = models.iter().filter_map(CaseRow::from_model).collect();

    // Server-side search across patient name, MRN, and procedure.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.patient_name.to_lowercase().contains(&term)
                || row.mrn.to_lowercase().contains(&term)
                || row.procedure_name.to_lowercase().contains(&term)
        });
    }

    if let Some(ref grade) = params.overall_grade {
        if !grade.is_empty() {
            items.retain(|row| row.overall_grade == *grade);
        }
    }

    if let Some(ref prio) = params.priority {
        if !prio.is_empty() {
            items.retain(|row| row.procedure_priority == *prio);
        }
    }

    if let Some(ref disp) = params.disposition {
        if !disp.is_empty() {
            items.retain(|row| row.disposition == *disp);
        }
    }

    if let Some(ref hf) = params.has_urgent_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.urgent_flag_count > 0),
            "no" => items.retain(|row| row.urgent_flag_count == 0),
            _ => {}
        }
    }

    // Sort by surgery date descending.
    items.sort_by(|a, b| b.date_of_surgery.cmp(&a.date_of_surgery));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("overall_grade", &params.overall_grade.unwrap_or_default());
    context.insert("priority", &params.priority.unwrap_or_default());
    context.insert("disposition", &params.disposition.unwrap_or_default());
    context.insert(
        "has_urgent_flags",
        &params.has_urgent_flags.unwrap_or_default(),
    );

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
