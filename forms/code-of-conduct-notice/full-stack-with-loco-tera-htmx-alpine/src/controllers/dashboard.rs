use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::AcknowledgementRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    status: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the compliance dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<AcknowledgementRow> = models
        .iter()
        .filter_map(AcknowledgementRow::from_model)
        .collect();

    // Server-side search across organisation, recipient name, and role.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.organisation_name.to_lowercase().contains(&term)
                || row.recipient_name.to_lowercase().contains(&term)
                || row.recipient_role.to_lowercase().contains(&term)
        });
    }

    if let Some(ref status) = params.status {
        if !status.is_empty() {
            items.retain(|row| row.status == *status);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by typed date descending (most recent first).
    items.sort_by(|a, b| b.recipient_typed_date.cmp(&a.recipient_typed_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("rows", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("status", &params.status.unwrap_or_default());
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
