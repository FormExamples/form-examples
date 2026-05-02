//! HTTP routes for the WHO Emergency First Aid Form assessment.
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
    let n = |k: &str| -> Option<f64> {
        let v = form.get(k).cloned().unwrap_or_default();
        if v.trim().is_empty() {
            None
        } else {
            v.trim().parse::<f64>().ok()
        }
    };

    // ─── Step 1 — Patient Identification ──────────────────
    data.patient_identification.patient_name = s("patientName");
    data.patient_identification.date_of_birth = s("dateOfBirth");
    data.patient_identification.age = n("age");
    data.patient_identification.sex = s("sex");
    data.patient_identification.patient_contact_information = s("patientContactInformation");
    data.patient_identification.contact_person.name = s("contactPersonName");
    data.patient_identification
        .contact_person
        .contact_information = s("contactPersonContactInformation");

    // ─── Step 2 — Referral & Transport ────────────────────
    data.referral_transport.referral_facility.name = s("referralFacilityName");
    data.referral_transport.referral_facility.focal_point = s("referralFacilityFocalPoint");
    data.referral_transport.referral_facility.phone_number = s("referralFacilityPhoneNumber");
    data.referral_transport.ambulance.name = s("ambulanceName");
    data.referral_transport.ambulance.focal_point = s("ambulanceFocalPoint");
    data.referral_transport.ambulance.phone_number = s("ambulancePhoneNumber");
    data.referral_transport.event_date_time = s("eventDateTime");
    data.referral_transport.departure_date_time = s("departureDateTime");

    // ─── Step 3 — Situation ───────────────────────────────
    data.situation.medical = b("situationMedical");
    data.situation.trauma = b("situationTrauma");
    data.situation.pregnant = s("pregnant");
    data.situation.what_happened = s("whatHappened");

    // ─── Step 4 — Background ──────────────────────────────
    data.background.past_medical_and_surgical_history = s("pastMedicalAndSurgicalHistory");
    data.background.current_medications_or_allergies = s("currentMedicationsOrAllergies");

    // ─── Step 5 — Major Bleeding (C) ──────────────────────
    data.major_bleeding.assessment_normal = b("majorBleedingAssessmentNormal");
    data.major_bleeding.assessment_findings = s("majorBleedingAssessmentFindings");
    data.major_bleeding.interventions.direct_pressure = b("majorBleedingDirectPressure");
    data.major_bleeding.interventions.deep_wound_packing = b("majorBleedingDeepWoundPacking");
    data.major_bleeding.interventions.tourniquet = b("majorBleedingTourniquet");
    data.major_bleeding.interventions.tourniquet_application_time =
        s("majorBleedingTourniquetApplicationTime");
    data.major_bleeding.interventions.uterine_massage = b("majorBleedingUterineMassage");
    data.major_bleeding.interventions.none = b("majorBleedingNone");

    // ─── Step 6 — Airway (A) ──────────────────────────────
    data.airway.assessment_normal = b("airwayAssessmentNormal");
    data.airway.assessment_findings = s("airwayAssessmentFindings");
    data.airway.interventions.neck_immobilization = b("airwayNeckImmobilization");
    data.airway.interventions.head_tilt_chin_lift = b("airwayHeadTiltChinLift");
    data.airway.interventions.jaw_thrust = b("airwayJawThrust");
    data.airway.interventions.choking_care = b("airwayChokingCare");
    data.airway.interventions.none = b("airwayNone");

    // ─── Step 7 — Breathing (B) ───────────────────────────
    data.breathing.assessment_normal = b("breathingAssessmentNormal");
    data.breathing.assessment_findings = s("breathingAssessmentFindings");
    data.breathing.interventions.maintained_position_of_comfort =
        b("breathingMaintainedPositionOfComfort");
    data.breathing.interventions.none = b("breathingNone");

    // ─── Step 8 — Circulation (C) ─────────────────────────
    data.circulation.assessment_normal = b("circulationAssessmentNormal");
    data.circulation.assessment_findings = s("circulationAssessmentFindings");
    data.circulation.interventions.pelvic_binder = b("circulationPelvicBinder");
    data.circulation.interventions.control_minor_bleeding = b("circulationControlMinorBleeding");
    data.circulation.interventions.fracture_care = b("circulationFractureCare");
    data.circulation.interventions.oral_hydration = b("circulationOralHydration");
    data.circulation.interventions.left_lateral_position = b("circulationLeftLateralPosition");
    data.circulation.interventions.none = b("circulationNone");

    // ─── Step 9 — Disability (D) ──────────────────────────
    data.disability.assessment_normal = b("disabilityAssessmentNormal");
    data.disability.assessment_findings = s("disabilityAssessmentFindings");
    data.disability.interventions.spinal_immobilisation = b("disabilitySpinalImmobilisation");
    data.disability.interventions.glucose_given = b("disabilityGlucoseGiven");
    data.disability.interventions.seizure_care = b("disabilitySeizureCare");
    data.disability.interventions.high_temperature_care = b("disabilityHighTemperatureCare");
    data.disability.interventions.low_temperature_care = b("disabilityLowTemperatureCare");
    data.disability.interventions.none = b("disabilityNone");

    // ─── Step 10 — Exposure / Other (E) ───────────────────
    data.exposure.assessment_normal = b("exposureAssessmentNormal");
    data.exposure.assessment_findings = s("exposureAssessmentFindings");
    data.exposure.interventions.recovery_position = b("exposureRecoveryPosition");
    data.exposure.interventions.burn_care = b("exposureBurnCare");
    data.exposure.interventions.wound_care = b("exposureWoundCare");
    data.exposure.interventions.drowning_care = b("exposureDrowningCare");
    data.exposure.interventions.snakebite_care = b("exposureSnakebiteCare");
    data.exposure.interventions.none = b("exposureNone");
    data.exposure.medication_taken_none = b("medicationTakenNone");
    data.exposure.medication_taken_details = s("medicationTakenDetails");

    // ─── Step 11 — Recommendations ────────────────────────
    data.recommendations.transport_plan = s("transportPlan");
    data.recommendations.problems_anticipated = s("problemsAnticipated");
    data.recommendations.other_concerns = s("otherConcerns");
    data.recommendations.precautions.highly_infectious_disease = b("highlyInfectiousDisease");
    data.recommendations.precautions.spinal_immobilization =
        b("precautionsSpinalImmobilization");
    data.recommendations.precautions.possible_fracture = b("possibleFracture");
    data.recommendations.precautions.fall_risk = b("fallRisk");
    data.recommendations.precautions.altered_mental_status = b("alteredMentalStatus");
    data.recommendations.precautions.other = b("precautionOther");
    data.recommendations.precautions.other_details = s("precautionOtherDetails");

    // ─── Step 12 — Responder Details (CFAR) ───────────────
    data.responder_details.name = s("responderName");
    data.responder_details.signature = s("responderSignature");
    data.responder_details.contact_information = s("responderContactInformation");
    data.responder_details.cfar_organization = s("cfarOrganization");

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
