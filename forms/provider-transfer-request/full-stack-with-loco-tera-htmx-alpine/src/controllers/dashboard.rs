use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::TransferRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    completeness: Option<String>,
    urgency: Option<String>,
    transfer_type: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the operator dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<TransferRow> = models
        .iter()
        .filter_map(TransferRow::from_model)
        .collect();

    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.patient_name.to_lowercase().contains(&term)
                || row.patient_nhs_number.to_lowercase().contains(&term)
                || row.primary_diagnosis.to_lowercase().contains(&term)
                || row.requesting_organisation.to_lowercase().contains(&term)
                || row.receiving_organisation.to_lowercase().contains(&term)
        });
    }

    if let Some(ref c) = params.completeness {
        if !c.is_empty() {
            items.retain(|row| row.completeness == *c);
        }
    }

    if let Some(ref u) = params.urgency {
        if !u.is_empty() {
            items.retain(|row| row.urgency == *u);
        }
    }

    if let Some(ref t) = params.transfer_type {
        if !t.is_empty() {
            items.retain(|row| row.transfer_type == *t);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.urgent_flag_count + row.high_flag_count > 0),
            "no" => items.retain(|row| row.urgent_flag_count + row.high_flag_count == 0),
            _ => {}
        }
    }

    let total = items.len();
    let mut context = Context::new();
    context.insert("transfers", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("completeness", &params.completeness.unwrap_or_default());
    context.insert("urgency", &params.urgency.unwrap_or_default());
    context.insert("transfer_type", &params.transfer_type.unwrap_or_default());
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
