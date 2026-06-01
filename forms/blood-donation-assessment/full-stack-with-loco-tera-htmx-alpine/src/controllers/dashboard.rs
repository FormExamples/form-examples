use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::DonorRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    eligibility_status: Option<String>,
    donor_type: Option<String>,
    sex: Option<String>,
    has_urgent_flags: Option<String>,
}

/// GET /dashboard -- render the donor-session dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;
    let mut items: Vec<DonorRow> = models.iter().filter_map(DonorRow::from_model).collect();

    // Server-side search across donor name and date of birth.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.donor_name.to_lowercase().contains(&term)
                || row.date_of_birth.to_lowercase().contains(&term)
        });
    }

    if let Some(ref status) = params.eligibility_status {
        if !status.is_empty() {
            items.retain(|row| row.eligibility_status == *status);
        }
    }

    if let Some(ref dt) = params.donor_type {
        if !dt.is_empty() {
            items.retain(|row| row.donor_type == *dt);
        }
    }

    if let Some(ref s) = params.sex {
        if !s.is_empty() {
            items.retain(|row| row.sex == *s);
        }
    }

    if let Some(ref hf) = params.has_urgent_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.urgent_flag_count > 0),
            "no" => items.retain(|row| row.urgent_flag_count == 0),
            _ => {}
        }
    }

    // Newest first by ID is good enough for the in-memory dashboard.
    items.sort_by(|a, b| b.id.cmp(&a.id));

    let total = items.len();
    let mut context = Context::new();
    context.insert("donors", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "eligibility_status",
        &params.eligibility_status.unwrap_or_default(),
    );
    context.insert("donor_type", &params.donor_type.unwrap_or_default());
    context.insert("sex", &params.sex.unwrap_or_default());
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
