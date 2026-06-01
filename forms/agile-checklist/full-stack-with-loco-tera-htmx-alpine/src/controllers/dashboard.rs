use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::AssessmentRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    maturity: Option<String>,
    role: Option<String>,
    period: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the agile-checklist dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<AssessmentRow> =
        models.iter().filter_map(AssessmentRow::from_model).collect();

    // Server-side search across respondent name, team, and organisation.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.respondent_name.to_lowercase().contains(&term)
                || row.team.to_lowercase().contains(&term)
                || row.organisation.to_lowercase().contains(&term)
        });
    }

    if let Some(ref m) = params.maturity {
        if !m.is_empty() {
            items.retain(|row| row.maturity == *m);
        }
    }

    if let Some(ref r) = params.role {
        if !r.is_empty() {
            items.retain(|row| row.respondent_role == *r);
        }
    }

    if let Some(ref p) = params.period {
        if !p.is_empty() {
            items.retain(|row| row.assessment_period == *p);
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
    context.insert("assessments", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert("maturity", &params.maturity.unwrap_or_default());
    context.insert("role", &params.role.unwrap_or_default());
    context.insert("period", &params.period.unwrap_or_default());
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
