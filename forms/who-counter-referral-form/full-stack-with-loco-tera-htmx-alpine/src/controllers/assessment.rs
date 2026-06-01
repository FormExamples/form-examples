use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::{counter_referral_grader, types::AssessmentData};
use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};
use crate::views::assessment::build_assessment_context;

/// POST /assessment/new -- create a new draft counter-referral form,
/// redirect to the wizard.
#[debug_handler]
async fn create_new(State(ctx): State<AppContext>) -> Result<Response> {
    let item = ActiveModel::new_draft()
        .map_err(|e| Error::BadRequest(format!("Failed to create assessment: {e}")))?;
    let item = item.insert(&ctx.db).await?;
    let id = item.id;
    Ok(Redirect::to(&format!("/assessment/{id}")).into_response())
}

/// GET /assessment/{id} -- render the single-page counter-referral wizard.
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

/// Extract a string field from the form payload.
fn s(form: &serde_json::Value, key: &str) -> String {
    form.get(key)
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string()
}

/// Extract a checkbox field (HTML form sends "on" when ticked, absent when
/// not). Treat the presence of any non-empty string as `true`.
fn cb(form: &serde_json::Value, key: &str) -> bool {
    form.get(key)
        .and_then(|v| v.as_str())
        .map(|s| !s.is_empty())
        .unwrap_or(false)
}

/// Map a flat form payload into the nested AssessmentData structure.
fn form_to_assessment(form: &serde_json::Value) -> AssessmentData {
    use crate::engine::types::*;

    AssessmentData {
        patient_identification: PatientIdentification {
            patient_name: s(form, "patientName"),
            date_of_birth: s(form, "dateOfBirth"),
            sex: s(form, "sex"),
            patient_contact: s(form, "patientContact"),
            emergency_contact: EmergencyContact {
                name: s(form, "emergencyContactName"),
                contact_information: s(form, "emergencyContactInformation"),
            },
        },
        facility_details: FacilityDetails {
            initiating_facility: FacilityContact {
                name: s(form, "initiatingFacilityName"),
                focal_point: s(form, "initiatingFacilityFocalPoint"),
                phone_number: s(form, "initiatingFacilityPhoneNumber"),
            },
            referral_date: s(form, "referralDate"),
            referral_reason: s(form, "referralReason"),
            acuity: s(form, "acuity"),
            referral_facility: FacilityContact {
                name: s(form, "referralFacilityName"),
                focal_point: s(form, "referralFacilityFocalPoint"),
                phone_number: s(form, "referralFacilityPhoneNumber"),
            },
            communication: FacilityCommunication {
                discussed_with_primary_care_provider: cb(form, "discussedWithPrimaryCareProvider"),
                discussed_with_initiating_facility: cb(form, "discussedWithInitiatingFacility"),
            },
            primary_care_facility: FacilityContact {
                name: s(form, "primaryCareFacilityName"),
                focal_point: s(form, "primaryCareFacilityFocalPoint"),
                phone_number: s(form, "primaryCareFacilityPhoneNumber"),
            },
            follow_up_timeframe: s(form, "followUpTimeframe"),
        },
        situation: Situation {
            chief_complaint: s(form, "chiefComplaint"),
            primary_diagnosis: s(form, "primaryDiagnosis"),
            pregnant: s(form, "pregnant"),
            treatments_initiated: s(form, "treatmentsInitiated"),
            icu_stay: cb(form, "icuStay"),
            surgery: cb(form, "surgery"),
            hospitalized: cb(form, "hospitalized"),
        },
        background: Background {
            history_of_present_illness: s(form, "historyOfPresentIllness"),
            past_medical_history: s(form, "pastMedicalHistory"),
            significant_events: s(form, "significantEvents"),
        },
        assessment: Assessment {
            final_diagnoses: s(form, "finalDiagnoses"),
            prognosis_and_goals_of_care: s(form, "prognosisAndGoalsOfCare"),
            patient_family_informed: s(form, "patientFamilyInformed"),
            informed_explanation: s(form, "informedExplanation"),
        },
        recommendations: Recommendations {
            follow_up_plan: s(form, "followUpPlan"),
            pending_investigations: s(form, "pendingInvestigations"),
            follow_up_arrangements: s(form, "followUpArrangements"),
            deterioration_instructions: s(form, "deteriorationInstructions"),
            contact_name: s(form, "contactName"),
            contact_information: s(form, "contactInformation"),
            status_flags: StatusFlags {
                cognitive_impairment: cb(form, "cognitiveImpairment"),
                carer_dependent: cb(form, "carerDependent"),
                spinal_precautions: cb(form, "spinalPrecautions"),
                weight_bearing_restrictions: cb(form, "weightBearingRestrictions"),
                palliative_care: cb(form, "palliativeCare"),
            },
        },
        provider_sign_off: ProviderSignOff {
            provider_name: s(form, "providerName"),
            signature: s(form, "signature"),
            signature_date: s(form, "signatureDate"),
        },
    }
}

/// POST /assessment/{id}/submit -- merge form data into the JSONB blob,
/// redirect to the report.
#[debug_handler]
async fn submit_assessment(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    axum::extract::Form(form_data): axum::extract::Form<serde_json::Value>,
) -> Result<Response> {
    let item = find_by_id(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let data = form_to_assessment(&form_data);
    let data_value =
        serde_json::to_value(&data).map_err(|e| Error::BadRequest(format!("Encode: {e}")))?;

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

    let assessment_data: AssessmentData = item
        .assessment_data()
        .map_err(|e| Error::BadRequest(format!("Invalid assessment data: {e}")))?;

    let grade = counter_referral_grader::grade(&assessment_data);

    // Persist the grading result.
    let result_json = serde_json::to_value(&grade).map_err(Error::wrap)?;
    let mut active: ActiveModel = item.into_active_model();
    active.result = ActiveValue::Set(Some(result_json));
    active.status = ActiveValue::Set("completed".to_string());
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("data", &assessment_data);
    context.insert("form_status", &grade.form_status);
    context.insert(
        "form_status_label",
        &crate::engine::utils::form_status_label(&grade.form_status),
    );
    context.insert("validation", &grade.validation);
    context.insert("overall_percent", &grade.overall_percent);
    context.insert("flagged_issues", &grade.flagged_issues);
    context.insert("timestamp", &grade.timestamp);

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
