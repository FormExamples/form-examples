use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::ResponderRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    overall_fitness: Option<String>,
    overall_risk: Option<String>,
    role_type: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the responder dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<ResponderRow> = models.iter().filter_map(ResponderRow::from_model).collect();

    // Server-side search across responder name and employer.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.first_name.to_lowercase().contains(&term)
                || row.last_name.to_lowercase().contains(&term)
                || row.employer_organisation.to_lowercase().contains(&term)
        });
    }

    if let Some(ref fitness) = params.overall_fitness {
        if !fitness.is_empty() {
            items.retain(|row| row.overall_fitness == *fitness);
        }
    }

    if let Some(ref risk) = params.overall_risk {
        if !risk.is_empty() {
            items.retain(|row| row.overall_risk == *risk);
        }
    }

    if let Some(ref role) = params.role_type {
        if !role.is_empty() {
            items.retain(|row| row.role_type == *role);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    // Sort by assessment date descending (most recent first).
    items.sort_by(|a, b| b.assessment_date.cmp(&a.assessment_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("responders", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "overall_fitness",
        &params.overall_fitness.unwrap_or_default(),
    );
    context.insert("overall_risk", &params.overall_risk.unwrap_or_default());
    context.insert("role_type", &params.role_type.unwrap_or_default());
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
