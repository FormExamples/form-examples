use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::transfer_validator::grade;
use crate::engine::types::AssessmentData;
use crate::engine::utils::{completeness_label, section_label};
use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};
use crate::views::assessment::build_assessment_context;

/// POST /assessment/new -- create a new draft transfer request, redirect.
#[debug_handler]
async fn create_new(State(ctx): State<AppContext>) -> Result<Response> {
    let item = ActiveModel::new_draft()
        .map_err(|e| Error::BadRequest(format!("Failed to create transfer request: {e}")))?;
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

/// Convert form section name (snake_case) to JSON key (camelCase).
fn section_to_json(section: &str) -> &str {
    match section {
        "requesting_provider" => "requestingProvider",
        "receiving_provider" => "receivingProvider",
        "patient_demographics" => "patientDemographics",
        "situation" => "situation",
        "background" => "background",
        "assessment" => "assessment",
        "recommendation" => "recommendation",
        "transfer_logistics" => "transferLogistics",
        "signoff_acknowledgement" => "signoffAcknowledgement",
        other => other,
    }
}

/// Convert a snake_case field name to camelCase.
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

/// Booleans that live inside `transferLogistics`.
fn is_logistics_bool(field: &str) -> bool {
    matches!(
        field,
        "escortRequired"
            | "oxygenRequired"
            | "cardiacMonitoringRequired"
            | "infectiousPrecautions"
            | "fallsRisk"
            | "mentalCapacityConcerns"
    )
}

/// Booleans that live inside `signoffAcknowledgement`.
fn is_signoff_bool(field: &str) -> bool {
    matches!(field, "acknowledgementReceived")
}

/// Numeric fields nested under `assessment.vitalSigns`.
fn is_vital_sign(field: &str) -> bool {
    matches!(
        field,
        "heartRate"
            | "respiratoryRate"
            | "systolicBloodPressure"
            | "diastolicBloodPressure"
            | "temperatureCelsius"
            | "oxygenSaturation"
            | "newsScore"
    )
}

/// Parse a form value. Empty strings become `""`; numeric-looking strings are
/// converted to JSON numbers so the typed engine deserializes them as
/// `Option<f64>`.
fn parse_form_value(value: &serde_json::Value) -> serde_json::Value {
    if let Some(s) = value.as_str() {
        if s.is_empty() {
            serde_json::Value::String(String::new())
        } else if let Ok(n) = s.parse::<f64>() {
            serde_json::json!(n)
        } else {
            value.clone()
        }
    } else {
        value.clone()
    }
}

/// POST /assessment/{id}/submit -- merge form data into the JSONB blob.
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
            // Track which boolean checkboxes were submitted; the rest become
            // `false` (unchecked checkboxes don't appear in form bodies).
            let mut seen_logistics_bools: std::collections::HashSet<String> =
                std::collections::HashSet::new();
            let mut seen_signoff_bools: std::collections::HashSet<String> =
                std::collections::HashSet::new();

            for (key, value) in form_obj {
                let parts: Vec<&str> = key.split('.').collect();
                // section.field
                if parts.len() == 2 {
                    let section = section_to_json(parts[0]);
                    let field = field_to_json(parts[1]);

                    if section == "transferLogistics" && is_logistics_bool(&field) {
                        let truthy = checkbox_truthy(value);
                        if let Some(section_obj) =
                            obj.get_mut(section).and_then(|s| s.as_object_mut())
                        {
                            section_obj
                                .insert(field.clone(), serde_json::Value::Bool(truthy));
                        }
                        seen_logistics_bools.insert(field);
                        continue;
                    }

                    if section == "signoffAcknowledgement" && is_signoff_bool(&field) {
                        let truthy = checkbox_truthy(value);
                        if let Some(section_obj) =
                            obj.get_mut(section).and_then(|s| s.as_object_mut())
                        {
                            section_obj
                                .insert(field.clone(), serde_json::Value::Bool(truthy));
                        }
                        seen_signoff_bools.insert(field);
                        continue;
                    }

                    if let Some(section_obj) =
                        obj.get_mut(section).and_then(|s| s.as_object_mut())
                    {
                        section_obj.insert(field, parse_form_value(value));
                    }
                    continue;
                }

                // assessment.vital_signs.<field>
                if parts.len() == 3 && parts[0] == "assessment" && parts[1] == "vital_signs" {
                    let field = field_to_json(parts[2]);
                    if !is_vital_sign(&field) {
                        continue;
                    }
                    let parsed = if let Some(s) = value.as_str() {
                        if s.trim().is_empty() {
                            serde_json::Value::Null
                        } else if let Ok(n) = s.parse::<f64>() {
                            serde_json::json!(n)
                        } else {
                            serde_json::Value::Null
                        }
                    } else {
                        value.clone()
                    };
                    if let Some(assessment_obj) =
                        obj.get_mut("assessment").and_then(|s| s.as_object_mut())
                    {
                        if let Some(vital_obj) = assessment_obj
                            .get_mut("vitalSigns")
                            .and_then(|s| s.as_object_mut())
                        {
                            vital_obj.insert(field, parsed);
                        }
                    }
                }
            }

            // Default unchecked checkboxes to false.
            if let Some(section_obj) =
                obj.get_mut("transferLogistics").and_then(|s| s.as_object_mut())
            {
                for f in [
                    "escortRequired",
                    "oxygenRequired",
                    "cardiacMonitoringRequired",
                    "infectiousPrecautions",
                    "fallsRisk",
                    "mentalCapacityConcerns",
                ] {
                    if !seen_logistics_bools.contains(f) {
                        section_obj.insert(f.to_string(), serde_json::Value::Bool(false));
                    }
                }
            }
            if let Some(section_obj) = obj
                .get_mut("signoffAcknowledgement")
                .and_then(|s| s.as_object_mut())
            {
                if !seen_signoff_bools.contains("acknowledgementReceived") {
                    section_obj.insert(
                        "acknowledgementReceived".to_string(),
                        serde_json::Value::Bool(false),
                    );
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

/// Interpret a form value as a checkbox truthy flag.
fn checkbox_truthy(value: &serde_json::Value) -> bool {
    if let Some(s) = value.as_str() {
        matches!(
            s.to_ascii_lowercase().as_str(),
            "on" | "true" | "yes" | "1" | "checked"
        )
    } else if let Some(b) = value.as_bool() {
        b
    } else if let Some(n) = value.as_i64() {
        n != 0
    } else {
        false
    }
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
        .map_err(|e| Error::BadRequest(format!("Invalid transfer data: {e}")))?;

    let result = grade(&assessment_data);

    // Persist the grading result.
    let result_json = serde_json::to_value(&result).map_err(Error::wrap)?;
    let mut active: ActiveModel = item.into_active_model();
    active.result = ActiveValue::Set(Some(result_json));
    active.status = ActiveValue::Set("completed".to_string());
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("data", &assessment_data);
    context.insert("validation", &result.validation);
    context.insert(
        "completeness_label",
        &completeness_label(&result.validation.completeness),
    );
    // Per-section friendly labels for the report.
    let section_labels: Vec<(String, String)> = result
        .validation
        .sections
        .iter()
        .map(|s| (s.section.clone(), section_label(&s.section)))
        .collect();
    context.insert("section_labels", &section_labels);
    context.insert("flags", &result.flags);
    context.insert("timestamp", &result.timestamp);

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
