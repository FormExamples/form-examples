use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::AcknowledgmentRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    acknowledgment_status: Option<String>,
    confirmed: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the acknowledgment dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<AcknowledgmentRow> =
        models.iter().filter_map(AcknowledgmentRow::from_model).collect();

    // Server-side search across patient name, NHS number, and the typed
    // acknowledgment full name.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.patient_name.to_lowercase().contains(&term)
                || row.patient_nhs_number.to_lowercase().contains(&term)
                || row.full_name.to_lowercase().contains(&term)
        });
    }

    if let Some(ref status) = params.acknowledgment_status {
        if !status.is_empty() {
            items.retain(|row| row.acknowledgment_status == *status);
        }
    }

    if let Some(ref c) = params.confirmed {
        match c.as_str() {
            "yes" => items.retain(|row| row.confirmed),
            "no" => items.retain(|row| !row.confirmed),
            _ => {}
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by acknowledged date descending (most recent first).
    items.sort_by(|a, b| b.acknowledged_date.cmp(&a.acknowledged_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("acknowledgments", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "acknowledgment_status",
        &params.acknowledgment_status.unwrap_or_default(),
    );
    context.insert("confirmed", &params.confirmed.unwrap_or_default());
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
