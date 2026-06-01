use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::EmployeeRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    completion_status: Option<String>,
    overall_risk: Option<String>,
    department: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the HR dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<EmployeeRow> = models.iter().filter_map(EmployeeRow::from_model).collect();

    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.first_name.to_lowercase().contains(&term)
                || row.last_name.to_lowercase().contains(&term)
                || row.email.to_lowercase().contains(&term)
                || row.job_title.to_lowercase().contains(&term)
        });
    }

    if let Some(ref status) = params.completion_status {
        if !status.is_empty() {
            items.retain(|row| row.completion_status == *status);
        }
    }

    if let Some(ref risk) = params.overall_risk {
        if !risk.is_empty() {
            items.retain(|row| row.overall_risk == *risk);
        }
    }

    if let Some(ref dept) = params.department {
        if !dept.is_empty() {
            items.retain(|row| row.department == *dept);
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.high_priority_flag_count > 0),
            "no" => items.retain(|row| row.high_priority_flag_count == 0),
            _ => {}
        }
    }

    items.sort_by(|a, b| b.start_date.cmp(&a.start_date));

    let total = items.len();
    let mut context = Context::new();
    context.insert("employees", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "completion_status",
        &params.completion_status.unwrap_or_default(),
    );
    context.insert("overall_risk", &params.overall_risk.unwrap_or_default());
    context.insert("department", &params.department.unwrap_or_default());
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
