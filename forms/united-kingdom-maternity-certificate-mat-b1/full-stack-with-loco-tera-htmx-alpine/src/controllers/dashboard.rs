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
    certificate_type: Option<String>,
    issuer_type: Option<String>,
    complete: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the MAT B1 administrative dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<AssessmentRow> =
        models.iter().filter_map(AssessmentRow::from_model).collect();

    // Server-side search across patient name, issuer name, and certificate number.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.patient_name.to_lowercase().contains(&term)
                || row.issuer_name.to_lowercase().contains(&term)
                || row.certificate_number.to_lowercase().contains(&term)
        });
    }

    if let Some(ref t) = params.certificate_type {
        if !t.is_empty() {
            items.retain(|row| row.certificate_type == *t);
        }
    }

    if let Some(ref t) = params.issuer_type {
        if !t.is_empty() {
            items.retain(|row| row.issuer_type == *t);
        }
    }

    if let Some(ref c) = params.complete {
        match c.as_str() {
            "yes" => items.retain(|row| row.complete),
            "no" => items.retain(|row| !row.complete),
            _ => {}
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.urgent_or_high_flag_count > 0),
            "no" => items.retain(|row| row.urgent_or_high_flag_count == 0),
            _ => {}
        }
    }

    // Sort by issue date descending (most recent first).
    items.sort_by(|a, b| b.issue_date.cmp(&a.issue_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("rows", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "certificate_type",
        &params.certificate_type.unwrap_or_default(),
    );
    context.insert("issuer_type", &params.issuer_type.unwrap_or_default());
    context.insert("complete", &params.complete.unwrap_or_default());
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
