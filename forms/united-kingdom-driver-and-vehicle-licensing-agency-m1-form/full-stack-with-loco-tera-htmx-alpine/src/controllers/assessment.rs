//! HTTP routes for the DVLA M1 form.
//!
//! Endpoints:
//!
//! - `GET  /`                          → landing
//! - `POST /assessment/new`            → create a new assessment, redirect
//! - `GET  /assessment/{id}`           → single-page wizard
//! - `POST /assessment/{id}/submit`    → save form data, redirect to report
//! - `GET  /assessment/{id}/report`    → render validation report

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

/// GET /assessment/{id}/report — render the report.
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

    // Personal Details
    data.personal_details.title = s("title");
    data.personal_details.full_name = s("fullName");
    data.personal_details.date_of_birth = s("dateOfBirth");
    data.personal_details.address = s("address");
    data.personal_details.postcode = s("postcode");
    data.personal_details.email = s("email");
    data.personal_details.contact_number = s("contactNumber");
    data.personal_details.change_of_details = s("changeOfDetails");

    // GP
    data.healthcare_professionals.gp.gp_name = s("gpName");
    data.healthcare_professionals.gp.surgery_name = s("gpSurgeryName");
    data.healthcare_professionals.gp.address = s("gpAddress");
    data.healthcare_professionals.gp.town = s("gpTown");
    data.healthcare_professionals.gp.postcode = s("gpPostcode");
    data.healthcare_professionals.gp.contact_number = s("gpContactNumber");
    data.healthcare_professionals.gp.email = s("gpEmail");
    data.healthcare_professionals.gp.date_last_seen = s("gpDateLastSeen");

    // Consultant
    data.healthcare_professionals.consultant.consultant_name = s("consultantName");
    data.healthcare_professionals.consultant.speciality = s("consultantSpeciality");
    data.healthcare_professionals.consultant.department = s("consultantDepartment");
    data.healthcare_professionals.consultant.hospital_name = s("consultantHospitalName");
    data.healthcare_professionals.consultant.address = s("consultantAddress");
    data.healthcare_professionals.consultant.town = s("consultantTown");
    data.healthcare_professionals.consultant.postcode = s("consultantPostcode");
    data.healthcare_professionals.consultant.contact_number = s("consultantContactNumber");
    data.healthcare_professionals.consultant.email = s("consultantEmail");
    data.healthcare_professionals.consultant.date_last_seen = s("consultantDateLastSeen");

    // Q1
    data.diagnosis_confirmation.has_mental_health_diagnosis = s("hasMentalHealthDiagnosis");

    // Q2
    data.mental_health_conditions.anxiety_depression_without_impairment =
        s("anxietyDepressionWithoutImpairment");
    data.mental_health_conditions.anxiety_depression_with_impairment =
        s("anxietyDepressionWithImpairment");
    data.mental_health_conditions.bipolar_affective_disorder = s("bipolarAffectiveDisorder");
    data.mental_health_conditions.eating_disorder = s("eatingDisorder");
    data.mental_health_conditions.ocd_or_ptsd = s("ocdOrPtsd");
    data.mental_health_conditions.personality_disorder = s("personalityDisorder");
    data.mental_health_conditions.schizophrenia_or_psychosis = s("schizophreniaOrPsychosis");
    data.mental_health_conditions.other = s("other");
    data.mental_health_conditions.other_details = s("otherDetails");

    // Q3
    data.recent_contact.had_recent_contact = s("hadRecentContact");
    data.recent_contact.doctor_last_date = s("doctorLastDate");
    data.recent_contact.consultant_last_date = s("consultantLastDate");
    data.recent_contact.community_psychiatric_nurse_last_date =
        s("communityPsychiatricNurseLastDate");

    // Authorisation
    data.authorisation.declaration_confirmed = s("declarationConfirmed");
    data.authorisation.signatory_name = s("signatoryName");
    data.authorisation.signature_text = s("signatureText");
    data.authorisation.signature_date = s("signatureDate");
    data.authorisation.electronic_correspondence_consent = s("electronicCorrespondenceConsent");
    data.authorisation.dvla_contact_preference = s("dvlaContactPreference");
    data.authorisation.healthcare_professional_contact_preference =
        s("healthcareProfessionalContactPreference");

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
