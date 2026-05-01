//! HTTP routes for the UK MAT B1 assessment.
//!
//! Endpoints:
//!
//! - `GET  /`                          → landing
//! - `POST /assessment/new`            → create a new assessment, redirect
//! - `GET  /assessment/{id}`           → single-page wizard
//! - `POST /assessment/{id}/submit`    → save form data, redirect to report
//! - `GET  /assessment/{id}/report`    → render validated report

use std::collections::HashMap;
use std::sync::Arc;

use axum::{
    extract::{Form, Path},
    response::{Html, IntoResponse, Redirect, Response},
    routing::{get, post},
    Extension, Router,
};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::types::AssessmentData;
use crate::views::assessment::{build_assessment_context, build_report_context};
use crate::Store;

/// GET / — landing page.
async fn landing(Extension(tera): Extension<Arc<Tera>>) -> Response {
    let context = Context::new();
    render(&tera, "landing.html.tera", &context)
}

/// POST /assessment/new — create a new assessment, redirect to its form.
async fn new_assessment(Extension(store): Extension<Store>) -> Redirect {
    let id = Uuid::new_v4();
    let mut guard = store.lock().expect("store poisoned");
    guard.insert(id, AssessmentData::default());
    Redirect::to(&format!("/assessment/{id}"))
}

/// GET /assessment/{id} — single-page wizard.
async fn show(
    Path(id): Path<Uuid>,
    Extension(tera): Extension<Arc<Tera>>,
    Extension(store): Extension<Store>,
) -> Response {
    let data = {
        let guard = store.lock().expect("store poisoned");
        guard.get(&id).cloned().unwrap_or_default()
    };
    let context = build_assessment_context(&data, id);
    render(&tera, "assessment/index.html.tera", &context)
}

/// POST /assessment/{id}/submit — save raw form data, redirect to report.
async fn submit(
    Path(id): Path<Uuid>,
    Extension(store): Extension<Store>,
    Form(form): Form<HashMap<String, String>>,
) -> Redirect {
    let data = form_to_assessment_data(&form);
    {
        let mut guard = store.lock().expect("store poisoned");
        guard.insert(id, data);
    }
    Redirect::to(&format!("/assessment/{id}/report"))
}

/// GET /assessment/{id}/report — render the validated report.
async fn report(
    Path(id): Path<Uuid>,
    Extension(tera): Extension<Arc<Tera>>,
    Extension(store): Extension<Store>,
) -> Response {
    let data = {
        let guard = store.lock().expect("store poisoned");
        guard.get(&id).cloned().unwrap_or_default()
    };
    let context = build_report_context(&data, id);
    render(&tera, "assessment/report.html.tera", &context)
}

/// Map a flat HashMap (from `application/x-www-form-urlencoded`) onto our
/// strongly-typed `AssessmentData`. Unknown / blank fields fall back to
/// defaults.
fn form_to_assessment_data(form: &HashMap<String, String>) -> AssessmentData {
    let mut data = AssessmentData::default();

    let s = |k: &str| form.get(k).cloned().unwrap_or_default();

    // ─── Patient identification ─────────────────────────
    data.patient_identification.patient_name = s("patientName");
    data.patient_identification.date_of_birth = s("dateOfBirth");
    data.patient_identification.nhs_number = s("nhsNumber");

    // ─── Certificate type branch ────────────────────────
    data.certificate_type = s("certificateType");

    // ─── Part A — Pre-confinement ───────────────────────
    data.pre_confinement.expected_date_of_confinement = s("preEwc");
    data.pre_confinement.examination_date = s("preExamDate");

    // ─── Part B — Post-confinement ──────────────────────
    data.post_confinement.actual_date_of_birth = s("postActualDob");
    data.post_confinement.expected_date_of_confinement = s("postEwc");

    // ─── Issuer ─────────────────────────────────────────
    data.issuer.issuer_type = s("issuerType");

    // Doctor branch
    data.issuer.doctor.doctor_name = s("doctorName");
    data.issuer.doctor.practice_name = s("practiceName");
    data.issuer.doctor.practice_address = s("practiceAddress");
    data.issuer.doctor.stamp_applied = s("stampApplied");

    // Midwife branch
    data.issuer.midwife.midwife_name = s("midwifeName");
    data.issuer.midwife.nmc_pin = s("nmcPin");
    data.issuer.midwife.nmc_expiry_date = s("nmcExpiryDate");

    // Certificate-level
    data.issuer.certificate_number = s("certificateNumber");
    data.issuer.issue_date = s("issueDate");
    data.issuer.is_duplicate = s("isDuplicate");
    data.issuer.duplicate_marker_applied = s("duplicateMarkerApplied");
    data.issuer.completed_in_ink = s("completedInInk");

    data
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
        .route("/assessment/new", post(new_assessment))
        .route("/assessment/{id}", get(show))
        .route("/assessment/{id}/submit", post(submit))
        .route("/assessment/{id}/report", get(report))
}
