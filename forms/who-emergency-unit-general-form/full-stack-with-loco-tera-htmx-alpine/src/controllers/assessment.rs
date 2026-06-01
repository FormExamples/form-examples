use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::{eu_general_grader, types::AssessmentData};
use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};
use crate::views::assessment::build_assessment_context;

/// POST /assessment/new -- create a new draft encounter, redirect to wizard.
#[debug_handler]
async fn create_new(State(ctx): State<AppContext>) -> Result<Response> {
    let item = ActiveModel::new_draft()
        .map_err(|e| Error::BadRequest(format!("Failed to create encounter: {e}")))?;
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

/// Convert a snake_case section name to its JSON (camelCase) key.
fn section_to_json(section: &str) -> &str {
    match section {
        "patient_registration" => "patientRegistration",
        "chief_complaint_and_vitals" => "chiefComplaintAndVitals",
        "high_risk_signs" => "highRiskSigns",
        "airway" => "airway",
        "breathing" => "breathing",
        "circulation" => "circulation",
        "disability" => "disability",
        "history_of_present_illness" => "historyOfPresentIllness",
        "review_of_systems" => "reviewOfSystems",
        "past_medical_history" => "pastMedicalHistory",
        "physical_exam" => "physicalExam",
        "diagnostics" => "diagnostics",
        "additional_interventions" => "additionalInterventions",
        "assessment_and_plan" => "assessmentAndPlan",
        "reassessment" => "reassessment",
        "disposition" => "disposition",
        other => other,
    }
}

/// Convert a snake_case field name to its JSON (camelCase) key.
fn field_to_json(field: &str) -> String {
    let parts: Vec<&str> = field.split('_').collect();
    let mut result = String::new();
    for (i, part) in parts.iter().enumerate() {
        if i == 0 {
            result.push_str(part);
        } else {
            let mut chars = part.chars();
            if let Some(first) = chars.next() {
                result.push(first.to_ascii_uppercase());
                result.extend(chars);
            }
        }
    }
    result
}

/// Parse a form value string. Empty strings stay as `""`; numbers are
/// converted to JSON numbers; "on" / "true" / "false" become booleans.
fn parse_form_value(value: &serde_json::Value, is_checkbox: bool) -> serde_json::Value {
    if let Some(s) = value.as_str() {
        if is_checkbox {
            return serde_json::Value::Bool(!s.is_empty() && s != "off" && s != "false");
        }
        if s.is_empty() {
            return serde_json::Value::String(String::new());
        }
        if let Ok(n) = s.parse::<f64>() {
            return serde_json::json!(n);
        }
        return value.clone();
    }
    value.clone()
}

/// POST /assessment/{id}/submit -- merge form data into the JSONB blob,
/// then redirect to the report.
#[debug_handler]
async fn submit_assessment(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    axum::extract::Form(form_data): axum::extract::Form<serde_json::Value>,
) -> Result<Response> {
    let item = find_by_id(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let mut data_value = item.data.clone();
    if let Some(obj) = data_value.as_object_mut() {
        if let Some(form_obj) = form_data.as_object() {
            for (key, value) in form_obj {
                // Nested keys (e.g. "chief_complaint_and_vitals.initial_vitals.pulse"
                // or "review_of_systems.general.normal").
                let parts: Vec<&str> = key.split('.').collect();
                if parts.len() < 2 {
                    continue;
                }
                let section_json = section_to_json(parts[0]);
                let is_checkbox_marker = key.ends_with("__cb");
                let strip_cb = |s: &str| s.trim_end_matches("__cb").to_string();
                let parsed = parse_form_value(value, is_checkbox_marker);

                if parts.len() == 2 {
                    // section.field
                    let field_raw = strip_cb(parts[1]);
                    let field_json = field_to_json(&field_raw);
                    if let Some(section_obj) =
                        obj.get_mut(section_json).and_then(|s| s.as_object_mut())
                    {
                        section_obj.insert(field_json, parsed);
                    }
                } else if parts.len() == 3 {
                    // section.subsection.field
                    let sub_raw = parts[1].to_string();
                    let field_raw = strip_cb(parts[2]);
                    let sub_json = field_to_json(&sub_raw);
                    let field_json = field_to_json(&field_raw);
                    if let Some(section_obj) =
                        obj.get_mut(section_json).and_then(|s| s.as_object_mut())
                    {
                        let sub_obj = section_obj
                            .entry(sub_json)
                            .or_insert(serde_json::Value::Object(serde_json::Map::new()));
                        if let Some(sub_map) = sub_obj.as_object_mut() {
                            sub_map.insert(field_json, parsed);
                        }
                    }
                }
            }
        }
    }

    let mut active: ActiveModel = item.into_active_model();
    active.data = ActiveValue::Set(data_value);
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    Ok(Redirect::to(&format!("/assessment/{id}/report")).into_response())
}

/// GET /assessment/{id}/report -- run grading, persist, render the report.
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
        .map_err(|e| Error::BadRequest(format!("Invalid encounter data: {e}")))?;

    let grade = eu_general_grader::grade(&assessment_data);

    let result_json = serde_json::to_value(&grade).map_err(Error::wrap)?;
    let mut active: ActiveModel = item.into_active_model();
    active.result = ActiveValue::Set(Some(result_json));
    active.status = ActiveValue::Set("completed".to_string());
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("data", &assessment_data);
    context.insert("encounter_status", &grade.encounter_status);
    context.insert(
        "encounter_label",
        &crate::engine::utils::encounter_status_label(&grade.encounter_status),
    );
    context.insert("complete", &grade.complete);
    context.insert("total_required", &grade.total_required);
    context.insert("total_satisfied", &grade.total_satisfied);
    context.insert("overall_percent", &grade.overall_percent);
    context.insert("sections", &grade.sections);
    context.insert("fired_rules", &grade.fired_rules);
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
