use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::{ppe_grader, types::AssessmentData, utils};
use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};
use crate::views::assessment::build_assessment_context;

/// POST /assessment/new -- create a new draft assessment, redirect to the wizard.
#[debug_handler]
async fn create_new(State(ctx): State<AppContext>) -> Result<Response> {
    let item = ActiveModel::new_draft()
        .map_err(|e| Error::BadRequest(format!("Failed to create assessment: {e}")))?;
    let item = item.insert(&ctx.db).await?;
    let id = item.id;
    Ok(Redirect::to(&format!("/assessment/{id}")).into_response())
}

/// GET /assessment/{id} -- render the single-page PPE wizard.
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

/// Convert form section name (snake_case) to JSON key (camelCase).
fn section_to_json(section: &str) -> &str {
    match section {
        "demographics" => "demographics",
        "sport_position_details" => "sportPositionDetails",
        "medical_history" => "medicalHistory",
        "family_history" => "familyHistory",
        "menstrual_history_reds" => "menstrualHistoryReds",
        "cardiovascular_screening" => "cardiovascularScreening",
        "musculoskeletal_screening" => "musculoskeletalScreening",
        "neurological_concussion_baseline" => "neurologicalConcussionBaseline",
        "vision_skin" => "visionSkin",
        "clearance_decision" => "clearanceDecision",
        other => other,
    }
}

/// Convert form field name (snake_case) to JSON key (camelCase).
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

/// Numeric fields that must be parsed as JSON numbers (or null when empty).
fn is_numeric_field(section_json: &str, field_json: &str) -> bool {
    matches!(
        (section_json, field_json),
        ("demographics", "weight")
            | ("demographics", "height")
            | ("demographics", "bmi")
            | ("sportPositionDetails", "hoursPerWeek")
            | ("menstrualHistoryReds", "ageAtMenarche")
            | ("menstrualHistoryReds", "cyclesLast12Months")
            | ("cardiovascularScreening", "restingSystolic")
            | ("cardiovascularScreening", "restingDiastolic")
            | ("cardiovascularScreening", "restingHeartRate")
            | ("neurologicalConcussionBaseline", "totalConcussions")
    )
}

/// Parse a form value. For numeric fields an empty string becomes `null`;
/// a non-empty numeric string becomes a JSON number. For everything else,
/// strings stay as strings.
fn parse_form_value(
    section_json: &str,
    field_json: &str,
    value: &serde_json::Value,
) -> serde_json::Value {
    if let Some(s) = value.as_str() {
        if is_numeric_field(section_json, field_json) {
            let t = s.trim();
            if t.is_empty() {
                return serde_json::Value::Null;
            }
            if let Ok(n) = t.parse::<f64>() {
                return serde_json::json!(n);
            }
            return serde_json::Value::Null;
        }
        if s.is_empty() {
            return serde_json::Value::String(String::new());
        }
        return serde_json::Value::String(s.to_string());
    }
    value.clone()
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

    let mut data_value = item.data.clone();
    if let Some(obj) = data_value.as_object_mut() {
        if let Some(form_obj) = form_data.as_object() {
            for (key, value) in form_obj {
                // section.field -- the standard dotted name pattern.
                let parts: Vec<&str> = key.split('.').collect();
                if parts.len() == 2 {
                    let section = section_to_json(parts[0]);
                    let field = field_to_json(parts[1]);
                    if let Some(section_obj) =
                        obj.get_mut(section).and_then(|s| s.as_object_mut())
                    {
                        let parsed = parse_form_value(section, &field, value);
                        section_obj.insert(field, parsed);
                    }
                }
            }

            // Recompute the RED-S `applicable` flag from sex.
            let is_female = obj
                .get("demographics")
                .and_then(|s| s.get("sex"))
                .and_then(|v| v.as_str())
                .map(|s| s == "female")
                .unwrap_or(false);
            if let Some(reds) = obj
                .get_mut("menstrualHistoryReds")
                .and_then(|s| s.as_object_mut())
            {
                reds.insert(
                    "applicable".to_string(),
                    serde_json::Value::Bool(is_female),
                );
            }

            // Recompute BMI from weight (kg) and height (cm).
            let weight = obj
                .get("demographics")
                .and_then(|s| s.get("weight"))
                .and_then(|v| v.as_f64());
            let height = obj
                .get("demographics")
                .and_then(|s| s.get("height"))
                .and_then(|v| v.as_f64());
            let bmi = utils::calculate_bmi(weight, height);
            if let Some(demo) = obj.get_mut("demographics").and_then(|s| s.as_object_mut()) {
                demo.insert(
                    "bmi".to_string(),
                    match bmi {
                        Some(v) => serde_json::json!(v),
                        None => serde_json::Value::Null,
                    },
                );
            }
        }
    }

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

    let grading = ppe_grader::grade(&assessment_data);

    // Persist the grading result.
    let result_json = serde_json::to_value(&grading).map_err(Error::wrap)?;
    let mut active: ActiveModel = item.into_active_model();
    active.result = ActiveValue::Set(Some(result_json));
    active.status = ActiveValue::Set("completed".to_string());
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("data", &assessment_data);
    context.insert("clearance", &grading.clearance);
    context.insert("clearance_label", &utils::clearance_label(&grading.clearance));
    context.insert("clearance_class", &utils::clearance_class(&grading.clearance));
    context.insert("answered_count", &grading.answered_count);
    context.insert("fired_rules", &grading.fired_rules);
    context.insert("additional_flags", &grading.additional_flags);
    context.insert("timestamp", &grading.timestamp);
    context.insert(
        "bmi_category",
        &utils::bmi_category(assessment_data.demographics.bmi),
    );

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
