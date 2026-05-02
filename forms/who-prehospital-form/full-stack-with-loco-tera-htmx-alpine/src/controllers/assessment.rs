//! HTTP routes for the WHO Prehospital Form (SCF Prehospital) assessment.
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

use crate::engine::types::{AssessmentData, Reassessment};
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
/// strongly-typed `AssessmentData`. Field names mirror the camelCase JSON
/// form used by the SvelteKit front-end. Unknown / blank fields fall back
/// to defaults.
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

    // ─── Step 1 — Caller & Scene ───────────────────────────
    let cs = &mut data.caller_and_scene;
    cs.mass_casualty = b("massCasualty");
    cs.caller_name = s("callerName");
    cs.caller_phone = s("callerPhone");
    cs.patient_name = s("patientName");
    cs.date_of_birth_or_age = s("dateOfBirthOrAge");
    cs.sex = s("sex");
    cs.patient_address = s("patientAddress");
    cs.occupation = s("occupation");
    cs.date = s("date");
    cs.scene_call_type = s("sceneCallType");
    cs.run_number = s("runNumber");
    cs.scene_location_type = s("sceneLocationType");
    cs.scene_location_other = s("sceneLocationOther");
    cs.time_call_received = s("timeCallReceived");
    cs.time_en_route_to_scene = s("timeEnRouteToScene");
    cs.time_arrived_at_scene = s("timeArrivedAtScene");
    cs.time_transporting = s("timeTransporting");
    cs.time_at_facility = s("timeAtFacility");
    cs.time_in_service = s("timeInService");

    // ─── Step 2 — Chief Complaint & Vitals ────────────────
    let cv = &mut data.chief_complaint_and_vitals;
    cv.chief_complaint = s("chiefComplaint");
    cv.injury = b("injury");
    cv.initial_vitals.time = s("initialVitalsTime");
    cv.initial_vitals.hr = n("initialHr");
    cv.initial_vitals.rr = n("initialRr");
    cv.initial_vitals.bp = s("initialBp");
    cv.initial_vitals.temp_c = n("initialTempC");
    cv.initial_vitals.rbs = n("initialRbs");
    cv.initial_vitals.spo2 = n("initialSpo2");
    cv.initial_vitals.spo2_on_oxygen = s("initialSpo2OnOxygen");
    cv.care_in_progress_on_arrival = s("careInProgressOnArrival");
    cv.pregnant = s("pregnant");
    cv.pain_score = n("painScore");

    // ─── Step 4 — Triage ──────────────────────────────────
    data.triage.category = s("triageCategory");
    data.triage.triaged_for = s("triagedFor");

    // ─── Step 5 — Airway ──────────────────────────────────
    let a = &mut data.airway;
    a.normal = b("airwayNormal");
    a.voice_changes = b("airwayVoiceChanges");
    a.stridor = b("airwayStridor");
    a.intervention_repositioning = b("airwayInterventionRepositioning");
    a.intervention_suction = b("airwayInterventionSuction");
    a.intervention_opa = b("airwayInterventionOpa");
    a.intervention_npa = b("airwayInterventionNpa");
    a.intervention_lma = b("airwayInterventionLma");
    a.intervention_bvm = b("airwayInterventionBvm");
    a.intervention_ett = b("airwayInterventionEtt");
    a.notes = s("airwayNotes");

    // ─── Step 6 — Breathing ───────────────────────────────
    let br = &mut data.breathing;
    br.normal = b("breathingNormal");
    br.spontaneous_respiration = s("breathingSpontaneousRespiration");
    br.oxygen_litres = n("breathingOxygenLitres");
    br.oxygen_nasal_cannula = b("breathingOxygenNasalCannula");
    br.oxygen_face_mask = b("breathingOxygenFaceMask");
    br.oxygen_non_rebreather = b("breathingOxygenNonRebreather");
    br.oxygen_bvm = b("breathingOxygenBvm");
    br.oxygen_bipap_cpap = b("breathingOxygenBipapCpap");
    br.notes = s("breathingNotes");

    // ─── Step 7 — Circulation ─────────────────────────────
    let c = &mut data.circulation;
    c.normal = b("circulationNormal");
    c.active_bleeding_site = s("circulationActiveBleedingSite");
    c.bleeding_controlled_bandage = b("circulationBleedingControlledBandage");
    c.bleeding_controlled_tourniquet = b("circulationBleedingControlledTourniquet");
    c.bleeding_controlled_direct_pressure = b("circulationBleedingControlledDirectPressure");
    c.access_iv_site = s("circulationAccessIvSite");
    c.access_io_site = s("circulationAccessIoSite");
    c.ivf_mls = n("circulationIvfMls");
    c.ivf_ns = b("circulationIvfNs");
    c.ivf_lr = b("circulationIvfLr");
    c.notes = s("circulationNotes");

    // ─── Step 8 — Disability ──────────────────────────────
    let d = &mut data.disability;
    d.normal = b("disabilityNormal");
    d.blood_glucose = n("disabilityBloodGlucose");
    d.avpu = s("avpu");
    d.gcs_eye = n("gcsEye");
    d.gcs_verbal = n("gcsVerbal");
    d.gcs_motor = n("gcsMotor");
    d.intervention_glucose_given = b("disabilityInterventionGlucoseGiven");
    d.intervention_naloxone_given = b("disabilityInterventionNaloxoneGiven");
    d.notes = s("disabilityNotes");

    // ─── Step 9 — Exposure ────────────────────────────────
    data.exposure.normal = b("exposureNormal");
    data.exposure.exposed_completely = b("exposureExposedCompletely");
    data.exposure.notes = s("exposureNotes");

    // ─── Step 10 — SAMPLE History ─────────────────────────
    let sh = &mut data.sample_history;
    sh.signs_symptoms = s("signsSymptoms");
    sh.signs_symptoms_unknown = b("signsSymptomsUnknown");
    sh.allergies = s("allergies");
    sh.allergies_unknown = b("allergiesUnknown");
    sh.medications = s("medications");
    sh.medications_unknown = b("medicationsUnknown");
    sh.past_medical = s("pastMedical");
    sh.past_medical_unknown = b("pastMedicalUnknown");
    sh.past_surgeries = s("pastSurgeries");
    sh.past_surgeries_unknown = b("pastSurgeriesUnknown");
    sh.last_ate_hours = n("lastAteHours");
    sh.last_ate_unknown = b("lastAteUnknown");
    sh.events = s("events");
    sh.events_unknown = b("eventsUnknown");

    // ─── Step 11 — Injury Details ─────────────────────────
    let inj = &mut data.injury_details;
    inj.intent = s("injuryIntent");
    inj.mechanism_fall = b("mechanismFall");
    inj.mechanism_hit_by_falling_object = b("mechanismHitByFallingObject");
    inj.mechanism_stab_cut = b("mechanismStabCut");
    inj.mechanism_gunshot = b("mechanismGunshot");
    inj.mechanism_sexual_assault = b("mechanismSexualAssault");
    inj.mechanism_other_blunt_force = b("mechanismOtherBluntForce");
    inj.mechanism_suffocation_choking_hanging = b("mechanismSuffocationChokingHanging");
    inj.mechanism_drowning = b("mechanismDrowning");
    inj.mechanism_burn_caused_by = s("mechanismBurnCausedBy");
    inj.mechanism_poisoning_toxic_exposure = b("mechanismPoisoningToxicExposure");
    inj.mechanism_unknown = b("mechanismUnknown");
    inj.mechanism_other = s("mechanismOther");

    // ─── Step 14 — Assessment & Plan ──────────────────────
    data.assessment_and_plan.summary = s("assessmentSummary");
    data.assessment_and_plan.differential = s("assessmentDifferential");
    data.assessment_and_plan.presumptive_diagnoses = s("assessmentPresumptiveDiagnoses");

    // ─── Step 15 — Reassessments (0..=3) ──────────────────
    let mut reassessments: Vec<Reassessment> = Vec::new();
    for i in 0..3usize {
        // We treat an entry as "filled" if any of its fields has a non-empty
        // value submitted, mirroring the SvelteKit array pattern.
        let time = form
            .get(&format!("reassessment{i}Time"))
            .cloned()
            .unwrap_or_default();
        let hr = n(&format!("reassessment{i}Hr"));
        let rr = n(&format!("reassessment{i}Rr"));
        let temp_c = n(&format!("reassessment{i}TempC"));
        let spo2 = n(&format!("reassessment{i}Spo2"));
        let rbs = n(&format!("reassessment{i}Rbs"));
        let pain = n(&format!("reassessment{i}Pain"));
        let unchanged = b(&format!("reassessment{i}Unchanged"));
        let spo2_on_oxygen = form
            .get(&format!("reassessment{i}Spo2OnOxygen"))
            .cloned()
            .unwrap_or_default();

        let any = !time.trim().is_empty()
            || hr.is_some()
            || rr.is_some()
            || temp_c.is_some()
            || spo2.is_some()
            || rbs.is_some()
            || pain.is_some()
            || unchanged
            || !spo2_on_oxygen.trim().is_empty();

        if any {
            reassessments.push(Reassessment {
                time,
                hr,
                rr,
                temp_c,
                spo2,
                spo2_on_oxygen,
                rbs,
                pain,
                unchanged,
            });
        }
    }
    data.reassessments = reassessments;

    // ─── Step 16 — Disposition ────────────────────────────
    let dp = &mut data.disposition;
    dp.disposition = s("disposition");
    dp.handover_time = s("handoverTime");
    dp.handover_to_name = s("handoverToName");
    dp.handover_to_cadre = s("handoverToCadre");
    dp.handover_to_signature = s("handoverToSignature");
    dp.final_vitals.time = s("finalVitalsTime");
    dp.final_vitals.hr = n("finalHr");
    dp.final_vitals.rr = n("finalRr");
    dp.final_vitals.temp_c = n("finalTempC");
    dp.final_vitals.bp = s("finalBp");
    dp.final_vitals.spo2 = n("finalSpo2");
    dp.final_vitals.spo2_on_oxygen = s("finalSpo2OnOxygen");
    dp.plan_discussed_with_patient = s("planDiscussedWithPatient");
    dp.provider_name = s("providerName");
    dp.provider_signature = s("providerSignature");
    dp.provider_signature_date = s("providerSignatureDate");

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
