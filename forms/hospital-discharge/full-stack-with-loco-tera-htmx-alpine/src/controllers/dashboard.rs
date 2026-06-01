use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::DischargeRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    completeness_level: Option<String>,
    discharge_destination: Option<String>,
    specialty: Option<String>,
    has_urgent_flags: Option<String>,
}

/// GET /dashboard -- render the discharge-summary dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<DischargeRow> = models.iter().filter_map(DischargeRow::from_model).collect();

    // Server-side search across patient name, NHS number, ward, and consultant.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.patient_name.to_lowercase().contains(&term)
                || row.nhs_number.to_lowercase().contains(&term)
                || row.ward.to_lowercase().contains(&term)
                || row.consultant.to_lowercase().contains(&term)
        });
    }

    if let Some(ref level) = params.completeness_level {
        if !level.is_empty() {
            items.retain(|row| row.completeness_level == *level);
        }
    }

    if let Some(ref dest) = params.discharge_destination {
        if !dest.is_empty() {
            items.retain(|row| row.discharge_destination == *dest);
        }
    }

    if let Some(ref spec) = params.specialty {
        if !spec.is_empty() {
            items.retain(|row| row.specialty == *spec);
        }
    }

    if let Some(ref hf) = params.has_urgent_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.urgent_flag_count > 0),
            "no" => items.retain(|row| row.urgent_flag_count == 0),
            _ => {}
        }
    }

    // Sort by discharge date descending (most recent first).
    items.sort_by(|a, b| b.discharge_date.cmp(&a.discharge_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("discharges", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "completeness_level",
        &params.completeness_level.unwrap_or_default(),
    );
    context.insert(
        "discharge_destination",
        &params.discharge_destination.unwrap_or_default(),
    );
    context.insert("specialty", &params.specialty.unwrap_or_default());
    context.insert(
        "has_urgent_flags",
        &params.has_urgent_flags.unwrap_or_default(),
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
