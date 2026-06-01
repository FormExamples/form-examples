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
    grade: Option<String>,
    first_language: Option<String>,
    country_of_training: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the examiner dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<CaseRow> = models.iter().filter_map(CaseRow::from_model).collect();

    // Server-side search across candidate name, candidate id, and examiner.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.candidate_name.to_lowercase().contains(&term)
                || row.candidate_id.to_lowercase().contains(&term)
                || row.examiner_name.to_lowercase().contains(&term)
        });
    }

    if let Some(ref grade) = params.grade {
        if !grade.is_empty() {
            items.retain(|row| row.grade == *grade);
        }
    }

    if let Some(ref lang) = params.first_language {
        if !lang.is_empty() {
            items.retain(|row| row.first_language == *lang);
        }
    }

    if let Some(ref country) = params.country_of_training {
        if !country.is_empty() {
            items.retain(|row| row.country_of_training == *country);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by test date descending (most recent first).
    items.sort_by(|a, b| b.test_date.cmp(&a.test_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("grade", &params.grade.unwrap_or_default());
    context.insert(
        "first_language",
        &params.first_language.unwrap_or_default(),
    );
    context.insert(
        "country_of_training",
        &params.country_of_training.unwrap_or_default(),
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
