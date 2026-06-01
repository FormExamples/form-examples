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
    severity_level: Option<String>,
    sex: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the ENT clinic dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<CaseRow> = models.iter().filter_map(CaseRow::from_model).collect();

    // Server-side search across patient name and chief complaint.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.first_name.to_lowercase().contains(&term)
                || row.last_name.to_lowercase().contains(&term)
                || row.chief_complaint.to_lowercase().contains(&term)
                || row.working_diagnosis.to_lowercase().contains(&term)
        });
    }

    if let Some(ref level) = params.severity_level {
        if !level.is_empty() {
            items.retain(|row| row.severity_level == *level);
        }
    }

    if let Some(ref sx) = params.sex {
        if !sx.is_empty() {
            items.retain(|row| row.sex == *sx);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.urgent_flag_count + row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.urgent_flag_count + row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by descending SNOT-22 total (most severe first).
    items.sort_by(|a, b| b.total_score.cmp(&a.total_score));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "severity_level",
        &params.severity_level.unwrap_or_default(),
    );
    context.insert("sex", &params.sex.unwrap_or_default());
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
