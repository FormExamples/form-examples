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
    category: Option<String>,
    probable_dsm5: Option<String>,
    has_urgent_flag: Option<String>,
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

    // Server-side search across patient name and trauma event description.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.first_name.to_lowercase().contains(&term)
                || row.last_name.to_lowercase().contains(&term)
                || row.event_description.to_lowercase().contains(&term)
        });
    }

    if let Some(ref cat) = params.category {
        if !cat.is_empty() {
            items.retain(|row| row.category == *cat);
        }
    }

    if let Some(ref p) = params.probable_dsm5 {
        match p.as_str() {
            "yes" => items.retain(|row| row.probable_dsm5_diagnosis),
            "no" => items.retain(|row| !row.probable_dsm5_diagnosis),
            _ => {}
        }
    }

    if let Some(ref hf) = params.has_urgent_flag {
        match hf.as_str() {
            "yes" => items.retain(|row| row.urgent_flag_count > 0),
            "no" => items.retain(|row| row.urgent_flag_count == 0),
            _ => {}
        }
    }

    // Sort by completion timestamp descending.
    items.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("category", &params.category.unwrap_or_default());
    context.insert("probable_dsm5", &params.probable_dsm5.unwrap_or_default());
    context.insert(
        "has_urgent_flag",
        &params.has_urgent_flag.unwrap_or_default(),
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
