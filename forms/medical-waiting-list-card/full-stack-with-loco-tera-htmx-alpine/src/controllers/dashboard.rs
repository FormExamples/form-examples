use std::sync::Arc;

use axum::{debug_handler, Extension};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::PatientRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    waiting_time_status: Option<String>,
    clinical_priority: Option<String>,
    specialty: Option<String>,
}

/// GET /dashboard -- render the patient table with filters applied.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<PatientRow> = models.iter().filter_map(PatientRow::from_model).collect();

    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.nhs_number.to_lowercase().contains(&term)
                || row.patient_name.to_lowercase().contains(&term)
        });
    }

    if let Some(ref status) = params.waiting_time_status {
        if !status.is_empty() {
            items.retain(|row| row.waiting_time_status == *status);
        }
    }

    if let Some(ref priority) = params.clinical_priority {
        if !priority.is_empty() {
            items.retain(|row| row.clinical_priority == *priority);
        }
    }

    if let Some(ref specialty) = params.specialty {
        if !specialty.is_empty() {
            let needle = specialty.to_lowercase();
            items.retain(|row| row.specialty.to_lowercase().contains(&needle));
        }
    }

    items.sort_by(|a, b| a.patient_name.cmp(&b.patient_name));

    let total = items.len();
    let mut context = Context::new();
    context.insert("patients", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "waiting_time_status",
        &params.waiting_time_status.unwrap_or_default(),
    );
    context.insert(
        "clinical_priority",
        &params.clinical_priority.unwrap_or_default(),
    );
    context.insert("specialty", &params.specialty.unwrap_or_default());

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
