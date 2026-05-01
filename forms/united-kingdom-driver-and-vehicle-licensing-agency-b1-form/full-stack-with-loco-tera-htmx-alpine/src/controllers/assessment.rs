//! HTTP routes for the DVLA B1 assessment.
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

use crate::engine::types::{AssessmentData, MedicationEntry};
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
    data.personal_details.address_line1 = s("addressLine1");
    data.personal_details.address_line2 = s("addressLine2");
    data.personal_details.address_line3 = s("addressLine3");
    data.personal_details.postcode = s("postcode");
    data.personal_details.email = s("email");
    data.personal_details.contact_number = s("contactNumber");
    data.personal_details.change_of_details = s("changeOfDetails");

    // ─── Healthcare Professionals ──────────────────────
    data.healthcare_professionals.gp.gp_name = s("gpName");
    data.healthcare_professionals.gp.surgery_name = s("gpSurgeryName");
    data.healthcare_professionals.gp.address_line1 = s("gpAddressLine1");
    data.healthcare_professionals.gp.address_line2 = s("gpAddressLine2");
    data.healthcare_professionals.gp.town = s("gpTown");
    data.healthcare_professionals.gp.postcode = s("gpPostcode");
    data.healthcare_professionals.gp.contact_number = s("gpContactNumber");
    data.healthcare_professionals.gp.email = s("gpEmail");
    data.healthcare_professionals.gp.date_last_seen = s("gpDateLastSeen");

    data.healthcare_professionals.consultant.consultant_name = s("consultantName");
    data.healthcare_professionals.consultant.speciality = s("consultantSpeciality");
    data.healthcare_professionals.consultant.department = s("consultantDepartment");
    data.healthcare_professionals.consultant.hospital_name = s("hospitalName");
    data.healthcare_professionals.consultant.address_line1 = s("consultantAddressLine1");
    data.healthcare_professionals.consultant.address_line2 = s("consultantAddressLine2");
    data.healthcare_professionals.consultant.town = s("consultantTown");
    data.healthcare_professionals.consultant.postcode = s("consultantPostcode");
    data.healthcare_professionals.consultant.contact_number = s("consultantContactNumber");
    data.healthcare_professionals.consultant.email = s("consultantEmail");
    data.healthcare_professionals.consultant.date_last_seen = s("consultantDateLastSeen");

    // ─── Q1 Condition History ──────────────────────────
    data.condition_history.brain_haemorrhage = b("brainHaemorrhage");
    data.condition_history.brain_haemorrhage_date = s("brainHaemorrhageDate");
    data.condition_history.brain_haemorrhage_details = s("brainHaemorrhageDetails");
    data.condition_history.severe_head_injury = b("severeHeadInjury");
    data.condition_history.severe_head_injury_date = s("severeHeadInjuryDate");
    data.condition_history.severe_head_injury_details = s("severeHeadInjuryDetails");
    data.condition_history.other_condition = b("otherCondition");
    data.condition_history.other_condition_date = s("otherConditionDate");
    data.condition_history.other_condition_details = s("otherConditionDetails");
    data.condition_history.brain_surgery_date = s("brainSurgeryDate");
    data.condition_history.brain_surgery_not_applicable = b("brainSurgeryNotApplicable");

    // ─── Q2 Treatment Provider ─────────────────────────
    data.treatment_provider.last_seen = s("lastSeen");
    data.treatment_provider.gp_last_contact_date = s("gpLastContactDate");
    data.treatment_provider.gp_next_contact_date = s("gpNextContactDate");
    data.treatment_provider.consultant_last_contact_date = s("consultantLastContactDate");
    data.treatment_provider.consultant_next_contact_date = s("consultantNextContactDate");

    // ─── Q3 Blackouts ──────────────────────────────────
    data.blackouts.had_blackouts = s("hadBlackouts");
    data.blackouts.blackout_date = s("blackoutDate");

    // ─── Q4–Q6 Seizures ────────────────────────────────
    data.seizures.had_seizures = s("hadSeizures");
    data.seizures.diagnosis = s("seizureDiagnosis");
    data.seizures.first_ever.date = s("firstEverSeizureDate");
    data.seizures.first_ever.details = s("firstEverSeizureDetails");

    let m = &mut data.seizures.multiple;
    m.two_or_more_within_five_years = s("twoOrMoreWithinFiveYears");
    m.first_awake_seizure_date = s("firstAwakeSeizureDate");
    m.first_asleep_seizure_date = s("firstAsleepSeizureDate");
    m.last_two_awake_seizure_date1 = s("lastTwoAwakeSeizureDate1");
    m.last_two_awake_seizure_date2 = s("lastTwoAwakeSeizureDate2");
    m.last_two_asleep_seizure_date1 = s("lastTwoAsleepSeizureDate1");
    m.last_two_asleep_seizure_date2 = s("lastTwoAsleepSeizureDate2");
    m.first_sleep_attack_after_last_awake_attack_date =
        s("firstSleepAttackAfterLastAwakeAttackDate");
    m.affected_consciousness = s("affectedConsciousness");
    m.would_have_affected_driving = s("wouldHaveAffectedDriving");
    m.attack_description = s("attackDescription");
    m.result_of_medication_advice = s("resultOfMedicationAdvice");
    m.date_medication_started_to_reduce = s("dateMedicationStartedToReduce");
    m.previous_medication_restarted = s("previousMedicationRestarted");
    m.date_previous_medication_restarted = s("datePreviousMedicationRestarted");
    m.date_of_last_seizure_prior_to_withdrawal = s("dateOfLastSeizurePriorToWithdrawal");
    m.provoked_seizure_details = s("provokedSeizureDetails");

    data.seizures.epilepsy_declaration.declaration_accepted = b("epilepsyDeclarationAccepted");
    data.seizures.epilepsy_declaration.signed_name = s("epilepsySignedName");
    data.seizures.epilepsy_declaration.signature_date = s("epilepsySignatureDate");

    // ─── Q7 Medication ─────────────────────────────────
    data.medication.no_medication_taken = b("noMedicationTaken");
    data.medication.makes_drowsy_or_confused = s("makesDrowsyOrConfused");
    // Up to three medication entries from the form (medName1..medName3 etc).
    for i in 1..=3 {
        let name = s(&format!("medName{i}"));
        let start = s(&format!("medStart{i}"));
        let end = s(&format!("medEnd{i}"));
        if !name.is_empty() || !start.is_empty() || !end.is_empty() {
            data.medication.entries.push(MedicationEntry {
                name,
                start_date: start,
                end_date: end,
            });
        }
    }

    // ─── Q8 VP Shunt ───────────────────────────────────
    data.vp_shunt.had_vp_shunt_or_drain = s("hadVpShuntOrDrain");
    data.vp_shunt.procedure_date = s("vpShuntProcedureDate");

    // ─── Q9 Daily Living ───────────────────────────────
    data.daily_living.needs_help = s("needsHelp");
    data.daily_living.help_details = s("helpDetails");

    // ─── Q10 Double Vision ─────────────────────────────
    data.double_vision.has_double_vision = s("hasDoubleVision");
    data.double_vision.suppressed_or_controlled = s("suppressedOrControlled");
    data.double_vision.correction_method = s("correctionMethod");
    data.double_vision.correction_method_other = s("correctionMethodOther");

    // ─── Q11 Eyesight ──────────────────────────────────
    data.eyesight.has_eyesight_problems = s("hasEyesightProblems");
    data.eyesight.details = s("eyesightDetails");

    // ─── Q12 Vehicle Adaptations ───────────────────────
    data.vehicle_adaptations.needs_adaptations = s("needsAdaptations");
    data.vehicle_adaptations.previously_declared = s("previouslyDeclared");
    data.vehicle_adaptations.additional_controls_fitted = s("additionalControlsFitted");

    // ─── Authorisation ─────────────────────────────────
    data.authorisation.declaration_accepted = b("authorisationAccepted");
    data.authorisation.name = s("authorisationName");
    data.authorisation.signature_date = s("authorisationSignatureDate");
    data.authorisation.electronic_correspondence_consent = s("electronicCorrespondenceConsent");
    data.authorisation.dvla_contact_preference = s("dvlaContactPreference");
    data.authorisation.healthcare_contact_preference = s("healthcareContactPreference");

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
