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
    fitness_band: Option<String>,
    airline_iata_code: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the airline-medical-desk dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<CaseRow> = models.iter().filter_map(CaseRow::from_model).collect();

    // Server-side search across passenger name, flight number, and diagnosis.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.passenger_name.to_lowercase().contains(&term)
                || row.outbound_flight_number.to_lowercase().contains(&term)
                || row.primary_diagnosis.to_lowercase().contains(&term)
        });
    }

    if let Some(ref band) = params.fitness_band {
        if !band.is_empty() {
            items.retain(|row| row.fitness_band == *band);
        }
    }

    if let Some(ref iata) = params.airline_iata_code {
        if !iata.is_empty() {
            items.retain(|row| row.airline_iata_code == *iata);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by outbound date descending (most recent first).
    items.sort_by(|a, b| b.outbound_date.cmp(&a.outbound_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("fitness_band", &params.fitness_band.unwrap_or_default());
    context.insert(
        "airline_iata_code",
        &params.airline_iata_code.unwrap_or_default(),
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
