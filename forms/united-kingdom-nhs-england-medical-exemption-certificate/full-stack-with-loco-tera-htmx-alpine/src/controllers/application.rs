//! HTTP routes for the UK NHS England FP92A medical exemption application.
//!
//! Endpoints:
//!
//! - `GET  /`                          → landing
//! - `POST /application/new`           → create a new application, redirect
//! - `GET  /application/{id}`          → single-page 10-step wizard
//! - `POST /application/{id}/submit`   → save form data, redirect to report
//! - `GET  /application/{id}/report`   → render eligibility report

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

use crate::engine::fp92a_rules::ELIGIBLE_CONDITION_CODES;
use crate::engine::types::{ApplicationData, QualifyingCondition};
use crate::views::application::{build_application_context, build_report_context};
use crate::Store;

/// GET / — landing page.
async fn landing(Extension(tera): Extension<Arc<Tera>>) -> Response {
    let context = Context::new();
    render(&tera, "landing.html.tera", &context)
}

/// POST /application/new — create a new application, redirect to its wizard.
async fn new_application(Extension(store): Extension<Store>) -> Redirect {
    let id = Uuid::new_v4();
    let mut data = ApplicationData::default();
    // Pre-seed an entry for every NHSBSA-recognised condition so that the
    // wizard can render a checkbox for each, and so that `selected = ""`
    // distinguishes "not chosen" from "chosen with empty detail".
    for code in ELIGIBLE_CONDITION_CODES.iter() {
        data.conditions.push(QualifyingCondition {
            code: (*code).to_string(),
            ..Default::default()
        });
    }
    let mut guard = store.lock().expect("store poisoned");
    guard.insert(id, data);
    Redirect::to(&format!("/application/{id}"))
}

/// GET /application/{id} — single-page wizard.
async fn show(
    Path(id): Path<Uuid>,
    Extension(tera): Extension<Arc<Tera>>,
    Extension(store): Extension<Store>,
) -> Response {
    let data = {
        let guard = store.lock().expect("store poisoned");
        guard.get(&id).cloned().unwrap_or_default()
    };
    let context = build_application_context(&data, id);
    render(&tera, "application/index.html.tera", &context)
}

/// POST /application/{id}/submit — save raw form data, redirect to report.
async fn submit(
    Path(id): Path<Uuid>,
    Extension(store): Extension<Store>,
    Form(form): Form<HashMap<String, String>>,
) -> Redirect {
    let data = form_to_application_data(&form);
    {
        let mut guard = store.lock().expect("store poisoned");
        guard.insert(id, data);
    }
    Redirect::to(&format!("/application/{id}/report"))
}

/// GET /application/{id}/report — render the validated report.
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
    render(&tera, "application/report.html.tera", &context)
}

/// Map a flat HashMap (from `application/x-www-form-urlencoded`) onto our
/// strongly-typed `ApplicationData`. Unknown / blank fields fall back to
/// defaults.
fn form_to_application_data(form: &HashMap<String, String>) -> ApplicationData {
    let mut data = ApplicationData::default();
    let s = |k: &str| form.get(k).cloned().unwrap_or_default();

    // ─── Practitioner (Step 1) ──────────────────────────
    data.practitioner.name = s("practitionerName");
    data.practitioner.role = s("practitionerRole");
    data.practitioner.registration_body = s("practitionerRegistrationBody");
    data.practitioner.registration_number = s("practitionerRegistrationNumber");
    data.practitioner.practice_name = s("practitionerPracticeName");
    data.practitioner.practice_code = s("practitionerPracticeCode");
    data.practitioner.postal_address_as_full_text = s("practitionerAddress");
    data.practitioner.postcode = s("practitionerPostcode");
    data.practitioner.phone = s("practitionerPhone");
    data.practitioner.email = s("practitionerEmail");
    data.practitioner.completed_date = s("practitionerCompletedDate");

    // ─── Patient (Step 2 / 4 / 5) ───────────────────────
    data.patient.title = s("patientTitle");
    data.patient.surname = s("patientSurname");
    data.patient.forenames = s("patientForenames");
    data.patient.birth_date = s("patientBirthDate");
    data.patient.sex = s("patientSex");
    data.patient.postal_address_as_full_text = s("patientAddress");
    data.patient.postcode = s("patientPostcode");
    data.patient.united_kingdom_nhs_number = s("patientNhsNumber");
    data.patient.phone = s("patientPhone");
    data.patient.email = s("patientEmail");
    data.patient.full_time_education = s("patientFullTimeEducation");
    data.patient.pregnancy_status = s("patientPregnancyStatus");

    // ─── Existing exemption (Step 3) ────────────────────
    data.existing_exemption.application_kind = s("applicationKind");
    data.existing_exemption.has_existing_certificate = s("hasExistingCertificate");
    data.existing_exemption.previous_certificate_number = s("previousCertificateNumber");
    data.existing_exemption.previous_certificate_expiry_date =
        s("previousCertificateExpiryDate");

    // ─── Qualifying conditions (Step 6 / 7 / 8) ─────────
    for code in ELIGIBLE_CONDITION_CODES.iter() {
        let prefix = condition_form_prefix(code);
        let selected = s(&format!("condition_{prefix}_selected"));
        let mut c = QualifyingCondition {
            code: (*code).to_string(),
            selected,
            diagnosis_date: s(&format!("condition_{prefix}_diagnosisDate")),
            snomed_ct_code: s(&format!("condition_{prefix}_snomedCtCode")),
            icd10_code: s(&format!("condition_{prefix}_icd10Code")),
            treatment_detail: s(&format!("condition_{prefix}_treatmentDetail")),
            ..Default::default()
        };
        // Condition-specific fields:
        match *code {
            "permanent-fistula" => {
                c.fistula_site = s("condition_permanent_fistula_fistulaSite");
                c.appliance_type = s("condition_permanent_fistula_applianceType");
            }
            "hypoadrenalism"
            | "diabetes-insipidus-or-hypopituitarism"
            | "hypoparathyroidism"
            | "myxoedema" => {
                c.substitution_therapy = s(&format!("condition_{prefix}_substitutionTherapy"));
                c.on_substitution_therapy =
                    s(&format!("condition_{prefix}_onSubstitutionTherapy"));
            }
            "diabetes-mellitus-not-diet-only" => {
                c.diabetes_treatment_mode = s("condition_diabetes_mellitus_treatmentMode");
            }
            "epilepsy-on-anticonvulsant" => {
                c.anticonvulsant = s("condition_epilepsy_anticonvulsant");
                c.continuous_anticonvulsant_therapy =
                    s("condition_epilepsy_continuousAnticonvulsantTherapy");
            }
            "continuing-physical-disability" => {
                c.cannot_leave_home_unaided = s("condition_disability_cannotLeaveHomeUnaided");
                c.disability_carer_detail = s("condition_disability_carerDetail");
                c.disability_expected_to_be_permanent =
                    s("condition_disability_expectedToBePermanent");
            }
            "cancer-or-effects" => {
                c.cancer_site = s("condition_cancer_site");
                c.cancer_treatment_phase = s("condition_cancer_treatmentPhase");
                c.histology_confirmed = s("condition_cancer_histologyConfirmed");
            }
            _ => {}
        }
        c.practitioner_attestation_notes =
            s(&format!("condition_{prefix}_attestationNotes"));
        data.conditions.push(c);
    }

    // ─── Declaration (Step 9) ───────────────────────────
    data.declaration.signature_present = s("declarationSignaturePresent");
    data.declaration.access_to_medical_records = s("declarationAccessToMedicalRecords");
    data.declaration.declaration_text = s("declarationText");
    data.declaration.signature_date = s("declarationSignatureDate");

    // ─── Step 10 notes ──────────────────────────────────
    data.notes = s("applicationNotes");

    data
}

/// Map a condition code (kebab-case) to the form-name prefix (snake_case-ish
/// short form). These prefixes match the `name=` attributes used in the
/// template inputs.
fn condition_form_prefix(code: &str) -> &'static str {
    match code {
        "permanent-fistula" => "permanent_fistula",
        "hypoadrenalism" => "hypoadrenalism",
        "diabetes-insipidus-or-hypopituitarism" => "diabetes_insipidus",
        "diabetes-mellitus-not-diet-only" => "diabetes_mellitus",
        "hypoparathyroidism" => "hypoparathyroidism",
        "myasthenia-gravis" => "myasthenia_gravis",
        "myxoedema" => "myxoedema",
        "epilepsy-on-anticonvulsant" => "epilepsy",
        "continuing-physical-disability" => "disability",
        "cancer-or-effects" => "cancer",
        _ => "unknown",
    }
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
        .route("/application/new", post(new_application))
        .route("/application/{id}", get(show))
        .route("/application/{id}/submit", post(submit))
        .route("/application/{id}/report", get(report))
}
