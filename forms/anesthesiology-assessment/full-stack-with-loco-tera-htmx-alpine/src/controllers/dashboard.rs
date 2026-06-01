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
    overall_risk: Option<String>,
    asa_class: Option<String>,
    surgery_grade: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the anaesthetist dashboard with filters.
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
                || row.patient_nhs_number.to_lowercase().contains(&term)
                || row.procedure_name.to_lowercase().contains(&term)
        });
    }

    if let Some(ref risk) = params.overall_risk {
        if !risk.is_empty() {
            items.retain(|row| row.overall_risk == *risk);
        }
    }

    if let Some(ref asa) = params.asa_class {
        if !asa.is_empty() {
            items.retain(|row| row.asa_class == *asa);
        }
    }

    if let Some(ref grade) = params.surgery_grade {
        if !grade.is_empty() {
            items.retain(|row| row.surgery_grade == *grade);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| (row.urgent_flag_count + row.high_priority_flag_count) > 0),
            "no" => items.retain(|row| (row.urgent_flag_count + row.high_priority_flag_count) == 0),
            _ => {}
        }
    }

    items.sort_by(|a, b| b.surgery_date.cmp(&a.surgery_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("cases", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("overall_risk", &params.overall_risk.unwrap_or_default());
    context.insert("asa_class", &params.asa_class.unwrap_or_default());
    context.insert("surgery_grade", &params.surgery_grade.unwrap_or_default());
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
