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
    risk_level: Option<String>,
    gfr_category: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the renal-clinic dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<CaseRow> = models.iter().filter_map(CaseRow::from_model).collect();

    // Server-side search across patient first / last name.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.patient_first_name.to_lowercase().contains(&term)
                || row.patient_last_name.to_lowercase().contains(&term)
        });
    }

    if let Some(ref r) = params.risk_level {
        if !r.is_empty() {
            items.retain(|row| row.risk_level == *r);
        }
    }

    if let Some(ref g) = params.gfr_category {
        if !g.is_empty() {
            items.retain(|row| row.gfr_category == *g);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items
                .retain(|row| row.urgent_flag_count + row.high_priority_flag_count > 0),
            "no" => items
                .retain(|row| row.urgent_flag_count + row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by timestamp descending (most recent first).
    items.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("risk_level", &params.risk_level.unwrap_or_default());
    context.insert("gfr_category", &params.gfr_category.unwrap_or_default());
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
