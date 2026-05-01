//! HTTP routes for the WHO Acute Referral Form assessment.
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
    data.patient_identification.patient_last_name = s("patientLastName");
    data.patient_identification.patient_first_name = s("patientFirstName");
    data.patient_identification.date_of_birth = s("dateOfBirth");
    data.patient_identification.sex = s("sex");
    data.patient_identification.patient_contact_information = s("patientContactInformation");
    data.patient_identification.emergency_contact.name = s("emergencyContactName");
    data.patient_identification
        .emergency_contact
        .contact_information = s("emergencyContactInformation");

    // ─── Step 2 — Facility & Transport ────────────────────
    data.facility_and_transport.initiating_facility.name = s("initiatingFacilityName");
    data.facility_and_transport.initiating_facility.focal_point =
        s("initiatingFacilityFocalPoint");
    data.facility_and_transport
        .initiating_facility
        .phone_number = s("initiatingFacilityPhoneNumber");
    data.facility_and_transport.reason_for_referral = s("reasonForReferral");
    data.facility_and_transport.referral_facility_contacted = b("referralFacilityContacted");
    data.facility_and_transport.referral_facility.name = s("referralFacilityName");
    data.facility_and_transport.referral_facility.focal_point = s("referralFacilityFocalPoint");
    data.facility_and_transport.referral_facility.phone_number = s("referralFacilityPhoneNumber");
    data.facility_and_transport.ambulance.name = s("ambulanceName");
    data.facility_and_transport.ambulance.focal_point = s("ambulanceFocalPoint");
    data.facility_and_transport.ambulance.phone_number = s("ambulancePhoneNumber");
    data.facility_and_transport.transfer_decision_date_time = s("transferDecisionDateTime");
    data.facility_and_transport.departure_date_time = s("departureDateTime");
    data.facility_and_transport.mode_of_transfer = s("modeOfTransfer");

    // ─── Step 3 — Situation ───────────────────────────────
    data.situation.chief_complaint = s("chiefComplaint");
    data.situation.primary_diagnosis = s("primaryDiagnosis");
    data.situation.pregnant = s("pregnant");
    data.situation.other_acute_diagnoses = s("otherAcuteDiagnoses");
    data.situation.treatments_initiated = s("treatmentsInitiated");

    // ─── Step 4 — Background ──────────────────────────────
    data.background.history_of_present_illness = s("historyOfPresentIllness");
    data.background.past_medical_and_surgical_history = s("pastMedicalAndSurgicalHistory");
    data.background.airway.finding_normal = b("airwayFindingNormal");
    data.background.airway.finding_details = s("airwayFindingDetails");
    data.background.airway.intervention_none = b("airwayInterventionNone");
    data.background.airway.intervention_details = s("airwayInterventionDetails");
    data.background.breathing.finding_normal = b("breathingFindingNormal");
    data.background.breathing.finding_details = s("breathingFindingDetails");
    data.background.breathing.intervention_none = b("breathingInterventionNone");
    data.background.breathing.intervention_details = s("breathingInterventionDetails");
    data.background.circulation.finding_normal = b("circulationFindingNormal");
    data.background.circulation.finding_details = s("circulationFindingDetails");
    data.background.circulation.intervention_none = b("circulationInterventionNone");
    data.background.circulation.intervention_details = s("circulationInterventionDetails");
    data.background.disability.finding_normal = b("disabilityFindingNormal");
    data.background.disability.finding_details = s("disabilityFindingDetails");
    data.background.disability.intervention_none = b("disabilityInterventionNone");
    data.background.disability.intervention_details = s("disabilityInterventionDetails");
    data.background.exposure.finding_normal = b("exposureFindingNormal");
    data.background.exposure.finding_details = s("exposureFindingDetails");
    data.background.exposure.intervention_none = b("exposureInterventionNone");
    data.background.exposure.intervention_details = s("exposureInterventionDetails");
    data.background.other_significant_treatments = s("otherSignificantTreatments");

    // ─── Step 5 — Assessment ──────────────────────────────
    data.assessment.clinical_assessment = s("clinicalAssessment");
    data.assessment.vital_signs.heart_rate = n("heartRate");
    data.assessment.vital_signs.respiratory_rate = n("respiratoryRate");
    data.assessment.vital_signs.systolic_blood_pressure = n("systolicBloodPressure");
    data.assessment.vital_signs.diastolic_blood_pressure = n("diastolicBloodPressure");
    data.assessment.vital_signs.temperature_celsius = n("temperatureCelsius");
    data.assessment.vital_signs.oxygen_saturation = n("oxygenSaturation");
    data.assessment.vital_signs.glasgow_coma_scale = n("glasgowComaScale");

    // ─── Step 6 — Recommendations ─────────────────────────
    data.recommendations.treatment_plan_during_transport = s("treatmentPlanDuringTransport");
    data.recommendations.potential_worsening_of_condition = s("potentialWorseningOfCondition");
    data.recommendations.cautions_regarding_prior_therapies = s("cautionsRegardingPriorTherapies");
    data.recommendations.precautions.highly_infectious_disease = b("highlyInfectiousDisease");
    data.recommendations.precautions.spinal_precautions = b("spinalPrecautions");
    data.recommendations.precautions.weight_bearing_restrictions = b("weightBearingRestrictions");
    data.recommendations.precautions.fall_risk = b("fallRisk");
    data.recommendations.precautions.aspiration_risk = b("aspirationRisk");
    data.recommendations.precautions.other = b("precautionOther");
    data.recommendations.precautions.other_details = s("precautionOtherDetails");

    // ─── Step 7 — Initiating Provider Sign-off ────────────
    data.initiating_provider_signoff.provider_name = s("providerName");
    data.initiating_provider_signoff.signature = s("providerSignature");
    data.initiating_provider_signoff.signature_date = s("providerSignatureDate");

    // ─── Step 8 — Referral Facility Receipt ───────────────
    data.referral_facility_receipt.patient_arrival_date_time = s("patientArrivalDateTime");
    data.referral_facility_receipt.receiving_provider_name = s("receivingProviderName");
    data.referral_facility_receipt.receiving_provider_signature = s("receivingProviderSignature");
    data.referral_facility_receipt
        .feedback_provided_to_initiating_facility = b("feedbackProvidedToInitiatingFacility");

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
