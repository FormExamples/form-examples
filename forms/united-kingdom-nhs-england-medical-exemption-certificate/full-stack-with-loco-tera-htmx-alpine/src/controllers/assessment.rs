use std::collections::HashMap;
use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::fp92a_rules::ELIGIBLE_CONDITION_CODES;
use crate::engine::fp92a_validator::validate_fp92a;
use crate::engine::types::{ApplicationData, QualifyingCondition};
use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};
use crate::views::assessment::{build_assessment_context, build_report_context};

/// POST /assessment/new -- create a new draft FP92A application, redirect to wizard.
#[debug_handler]
async fn create_new(State(ctx): State<AppContext>) -> Result<Response> {
    let item = ActiveModel::new_draft()
        .map_err(|e| Error::BadRequest(format!("Failed to create application: {e}")))?;
    let item = item.insert(&ctx.db).await?;
    let id = item.id;
    Ok(Redirect::to(&format!("/assessment/{id}")).into_response())
}

/// GET /assessment/{id} -- render the single-page 10-step FP92A wizard.
#[debug_handler]
async fn show_assessment(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let item = find_by_id(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let data: ApplicationData = item.application_data().unwrap_or_default();

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

/// Map a flat HashMap (from `application/x-www-form-urlencoded`) onto our
/// strongly-typed `ApplicationData`. Unknown / blank fields fall back to
/// defaults. Form field names are flat camelCase, matching the wizard
/// template's `name=` attributes.
fn form_to_application_data(form: &HashMap<String, String>) -> ApplicationData {
    let mut data = ApplicationData::default();
    let s = |k: &str| form.get(k).cloned().unwrap_or_default();

    // Practitioner (Step 1)
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

    // Patient (Step 2 / 4 / 5)
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

    // Existing exemption (Step 3)
    data.existing_exemption.application_kind = s("applicationKind");
    data.existing_exemption.has_existing_certificate = s("hasExistingCertificate");
    data.existing_exemption.previous_certificate_number = s("previousCertificateNumber");
    data.existing_exemption.previous_certificate_expiry_date =
        s("previousCertificateExpiryDate");

    // Qualifying conditions (Step 6 / 7 / 8)
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

    // Declaration (Step 9)
    data.declaration.signature_present = s("declarationSignaturePresent");
    data.declaration.access_to_medical_records = s("declarationAccessToMedicalRecords");
    data.declaration.declaration_text = s("declarationText");
    data.declaration.signature_date = s("declarationSignatureDate");

    // Step 10 notes
    data.notes = s("applicationNotes");

    data
}

/// Map a condition code (kebab-case) to the form-name prefix used in `name=`
/// attributes within the wizard template.
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

/// POST /assessment/{id}/submit -- merge form data into the JSONB blob,
/// redirect to the report.
#[debug_handler]
async fn submit_assessment(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    axum::extract::Form(form): axum::extract::Form<HashMap<String, String>>,
) -> Result<Response> {
    let item = find_by_id(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let new_data = form_to_application_data(&form);
    let data_value = serde_json::to_value(&new_data)
        .map_err(|e| Error::BadRequest(format!("Failed to serialise application data: {e}")))?;

    let mut active: ActiveModel = item.into_active_model();
    active.data = ActiveValue::Set(data_value);
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    Ok(Redirect::to(&format!("/assessment/{id}/report")).into_response())
}

/// GET /assessment/{id}/report -- run the grading engine, persist the
/// result, and render the report template.
#[debug_handler]
async fn show_report(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let item = find_by_id(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let application_data: ApplicationData = item
        .application_data()
        .map_err(|e| Error::BadRequest(format!("Invalid application data: {e}")))?;

    let grade = validate_fp92a(&application_data);

    // Persist the grading result.
    let result_json = serde_json::to_value(&grade).map_err(Error::wrap)?;
    let mut active: ActiveModel = item.into_active_model();
    active.result = ActiveValue::Set(Some(result_json));
    active.status = ActiveValue::Set("completed".to_string());
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    let context = build_report_context(&application_data, &grade, id);
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
