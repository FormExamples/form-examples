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
    composite_priority: Option<String>,
    issue_category: Option<String>,
    environment: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the issue-tracker dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<CaseRow> = models.iter().filter_map(CaseRow::from_model).collect();

    // Server-side search across reporter name, system name, and chief
    // complaint summary.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.reporter_name.to_lowercase().contains(&term)
                || row.system_name.to_lowercase().contains(&term)
                || row.cc_summary.to_lowercase().contains(&term)
        });
    }

    if let Some(ref band) = params.composite_priority {
        if !band.is_empty() {
            items.retain(|row| row.composite_priority == *band);
        }
    }

    if let Some(ref cat) = params.issue_category {
        if !cat.is_empty() {
            items.retain(|row| row.issue_category == *cat);
        }
    }

    if let Some(ref env) = params.environment {
        if !env.is_empty() {
            items.retain(|row| row.environment == *env);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by reported-at descending (most recent first).
    items.sort_by(|a, b| b.reported_at.cmp(&a.reported_at));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "composite_priority",
        &params.composite_priority.unwrap_or_default(),
    );
    context.insert("issue_category", &params.issue_category.unwrap_or_default());
    context.insert("environment", &params.environment.unwrap_or_default());
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
