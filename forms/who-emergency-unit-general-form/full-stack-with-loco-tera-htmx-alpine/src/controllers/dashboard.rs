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
    encounter_status: Option<String>,
    triage_category: Option<String>,
    disposition: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the emergency-unit dashboard with filters.
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
                || row.hospital_registration_number.to_lowercase().contains(&term)
                || row.chief_complaint.to_lowercase().contains(&term)
        });
    }

    if let Some(ref s) = params.encounter_status {
        if !s.is_empty() {
            items.retain(|row| row.encounter_status == *s);
        }
    }
    if let Some(ref t) = params.triage_category {
        if !t.is_empty() {
            items.retain(|row| row.triage_category == *t);
        }
    }
    if let Some(ref d) = params.disposition {
        if !d.is_empty() {
            items.retain(|row| row.disposition == *d);
        }
    }
    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.urgent_flag_count + row.high_flag_count > 0),
            "no" => items.retain(|row| row.urgent_flag_count + row.high_flag_count == 0),
            _ => {}
        }
    }

    items.sort_by(|a, b| b.date_of_arrival.cmp(&a.date_of_arrival));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("encounter_status", &params.encounter_status.unwrap_or_default());
    context.insert("triage_category", &params.triage_category.unwrap_or_default());
    context.insert("disposition", &params.disposition.unwrap_or_default());
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
