//! HTTP routes for the WHO Counter-Referral Form assessment.
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
    let b = |k: &str| {
        let v = form.get(k).cloned().unwrap_or_default();
        v == "on" || v == "true" || v == "yes" || v == "1"
    };

    // ─── Step 1 — Patient Identification ──────────────────
    data.patient_identification.patient_name = s("patientName");
    data.patient_identification.date_of_birth = s("dateOfBirth");
    data.patient_identification.sex = s("sex");
    data.patient_identification.patient_contact = s("patientContact");
    data.patient_identification.emergency_contact.name = s("emergencyContactName");
    data.patient_identification
        .emergency_contact
        .contact_information = s("emergencyContactInformation");

    // ─── Step 2 — Facility Details ────────────────────────
    data.facility_details.initiating_facility.name = s("initiatingFacilityName");
    data.facility_details.initiating_facility.focal_point = s("initiatingFacilityFocalPoint");
    data.facility_details.initiating_facility.phone_number = s("initiatingFacilityPhoneNumber");
    data.facility_details.referral_date = s("referralDate");
    data.facility_details.referral_reason = s("referralReason");
    data.facility_details.acuity = s("acuity");
    data.facility_details.referral_facility.name = s("referralFacilityName");
    data.facility_details.referral_facility.focal_point = s("referralFacilityFocalPoint");
    data.facility_details.referral_facility.phone_number = s("referralFacilityPhoneNumber");
    data.facility_details
        .communication
        .discussed_with_primary_care_provider = b("discussedWithPrimaryCareProvider");
    data.facility_details
        .communication
        .discussed_with_initiating_facility = b("discussedWithInitiatingFacility");
    data.facility_details.primary_care_facility.name = s("primaryCareFacilityName");
    data.facility_details.primary_care_facility.focal_point = s("primaryCareFacilityFocalPoint");
    data.facility_details.primary_care_facility.phone_number = s("primaryCareFacilityPhoneNumber");
    data.facility_details.follow_up_timeframe = s("followUpTimeframe");

    // ─── Step 3 — Situation ───────────────────────────────
    data.situation.chief_complaint = s("chiefComplaint");
    data.situation.primary_diagnosis = s("primaryDiagnosis");
    data.situation.pregnant = s("pregnant");
    data.situation.treatments_initiated = s("treatmentsInitiated");
    data.situation.icu_stay = b("icuStay");
    data.situation.surgery = b("surgery");
    data.situation.hospitalized = b("hospitalized");

    // ─── Step 4 — Background ──────────────────────────────
    data.background.history_of_present_illness = s("historyOfPresentIllness");
    data.background.past_medical_history = s("pastMedicalHistory");
    data.background.significant_events = s("significantEvents");

    // ─── Step 5 — Assessment ──────────────────────────────
    data.assessment.final_diagnoses = s("finalDiagnoses");
    data.assessment.prognosis_and_goals_of_care = s("prognosisAndGoalsOfCare");
    data.assessment.patient_family_informed = s("patientFamilyInformed");
    data.assessment.informed_explanation = s("informedExplanation");

    // ─── Step 6 — Recommendations ─────────────────────────
    data.recommendations.follow_up_plan = s("followUpPlan");
    data.recommendations.pending_investigations = s("pendingInvestigations");
    data.recommendations.follow_up_arrangements = s("followUpArrangements");
    data.recommendations.deterioration_instructions = s("deteriorationInstructions");
    data.recommendations.contact_name = s("contactName");
    data.recommendations.contact_information = s("contactInformation");
    data.recommendations.status_flags.cognitive_impairment = b("cognitiveImpairment");
    data.recommendations.status_flags.carer_dependent = b("carerDependent");
    data.recommendations.status_flags.spinal_precautions = b("spinalPrecautions");
    data.recommendations.status_flags.weight_bearing_restrictions = b("weightBearingRestrictions");
    data.recommendations.status_flags.palliative_care = b("palliativeCare");

    // ─── Step 7 — Provider Sign-off ───────────────────────
    data.provider_sign_off.provider_name = s("providerName");
    data.provider_sign_off.signature = s("signature");
    data.provider_sign_off.signature_date = s("signatureDate");

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
