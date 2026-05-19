//! HTTP routes for the UK Statement of Fitness for Work (Med 3 / fit note).
//!
//! Endpoints:
//!
//! - `GET  /`                          → landing page
//! - `POST /fit-note/new`              → create a new draft, redirect
//! - `GET  /fit-note/{id}`             → single-page ten-step wizard
//! - `POST /fit-note/{id}/submit`      → save form data, redirect to report
//! - `GET  /fit-note/{id}/report`      → render graded fit-note report

use std::collections::HashMap;
use std::sync::Arc;

use axum::{
    Extension, Router,
    extract::{Form, Path},
    response::{Html, IntoResponse, Redirect, Response},
    routing::{get, post},
};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::Store;
use crate::grading::types::FitNote;
use crate::views::fit_note::{build_form_context, build_report_context};

/// GET / — landing page.
async fn landing(Extension(tera): Extension<Arc<Tera>>) -> Response {
    let context = Context::new();
    render(&tera, "home/index.html.tera", &context)
}

/// POST /fit-note/new — create a new draft and redirect to its wizard.
async fn new_fit_note(Extension(store): Extension<Store>) -> Redirect {
    let id = Uuid::new_v4();
    let mut guard = store.lock().expect("store poisoned");
    guard.insert(id, FitNote::default());
    Redirect::to(&format!("/fit-note/{id}"))
}

/// GET /fit-note/{id} — ten-step single-page wizard.
async fn show(
    Path(id): Path<Uuid>,
    Extension(tera): Extension<Arc<Tera>>,
    Extension(store): Extension<Store>,
) -> Response {
    let data = {
        let guard = store.lock().expect("store poisoned");
        guard.get(&id).cloned().unwrap_or_default()
    };
    let context = build_form_context(&data, id);
    render(&tera, "fit_note/form.html.tera", &context)
}

/// POST /fit-note/{id}/submit — persist raw form data, redirect to report.
async fn submit(
    Path(id): Path<Uuid>,
    Extension(store): Extension<Store>,
    Form(form): Form<HashMap<String, String>>,
) -> Redirect {
    let data = form_to_fit_note(&form);
    {
        let mut guard = store.lock().expect("store poisoned");
        guard.insert(id, data);
    }
    Redirect::to(&format!("/fit-note/{id}/report"))
}

/// GET /fit-note/{id}/report — render the graded report.
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
    render(&tera, "fit_note/report.html.tera", &context)
}

/// Map a flat `HashMap` (from `application/x-www-form-urlencoded`) onto
/// our strongly-typed `FitNote`. Unknown / blank fields fall back to
/// defaults.
fn form_to_fit_note(form: &HashMap<String, String>) -> FitNote {
    let mut data = FitNote::default();
    let s = |k: &str| form.get(k).cloned().unwrap_or_default();
    let opt_i64 = |k: &str| form.get(k).and_then(|v| v.parse::<i64>().ok());

    // ─── Step 1 — Issuer (clinician + medical practice) ──────
    data.clinician.name = s("clinicianName");
    data.clinician.profession = s("clinicianProfession");
    data.clinician.registration_body = s("clinicianRegistrationBody");
    data.clinician.registration_number = s("clinicianRegistrationNumber");
    data.clinician.is_private_practice = s("clinicianIsPrivatePractice");

    data.medical_practice.name = s("medicalPracticeName");
    data.medical_practice.postal_address_as_full_text = s("medicalPracticePostalAddress");
    data.medical_practice.postcode = s("medicalPracticePostcode");
    data.medical_practice.ods_code = s("medicalPracticeOdsCode");
    data.medical_practice.setting = s("medicalPracticeSetting");

    // ─── Step 2 — Patient ────────────────────────────────────
    data.patient.name = s("patientName");
    data.patient.birth_date = s("patientBirthDate");
    data.patient.united_kingdom_nhs_number = s("patientNhsNumber");
    data.patient.postal_address_as_full_text = s("patientPostalAddress");
    data.patient.postcode = s("patientPostcode");
    data.patient.employer_name = s("patientEmployerName");
    data.patient.occupation = s("patientOccupation");

    // ─── Step 3 — Assessment ─────────────────────────────────
    data.assessment_date = s("assessmentDate");
    data.assessment_method = s("assessmentMethod");
    data.general_fitness_considered = s("generalFitnessConsidered");

    // ─── Step 4 — Diagnosis ──────────────────────────────────
    data.diagnosis_text = s("diagnosisText");
    data.diagnosis_snomed_code = s("diagnosisSnomedCode");
    data.diagnosis_snomed_display = s("diagnosisSnomedDisplay");
    data.diagnosis_category = s("diagnosisCategory");
    data.condition_first_recorded_date = s("conditionFirstRecordedDate");
    data.is_automatic_disability = s("isAutomaticDisability");
    data.is_non_medical = s("isNonMedical");

    // ─── Step 5 — Fitness for work ───────────────────────────
    data.fitness_for_work = s("fitnessForWork");

    // ─── Step 6 — Adaptations ────────────────────────────────
    data.adaptation_phased_return = s("adaptationPhasedReturn");
    data.adaptation_altered_hours = s("adaptationAlteredHours");
    data.adaptation_amended_duties = s("adaptationAmendedDuties");
    data.adaptation_workplace_adaptations = s("adaptationWorkplaceAdaptations");

    // ─── Step 7 — Comments ───────────────────────────────────
    data.comments = s("comments");

    // ─── Step 8 — Period ─────────────────────────────────────
    data.period_type = s("periodType");
    data.period_duration_value = opt_i64("periodDurationValue");
    data.period_duration_unit = s("periodDurationUnit");
    data.period_from = s("periodFrom");
    data.period_to = s("periodTo");

    // ─── Step 9 — Follow-up ──────────────────────────────────
    data.will_assess_again = s("willAssessAgain");
    data.planned_review_date = s("plannedReviewDate");

    // ─── Step 10 — Sign-off ──────────────────────────────────
    data.issued_at = s("issuedAt");
    data.issued_via = s("issuedVia");
    data.issue_setting = s("issueSetting");
    data.safeguarding_concern = s("safeguardingConcern");
    data.safeguarding_notes = s("safeguardingNotes");

    data
}

/// Render a Tera template, returning a 500 if it fails.
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
        .route("/fit-note/new", post(new_fit_note))
        .route("/fit-note/{id}", get(show))
        .route("/fit-note/{id}/submit", post(submit))
        .route("/fit-note/{id}/report", get(report))
}
