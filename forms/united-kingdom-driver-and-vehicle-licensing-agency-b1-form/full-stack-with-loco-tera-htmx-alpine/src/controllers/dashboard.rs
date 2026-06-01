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
    has_flags: Option<String>,
    complete: Option<String>,
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

    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.full_name.to_lowercase().contains(&term)
                || row.postcode.to_lowercase().contains(&term)
                || row.gp_name.to_lowercase().contains(&term)
        });
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.urgent_flag_count > 0 || row.high_flag_count > 0),
            "no" => items.retain(|row| row.urgent_flag_count == 0 && row.high_flag_count == 0),
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

    items.sort_by(|a, b| b.created_at.cmp(&a.created_at));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
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
