//! HTTP routes for the WHO Emergency Unit (General) Form assessment.
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
/// defaults. Field names mirror the camelCase JSON form used by the
/// SvelteKit front-end.
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

    // ─── Step 1 — Patient Registration ─────────────────────
    let pr = &mut data.patient_registration;
    pr.hospital_registration_number = s("hospitalRegistrationNumber");
    pr.surname = s("surname");
    pr.first_name = s("firstName");
    pr.sex = s("sex");
    pr.date_of_birth = s("dateOfBirth");
    pr.age = n("age");
    pr.age_category = s("ageCategory");
    pr.weight_kg = n("weightKg");
    pr.date_of_arrival = s("dateOfArrival");
    pr.time_of_arrival = s("timeOfArrival");
    pr.arrival_mode = s("arrivalMode");
    pr.ambulance_level = s("ambulanceLevel");
    pr.contact_person = s("contactPerson");
    pr.contact_phone = s("contactPhone");
    pr.contact_relation = s("contactRelation");

    // ─── Step 2 — Chief Complaint & Vitals ────────────────
    let cv = &mut data.chief_complaint_and_vitals;
    cv.chief_complaint = s("chiefComplaint");
    cv.triage_category = s("triageCategory");
    cv.dead_on_arrival = b("deadOnArrival");
    cv.initial_vitals.time = s("initialVitalsTime");
    cv.initial_vitals.temp_c = n("initialTempC");
    cv.initial_vitals.bp_systolic = n("initialBpSystolic");
    cv.initial_vitals.bp_diastolic = n("initialBpDiastolic");
    cv.initial_vitals.pulse = n("initialPulse");
    cv.initial_vitals.respiratory_rate = n("initialRespiratoryRate");
    cv.initial_vitals.spo2 = n("initialSpo2");
    cv.initial_vitals.pain_score = n("initialPainScore");

    // ─── Step 3 — High Risk Signs ─────────────────────────
    let hr = &mut data.high_risk_signs;
    hr.abnormal_avpu = b("abnormalAvpu");
    hr.abnormal_heart_rate = b("abnormalHeartRate");
    hr.stridor_or_voice_change = b("stridorOrVoiceChange");
    hr.poor_perfusion = b("poorPerfusion");
    hr.abnormal_temperature = b("abnormalTemperature");
    hr.low_spo2 = b("lowSpo2");
    hr.respiratory_distress = b("respiratoryDistress");
    hr.vomits_everything_or_cannot_feed = b("vomitsEverythingOrCannotFeed");

    // ─── Step 4 — Airway ──────────────────────────────────
    let a = &mut data.airway;
    a.normal = b("airwayNormal");
    a.angioedema = b("airwayAngioedema");
    a.stridor = b("airwayStridor");
    a.voice_changes = b("airwayVoiceChanges");
    a.intervention_repositioning = b("airwayInterventionRepositioning");
    a.intervention_suction = b("airwayInterventionSuction");
    a.intervention_opa = b("airwayInterventionOpa");
    a.intervention_npa = b("airwayInterventionNpa");
    a.intervention_lma = b("airwayInterventionLma");
    a.intervention_bvm = b("airwayInterventionBvm");
    a.intervention_ett = b("airwayInterventionEtt");
    a.notes = s("airwayNotes");

    // ─── Step 5 — Breathing ───────────────────────────────
    let br = &mut data.breathing;
    br.normal = b("breathingNormal");
    br.spontaneous_respiratory_rate = n("breathingSpontaneousRespiratoryRate");
    br.oxygen_litres = n("breathingOxygenLitres");
    br.oxygen_nasal_cannula = b("breathingOxygenNasalCannula");
    br.oxygen_mask = b("breathingOxygenMask");
    br.oxygen_non_rebreather = b("breathingOxygenNonRebreather");
    br.oxygen_bvm = b("breathingOxygenBvm");
    br.oxygen_cpap_bipap = b("breathingOxygenCpapBipap");
    br.oxygen_ventilator = b("breathingOxygenVentilator");
    br.bronchodilator = b("breathingBronchodilator");
    br.notes = s("breathingNotes");

    // ─── Step 6 — Circulation ─────────────────────────────
    let c = &mut data.circulation;
    c.normal = b("circulationNormal");
    c.access_iv_location = s("circulationAccessIvLocation");
    c.access_cvl_location = s("circulationAccessCvlLocation");
    c.access_io_location = s("circulationAccessIoLocation");
    c.ivf_mls = n("circulationIvfMls");
    c.blood_ordered = b("circulationBloodOrdered");
    c.epinephrine_given = b("circulationEpinephrineGiven");
    c.notes = s("circulationNotes");

    // ─── Step 7 — Disability ──────────────────────────────
    let d = &mut data.disability;
    d.normal = b("disabilityNormal");
    d.avpu = s("avpu");
    d.deficit = b("disabilityDeficit");
    d.deficit_description = s("disabilityDeficitDescription");
    d.blood_glucose_mmol = n("disabilityBloodGlucoseMmol");
    d.intervention_glucose = b("disabilityInterventionGlucose");
    d.intervention_naloxone = b("disabilityInterventionNaloxone");
    d.notes = s("disabilityNotes");

    // ─── Step 8 — History of Present Illness ─────────────
    data.history_of_present_illness.narrative = s("hpiNarrative");

    // ─── Step 10 — Past Medical History ──────────────────
    let pmh = &mut data.past_medical_history;
    pmh.history_obtained_from = s("historyObtainedFrom");
    pmh.medications = s("medications");
    pmh.medications_unknown = b("medicationsUnknown");
    pmh.allergies = s("allergies");
    pmh.allergies_unknown = b("allergiesUnknown");
    pmh.pregnant = s("pregnant");
    pmh.tobacco_use = b("tobaccoUse");
    pmh.alcohol_use = b("alcoholUse");
    pmh.drug_use = b("drugUse");
    pmh.iv_drug_use = b("ivDrugUse");

    // ─── Step 14 — Assessment & Plan ─────────────────────
    data.assessment_and_plan.narrative = s("assessmentAndPlanNarrative");

    // ─── Step 16 — Disposition ───────────────────────────
    let dp = &mut data.disposition;
    dp.ed_departure_date = s("edDepartureDate");
    dp.ed_departure_time = s("edDepartureTime");
    dp.diagnoses_impressions = s("diagnosesImpressions");
    dp.disposition = s("disposition");
    dp.admit_ward = s("admitWard");
    dp.discharge_plan_discussed = s("dischargePlanDiscussed");
    dp.transfer_to = s("transferTo");
    dp.left_without_being_seen = b("leftWithoutBeingSeen");
    dp.died_cause = s("diedCause");
    dp.emergency_unit_provider = s("emergencyUnitProvider");
    dp.signature = s("signature");
    dp.signature_date = s("signatureDate");

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
