use std::sync::Arc;

use axum::{
    extract::{Form, Path},
    response::{Html, IntoResponse, Redirect, Response},
    routing::{get, post},
    Extension, Router,
};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::views::assessment::{build_assessment_context, build_report_context, stub_assessments};

/// GET / — landing page
async fn landing(Extension(tera): Extension<Arc<Tera>>) -> Response {
    let context = Context::new();
    render(&tera, "landing.html.tera", &context)
}

/// GET /assessments — list stub assessments
async fn index(Extension(tera): Extension<Arc<Tera>>) -> Response {
    let items = stub_assessments();
    let mut context = Context::new();
    context.insert("assessments", &items);
    render(&tera, "assessment/index.html.tera", &context)
}

/// POST /assessments/new — redirect to a fresh assessment UUID
async fn new_assessment() -> Redirect {
    let id = Uuid::new_v4();
    Redirect::to(&format!("/assessments/{id}"))
}

/// GET /assessments/{id} — show the single-page assessment form
async fn show(Path(id): Path<Uuid>, Extension(tera): Extension<Arc<Tera>>) -> Response {
    let context = build_assessment_context(id);
    render(&tera, "assessment/show.html.tera", &context)
}

/// POST /assessments/{id}/submit — accept form POST, redirect to report
async fn submit(
    Path(id): Path<Uuid>,
    Form(_data): Form<serde_json::Value>,
) -> Redirect {
    Redirect::to(&format!("/assessments/{id}/report"))
}

/// GET /assessments/{id}/report — render outcome report
async fn report(Path(id): Path<Uuid>, Extension(tera): Extension<Arc<Tera>>) -> Response {
    let context = build_report_context(id);
    render(&tera, "assessment/report.html.tera", &context)
}

/// Render a Tera template and return an HTML response (or 500 on error).
fn render(tera: &Tera, template: &str, context: &Context) -> Response {
    match tera.render(template, context) {
        Ok(html) => Html(html).into_response(),
        Err(e) => {
            tracing::error!("Template error rendering {template}: {e}");
            (
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                format!("Template error: {e}"),
            )
                .into_response()
        }
    }
}

pub fn router() -> Router {
    Router::new()
        .route("/", get(landing))
        .route("/assessments", get(index))
        .route("/assessments/new", post(new_assessment))
        .route("/assessments/{id}", get(show))
        .route("/assessments/{id}/submit", post(submit))
        .route("/assessments/{id}/report", get(report))
}
