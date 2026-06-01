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
    triage_category: Option<String>,
    disposition: Option<String>,
    has_urgent: Option<String>,
}

/// GET /dashboard -- render the trauma dashboard with filters.
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
            row.patient_name.to_lowercase().contains(&term)
                || row.chief_complaint.to_lowercase().contains(&term)
        });
    }

    if let Some(ref tc) = params.triage_category {
        if !tc.is_empty() {
            items.retain(|row| row.triage_category == *tc);
        }
    }

    if let Some(ref dp) = params.disposition {
        if !dp.is_empty() {
            items.retain(|row| row.disposition == *dp);
        }
    }

    if let Some(ref hu) = params.has_urgent {
        match hu.as_str() {
            "yes" => items.retain(|row| row.urgent_flag_count > 0),
            "no" => items.retain(|row| row.urgent_flag_count == 0),
            _ => {}
        }
    }

    items.sort_by(|a, b| {
        b.date_of_arrival
            .cmp(&a.date_of_arrival)
            .then(b.time_of_arrival.cmp(&a.time_of_arrival))
    });

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "triage_category",
        &params.triage_category.unwrap_or_default(),
    );
    context.insert("disposition", &params.disposition.unwrap_or_default());
    context.insert("has_urgent", &params.has_urgent.unwrap_or_default());

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
