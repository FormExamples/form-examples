use axum::{
    debug_handler,
    extract::{Path, State},
    response::{Html, IntoResponse, Redirect, Response},
    routing::{get, post},
};
use loco_rs::prelude::*;
use uuid::Uuid;

pub fn routes() -> Routes {
    Routes::new()
        .prefix("certificate")
        .add("/{id}", get(show_certificate))
        .add("/{id}/submit", post(submit_certificate))
        .add("/{id}/report", get(show_report))
}

#[debug_handler]
async fn show_certificate(
    State(_ctx): State<AppContext>,
    Path(id): Path<Uuid>,
) -> Result<Response> {
    Ok(Html(format!(
        "<h1>Certificate {id}</h1><p>Wizard renders here (Tera template).</p>"
    ))
    .into_response())
}

#[debug_handler]
async fn submit_certificate(
    State(_ctx): State<AppContext>,
    Path(id): Path<Uuid>,
) -> Result<Response> {
    Ok(Redirect::to(&format!("/certificate/{id}/report")).into_response())
}

#[debug_handler]
async fn show_report(
    State(_ctx): State<AppContext>,
    Path(id): Path<Uuid>,
) -> Result<Response> {
    Ok(Html(format!(
        "<h1>Report — Certificate {id}</h1><p>Validity report renders here.</p>"
    ))
    .into_response())
}
