//! HTTP routes for the DVLA V1 (vision) assessment.
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

    // ─── Personal Details ──────────────────────────────
    data.personal_details.title = s("title");
    data.personal_details.full_name = s("fullName");
    data.personal_details.date_of_birth = s("dateOfBirth");
    data.personal_details.address = s("address");
    data.personal_details.postcode = s("postcode");
    data.personal_details.email = s("email");
    data.personal_details.contact_number = s("contactNumber");
    data.personal_details.change_of_details = s("changeOfDetails");

    // ─── Healthcare Professionals ──────────────────────
    data.healthcare_professionals.gp.name = s("gpName");
    data.healthcare_professionals.gp.surgery_name = s("gpSurgeryName");
    data.healthcare_professionals.gp.address = s("gpAddress");
    data.healthcare_professionals.gp.town = s("gpTown");
    data.healthcare_professionals.gp.postcode = s("gpPostcode");
    data.healthcare_professionals.gp.contact_number = s("gpContactNumber");
    data.healthcare_professionals.gp.email = s("gpEmail");
    data.healthcare_professionals.gp.date_last_seen = s("gpDateLastSeen");

    data.healthcare_professionals.consultant.name = s("consultantName");
    data.healthcare_professionals.consultant.speciality = s("consultantSpeciality");
    data.healthcare_professionals.consultant.department = s("consultantDepartment");
    data.healthcare_professionals.consultant.hospital_name = s("hospitalName");
    data.healthcare_professionals.consultant.address = s("consultantAddress");
    data.healthcare_professionals.consultant.town = s("consultantTown");
    data.healthcare_professionals.consultant.postcode = s("consultantPostcode");
    data.healthcare_professionals.consultant.contact_number = s("consultantContactNumber");
    data.healthcare_professionals.consultant.email = s("consultantEmail");
    data.healthcare_professionals.consultant.date_last_seen = s("consultantDateLastSeen");

    // ─── Q1 Eyesight Standards ─────────────────────────
    data.eyesight_standards.meets_standard = s("meetsStandard");

    // ─── Q2 Vision in Both Eyes ────────────────────────
    data.vision_in_both_eyes.has_vision_in_both_eyes = s("hasVisionInBothEyes");
    data.vision_in_both_eyes.which_eye = s("whichEye");
    data.vision_in_both_eyes.duration = s("monocularDuration");
    data.vision_in_both_eyes.adaptation = s("monocularAdaptation");
    data.vision_in_both_eyes.monocular_declaration_confirmed = b("monocularDeclarationConfirmed");

    // ─── Q3 Field of Vision ────────────────────────────
    data.field_of_vision.has_problem = s("fieldHasProblem");
    data.field_of_vision.caused_solely_by_eye_condition = s("fieldCausedByEyeCondition");
    data.field_of_vision.cause = s("fieldCause");
    data.field_of_vision.cause_other_details = s("fieldCauseOtherDetails");

    // ─── Q4 Glaucoma ───────────────────────────────────
    data.glaucoma.has_condition = s("glaucomaHasCondition");
    data.glaucoma.which_eyes = s("glaucomaWhichEyes");

    // ─── Q5 Retinitis Pigmentosa ───────────────────────
    data.retinitis_pigmentosa.has_condition = s("rpHasCondition");
    data.retinitis_pigmentosa.which_eyes = s("rpWhichEyes");

    // ─── Q6 Laser Treatment ────────────────────────────
    data.laser_treatment.has_had_treatment = s("laserHasHadTreatment");
    data.laser_treatment.left_eye_first_date = s("laserLeftFirstDate");
    data.laser_treatment.right_eye_first_date = s("laserRightFirstDate");
    data.laser_treatment.left_eye_last_date = s("laserLeftLastDate");
    data.laser_treatment.right_eye_last_date = s("laserRightLastDate");

    // ─── Q7 Blepharospasm ──────────────────────────────
    data.blepharospasm.has_condition = s("blepharospasmHasCondition");
    data.blepharospasm.which_eyes = s("blepharospasmWhichEyes");
    data.blepharospasm.has_had_treatment = s("blepharospasmHasHadTreatment");
    data.blepharospasm.adequately_controlled = s("blepharospasmAdequatelyControlled");

    // ─── Q8 Night Blindness ────────────────────────────
    data.night_blindness.has_condition = s("nightBlindnessHasCondition");
    data.night_blindness.which_eyes = s("nightBlindnessWhichEyes");

    // ─── Q9 Double Vision ──────────────────────────────
    data.double_vision.has_condition = s("doubleVisionHasCondition");
    data.double_vision.controlled = s("doubleVisionControlled");
    data.double_vision.same_for_six_months_or_more = s("doubleVisionSameForSixMonths");
    data.double_vision.double_vision_declaration_confirmed = b("doubleVisionDeclarationConfirmed");
    data.double_vision.declaration_signature_name = s("doubleVisionDeclarationSignatureName");
    data.double_vision.declaration_date = s("doubleVisionDeclarationDate");

    // ─── Q10 Other Vision Conditions ───────────────────
    data.other_vision_conditions.has_other = s("otherVisionHasOther");
    data.other_vision_conditions.details = s("otherVisionDetails");

    // ─── Q11 Recent Contact ────────────────────────────
    data.recent_contact.had_contact = s("recentContactHadContact");
    data.recent_contact.date_of_contact = s("recentContactDate");

    // ─── Authorisation ─────────────────────────────────
    data.authorisation.declaration_confirmed = b("authorisationDeclarationConfirmed");
    data.authorisation.name = s("authorisationName");
    data.authorisation.signature = s("authorisationSignature");
    data.authorisation.date = s("authorisationDate");
    data.authorisation.authorise_electronic_correspondence = s("authoriseElectronicCorrespondence");
    data.authorisation.contact_preference_from_healthcare_professional =
        s("contactPreferenceFromHealthcareProfessional");
    data.authorisation.contact_preference_from_dvla = s("contactPreferenceFromDvla");

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
