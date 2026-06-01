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
    diagnosis: Option<String>,
    has_flags: Option<String>,
    complete: Option<String>,
}

/// GET /dashboard -- render the DVLA M1 assessor dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<AssessmentRow> =
        models.iter().filter_map(AssessmentRow::from_model).collect();

    // Server-side search across signatory name, full name, GP name.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.full_name.to_lowercase().contains(&term)
                || row.signatory_name.to_lowercase().contains(&term)
                || row.gp_name.to_lowercase().contains(&term)
                || row.consultant_name.to_lowercase().contains(&term)
        });
    }

    if let Some(ref d) = params.diagnosis {
        if !d.is_empty() {
            items.retain(|row| row.has_mental_health_diagnosis == *d);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.urgent_flag_count + row.high_flag_count > 0),
            "no" => items.retain(|row| row.urgent_flag_count + row.high_flag_count == 0),
            _ => {}
        }
    }

    if let Some(ref c) = params.complete {
        match c.as_str() {
            "yes" => items.retain(|row| row.complete),
            "no" => items.retain(|row| !row.complete),
            _ => {}
        }
    }

    // Sort by signature date descending (most recent first).
    items.sort_by(|a, b| b.signature_date.cmp(&a.signature_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("rows", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("diagnosis", &params.diagnosis.unwrap_or_default());
    context.insert("has_flags", &params.has_flags.unwrap_or_default());
    context.insert("complete", &params.complete.unwrap_or_default());

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
