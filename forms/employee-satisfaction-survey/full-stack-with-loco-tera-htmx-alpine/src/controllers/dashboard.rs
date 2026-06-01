use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::ResponseRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    department: Option<String>,
    tenure_band: Option<String>,
    category: Option<String>,
    retention_intent: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the HR dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<ResponseRow> = models.iter().filter_map(ResponseRow::from_model).collect();

    if let Some(ref dep) = params.department {
        if !dep.is_empty() {
            items.retain(|row| row.department == *dep);
        }
    }
    if let Some(ref tb) = params.tenure_band {
        if !tb.is_empty() {
            items.retain(|row| row.tenure_band == *tb);
        }
    }
    if let Some(ref cat) = params.category {
        if !cat.is_empty() {
            items.retain(|row| row.category == *cat);
        }
    }
    if let Some(ref ri) = params.retention_intent {
        if !ri.is_empty() {
            items.retain(|row| row.retention_intent == *ri);
        }
    }
    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by createdAt descending (newest first).
    items.sort_by(|a, b| b.created_at.cmp(&a.created_at));

    let total = items.len();
    let mut context = Context::new();
    context.insert("responses", &items);
    context.insert("total", &total);
    context.insert("department", &params.department.unwrap_or_default());
    context.insert("tenure_band", &params.tenure_band.unwrap_or_default());
    context.insert("category", &params.category.unwrap_or_default());
    context.insert(
        "retention_intent",
        &params.retention_intent.unwrap_or_default(),
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
