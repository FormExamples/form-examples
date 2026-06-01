//! HTTP routes for the WHO Emergency Unit (Trauma) Form assessment.
//!
//! Endpoints:
//!
//! - `GET  /`                          → landing
//! - `POST /assessment/new`            → create a new assessment, redirect
//! - `GET  /assessment/{id}`           → single-page wizard
//! - `POST /assessment/{id}/submit`    → save form data, redirect to report
//! - `GET  /assessment/{id}/report`    → render validated report
//!
//! The form is submitted as `application/x-www-form-urlencoded` (one flat
//! map). `form_to_assessment_data` maps the camelCase form field names onto
//! the strongly-typed `AssessmentData`.

use std::collections::HashMap;
use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::types::AssessmentData;
use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};
use crate::views::assessment::{build_assessment_context, build_report_context};

/// POST /assessment/new -- create a new draft assessment, redirect to the wizard.
#[debug_handler]
async fn create_new(State(ctx): State<AppContext>) -> Result<Response> {
    let item = ActiveModel::new_draft()
        .map_err(|e| Error::BadRequest(format!("Failed to create assessment: {e}")))?;
    let item = item.insert(&ctx.db).await?;
    let id = item.id;
    Ok(Redirect::to(&format!("/assessment/{id}")).into_response())
}

/// GET /assessment/{id} -- render the single-page wizard.
#[debug_handler]
async fn show_assessment(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let item = find_by_id(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let data: AssessmentData = item.assessment_data().unwrap_or_default();

    let context = build_assessment_context(&data, id);
    let rendered = tera
        .render("assessment.html.tera", &context)
        .map_err(|e| Error::BadRequest(format!("Template error: {e}")))?;

    Ok(Response::builder()
        .header("Content-Type", "text/html; charset=utf-8")
        .body(axum::body::Body::from(rendered))
        .map_err(Error::wrap)?
        .into_response())
}

/// Map a flat HashMap (from `application/x-www-form-urlencoded`) onto the
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
    pr.injury_location = s("injuryLocation");
    pr.injury_location_unknown = b("injuryLocationUnknown");
    pr.contact_person = s("contactPerson");
    pr.contact_phone = s("contactPhone");
    pr.contact_relation = s("contactRelation");
    pr.pregnant = s("pregnant");
    pr.iv_drug_use = b("ivDrugUse");

    // ─── Step 2 — Chief Complaint & Vitals ────────────────
    let cv = &mut data.chief_complaint_and_vitals;
    cv.chief_complaint = s("chiefComplaint");
    cv.allergies = s("allergies");
    cv.allergies_unknown = b("allergiesUnknown");
    cv.dead_on_arrival = b("deadOnArrival");
    cv.time_of_death = s("timeOfDeath");
    cv.initial_vitals.time = s("initialVitalsTime");
    cv.initial_vitals.temp_c = n("initialTempC");
    cv.initial_vitals.bp_systolic = n("initialBpSystolic");
    cv.initial_vitals.bp_diastolic = n("initialBpDiastolic");
    cv.initial_vitals.pulse = n("initialPulse");
    cv.initial_vitals.respiratory_rate = n("initialRespiratoryRate");
    cv.initial_vitals.spo2 = n("initialSpo2");
    cv.initial_vitals.pain_score = n("initialPainScore");

    // ─── Step 3 — High Risk Signs (subset for round-trip) ──
    let hr = &mut data.high_risk_signs;
    hr.red_stridor = b("redStridor");
    hr.red_cyanosis = b("redCyanosis");
    hr.red_respiratory_distress = b("redRespiratoryDistress");
    hr.red_poor_perfusion = b("redPoorPerfusion");
    hr.red_heavy_bleeding = b("redHeavyBleeding");
    hr.red_unresponsive = b("redUnresponsive");
    hr.trauma_polytrauma = b("traumaPolytrauma");
    hr.trauma_all_penetrating = b("traumaAllPenetrating");
    hr.trauma_crush_injury = b("traumaCrushInjury");
    hr.trauma_bleeding_disorder_or_anticoag = b("traumaBleedingDisorderOrAnticoag");
    hr.trauma_pregnant = b("traumaPregnant");
    hr.rt_high_speed_crash = b("rtHighSpeedCrash");
    hr.rt_pedestrian_or_cyclist_hit = b("rtPedestrianOrCyclistHit");

    // ─── Step 4 — Triage ───────────────────────────────────
    let t = &mut data.triage;
    t.category = s("triageCategory");
    t.triaged_for = s("triagedFor");
    t.provider_assessment_date = s("providerAssessmentDate");
    t.provider_assessment_time = s("providerAssessmentTime");

    // ─── Step 5 — Airway ───────────────────────────────────
    let a = &mut data.airway;
    a.normal = b("airwayNormal");
    a.swelling = b("airwaySwelling");
    a.stridor = b("airwayStridor");
    a.voice_changes = b("airwayVoiceChanges");
    a.burns = b("airwayBurns");
    a.intervention_repositioning = b("airwayInterventionRepositioning");
    a.intervention_suction = b("airwayInterventionSuction");
    a.intervention_opa = b("airwayInterventionOpa");
    a.intervention_npa = b("airwayInterventionNpa");
    a.intervention_lma = b("airwayInterventionLma");
    a.intervention_bvm = b("airwayInterventionBvm");
    a.intervention_ett = b("airwayInterventionEtt");
    a.spine_stabilized = s("airwaySpineStabilized");
    a.notes = s("airwayNotes");

    // ─── Step 6 — Breathing ───────────────────────────────
    let br = &mut data.breathing;
    br.normal = b("breathingNormal");
    br.spontaneous_respiratory_rate = n("breathingSpontaneousRespiratoryRate");
    br.cyanosis = b("breathingCyanosis");
    br.oxygen_litres = n("breathingOxygenLitres");
    br.oxygen_nasal_cannula = b("breathingOxygenNasalCannula");
    br.oxygen_mask = b("breathingOxygenMask");
    br.oxygen_non_rebreather = b("breathingOxygenNonRebreather");
    br.oxygen_bvm = b("breathingOxygenBvm");
    br.oxygen_cpap_bipap = b("breathingOxygenCpapBipap");
    br.oxygen_ventilator = b("breathingOxygenVentilator");
    br.notes = s("breathingNotes");

    // ─── Step 7 — Circulation ─────────────────────────────
    let c = &mut data.circulation;
    c.normal = b("circulationNormal");
    c.access_iv_location = s("circulationAccessIvLocation");
    c.access_central_location = s("circulationAccessCentralLocation");
    c.access_io_location = s("circulationAccessIoLocation");
    c.ivf_mls = n("circulationIvfMls");
    c.blood_ordered = b("circulationBloodOrdered");
    c.blood_given = b("circulationBloodGiven");
    c.bleeding_control_direct_pressure = b("circulationBleedingControlDirectPressure");
    c.bleeding_control_bandage = b("circulationBleedingControlBandage");
    c.bleeding_control_tourniquet = b("circulationBleedingControlTourniquet");
    c.unstable_pelvis = s("circulationUnstablePelvis");
    c.notes = s("circulationNotes");

    // ─── Step 8 — Disability ──────────────────────────────
    let d = &mut data.disability;
    d.normal = b("disabilityNormal");
    d.avpu = s("avpu");
    d.gcs_total = n("gcsTotal");
    d.gcs_eye = n("gcsEye");
    d.gcs_verbal = n("gcsVerbal");
    d.gcs_motor = n("gcsMotor");
    d.gcs_qualified = b("gcsQualified");
    d.blood_glucose = n("bloodGlucose");
    d.intervention_glucose = b("disabilityInterventionGlucose");
    d.notes = s("disabilityNotes");

    // ─── Step 9 — Exposure & FAST ─────────────────────────
    let ef = &mut data.exposure_and_fast;
    ef.exposed_completely = b("exposedCompletely");
    ef.exposure_notes = s("exposureNotes");
    ef.fast_normal = b("fastNormal");
    ef.fast_not_indicated = b("fastNotIndicated");
    ef.fast_not_available = b("fastNotAvailable");
    ef.fast_peritoneum = s("fastPeritoneum");
    ef.fast_chest = s("fastChest");
    ef.fast_notes = s("fastNotes");

    // ─── Step 10 — Injury History ─────────────────────────
    let ih = &mut data.injury_history;
    ih.date_of_injury = s("dateOfInjury");
    ih.time_of_injury = s("timeOfInjury");
    ih.intent = s("intent");
    ih.prehospital_care_provider = s("prehospitalCareProvider");
    ih.mech_road_traffic_incident = b("mechRoadTrafficIncident");
    ih.mech_fall_from = s("mechFallFrom");
    ih.mech_stab_cut = b("mechStabCut");
    ih.mech_gunshot = b("mechGunshot");
    ih.mech_other_blunt_force = b("mechOtherBluntForce");
    ih.mech_unknown = b("mechUnknown");
    ih.loss_of_consciousness_duration = s("lossOfConsciousnessDuration");

    // ─── Step 11 — Past Histories ─────────────────────────
    let ph = &mut data.past_histories;
    ph.pmh_none = b("pmhNone");
    ph.pmh_unknown = b("pmhUnknown");
    ph.pmh_htn = b("pmhHtn");
    ph.pmh_dm = b("pmhDm");
    ph.pmh_other = s("pmhOther");
    ph.medications_none = b("medicationsNone");
    ph.medications_unknown = b("medicationsUnknown");
    ph.medications = s("medications");

    // ─── Step 13 — Assessment & Plan ──────────────────────
    data.assessment_and_plan.narrative = s("assessmentAndPlanNarrative");

    // ─── Step 17 — Disposition ────────────────────────────
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

/// POST /assessment/{id}/submit -- replace the JSONB blob with the new
/// form data and redirect to the report.
#[debug_handler]
async fn submit_assessment(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    axum::extract::Form(form): axum::extract::Form<HashMap<String, String>>,
) -> Result<Response> {
    let item = find_by_id(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let data = form_to_assessment_data(&form);
    let data_value =
        serde_json::to_value(&data).map_err(|e| Error::BadRequest(format!("Encode error: {e}")))?;

    let mut active: ActiveModel = item.into_active_model();
    active.data = ActiveValue::Set(data_value);
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    Ok(Redirect::to(&format!("/assessment/{id}/report")).into_response())
}

/// GET /assessment/{id}/report -- run the engine, persist the result,
/// render the report template.
#[debug_handler]
async fn show_report(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let item = find_by_id(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let assessment_data: AssessmentData = item
        .assessment_data()
        .map_err(|e| Error::BadRequest(format!("Invalid assessment data: {e}")))?;

    let (context, result) = build_report_context(&assessment_data, id);

    let result_json =
        serde_json::to_value(&result).map_err(|e| Error::BadRequest(format!("Encode: {e}")))?;
    let mut active: ActiveModel = item.into_active_model();
    active.result = ActiveValue::Set(Some(result_json));
    active.status = ActiveValue::Set("completed".to_string());
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    let rendered = tera
        .render("report.html.tera", &context)
        .map_err(|e| Error::BadRequest(format!("Template error: {e}")))?;

    Ok(Response::builder()
        .header("Content-Type", "text/html; charset=utf-8")
        .body(axum::body::Body::from(rendered))
        .map_err(Error::wrap)?
        .into_response())
}

/// GET / -- landing page.
#[debug_handler]
async fn landing(Extension(tera): Extension<Arc<Tera>>) -> Result<Response> {
    let context = Context::new();
    let rendered = tera
        .render("landing.html.tera", &context)
        .map_err(|e| Error::BadRequest(format!("Template error: {e}")))?;

    Ok(Response::builder()
        .header("Content-Type", "text/html; charset=utf-8")
        .body(axum::body::Body::from(rendered))
        .map_err(Error::wrap)?
        .into_response())
}

pub fn routes(tera: Arc<Tera>) -> Routes {
    Routes::new()
        .add("/", get(landing))
        .add("assessment/new", post(create_new))
        .add("assessment/{id}", get(show_assessment))
        .add("assessment/{id}/submit", post(submit_assessment))
        .add("assessment/{id}/report", get(show_report))
        .layer(Extension(tera))
}
