use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::FitNoteRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    fitness_category: Option<String>,
    period_compliance: Option<String>,
    recommendation: Option<String>,
    clinician_profession: Option<String>,
    is_valid: Option<String>,
}

/// GET /dashboard -- render the fit-note dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<FitNoteRow> = models.iter().filter_map(FitNoteRow::from_model).collect();

    // Server-side search across patient name, NHS number, clinician name, diagnosis.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.patient_name.to_lowercase().contains(&term)
                || row.patient_nhs_number.to_lowercase().contains(&term)
                || row.clinician_name.to_lowercase().contains(&term)
                || row.diagnosis_text.to_lowercase().contains(&term)
        });
    }

    if let Some(ref cat) = params.fitness_category {
        if !cat.is_empty() {
            items.retain(|row| row.fitness_category == *cat);
        }
    }

    if let Some(ref pc) = params.period_compliance {
        if !pc.is_empty() {
            items.retain(|row| row.period_compliance == *pc);
        }
    }

    if let Some(ref rec) = params.recommendation {
        if !rec.is_empty() {
            items.retain(|row| row.recommendation == *rec);
        }
    }

    if let Some(ref prof) = params.clinician_profession {
        if !prof.is_empty() {
            items.retain(|row| row.clinician_profession == *prof);
        }
    }

    if let Some(ref v) = params.is_valid {
        if !v.is_empty() {
            items.retain(|row| row.is_valid == *v);
        }
    }

    // Sort by assessment date descending (most recent first).
    items.sort_by(|a, b| b.assessment_date.cmp(&a.assessment_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("fit_notes", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "fitness_category",
        &params.fitness_category.unwrap_or_default(),
    );
    context.insert(
        "period_compliance",
        &params.period_compliance.unwrap_or_default(),
    );
    context.insert("recommendation", &params.recommendation.unwrap_or_default());
    context.insert(
        "clinician_profession",
        &params.clinician_profession.unwrap_or_default(),
    );
    context.insert("is_valid", &params.is_valid.unwrap_or_default());

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
