use std::sync::Arc;

use axum::{Extension, debug_handler};
use loco_rs::prelude::*;
use serde::Deserialize;
use tera::{Context, Tera};

use crate::models::assessments::list_completed;
use crate::views::dashboard::ReferralRow;

#[derive(Debug, Deserialize)]
struct DashboardParams {
    search: Option<String>,
    mode_of_transfer: Option<String>,
    complete: Option<String>,
    has_flags: Option<String>,
}

/// GET /dashboard -- render the referral dashboard with filters.
#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = list_completed(&ctx.db).await?;

    let mut items: Vec<ReferralRow> = models.iter().filter_map(ReferralRow::from_model).collect();

    // Server-side search across patient name and diagnosis.
    if let Some(ref term) = params.search {
        let term = term.to_lowercase();
        items.retain(|row| {
            row.patient_last_name.to_lowercase().contains(&term)
                || row.patient_first_name.to_lowercase().contains(&term)
                || row.primary_diagnosis.to_lowercase().contains(&term)
                || row.chief_complaint.to_lowercase().contains(&term)
        });
    }

    if let Some(ref mode) = params.mode_of_transfer {
        if !mode.is_empty() {
            items.retain(|row| row.mode_of_transfer == *mode);
        }
    }

    if let Some(ref c) = params.complete {
        match c.as_str() {
            "yes" => items.retain(|row| row.complete),
            "no" => items.retain(|row| !row.complete),
            _ => {}
        }
    }

    if let Some(ref hf) = params.has_flags {
        match hf.as_str() {
            "yes" => items.retain(|row| row.urgent_flag_count + row.high_flag_count > 0),
            "no" => items.retain(|row| row.urgent_flag_count + row.high_flag_count == 0),
            _ => {}
        }
    }

    // Sort by departure datetime descending (most recent first).
    items.sort_by(|a, b| b.departure_date_time.cmp(&a.departure_date_time));

    let total = items.len();
    let mut context = Context::new();
    context.insert("referrals", &items);
    context.insert("total", &total);
    context.insert("search", &params.search.unwrap_or_default());
    context.insert(
        "mode_of_transfer",
        &params.mode_of_transfer.unwrap_or_default(),
    );
    context.insert("complete", &params.complete.unwrap_or_default());
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
