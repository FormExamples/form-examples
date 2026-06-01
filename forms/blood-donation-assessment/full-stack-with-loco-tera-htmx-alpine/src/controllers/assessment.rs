use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::{donor_grader, types::AssessmentData, utils};
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

/// Map a form section name (snake_case) to the JSON key (camelCase).
fn section_to_json(section: &str) -> &str {
    match section {
        "donor_demographics" => "donorDemographics",
        "general_health" => "generalHealth",
        "medical_history" => "medicalHistory",
        "recent_illness" => "recentIllness",
        "travel_history" => "travelHistory",
        "lifestyle_risk" => "lifestyleRisk",
        "pregnancy_transfusion" => "pregnancyTransfusion",
        "vital_signs" => "vitalSigns",
        "informed_consent" => "informedConsent",
        "donation_plan" => "donationPlan",
        other => other,
    }
}

/// Convert a form field name (snake_case) into the JSON key (camelCase).
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

/// Fields whose canonical type is numeric and should become a JSON number.
fn is_numeric_field(section: &str, field: &str) -> bool {
    matches!(
        (section, field),
        ("donorDemographics", "weight")
            | ("donorDemographics", "height")
            | ("vitalSigns", "hemoglobin")
            | ("vitalSigns", "systolicBp")
            | ("vitalSigns", "diastolicBp")
            | ("vitalSigns", "pulseBpm")
            | ("vitalSigns", "temperatureCelsius")
    )
}

/// Parse a posted form value into the JSON value the engine expects.
/// Numeric fields become `null` if blank, otherwise a JSON number.
/// All other fields stay as their text representation.
fn parse_form_value(
    value: &serde_json::Value,
    section: &str,
    field: &str,
) -> serde_json::Value {
    let Some(s) = value.as_str() else {
        return value.clone();
    };
    let trimmed = s.trim();
    if is_numeric_field(section, field) {
        if trimmed.is_empty() {
            return serde_json::Value::Null;
        }
        if let Ok(n) = trimmed.parse::<f64>() {
            return serde_json::json!(n);
        }
        return serde_json::Value::Null;
    }
    serde_json::Value::String(s.to_string())
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
            // Collect dynamic medications[i].field and recent_travel[i].field.
            let mut medications: std::collections::BTreeMap<
                usize,
                serde_json::Map<String, serde_json::Value>,
            > = std::collections::BTreeMap::new();
            let mut travel_entries: std::collections::BTreeMap<
                usize,
                serde_json::Map<String, serde_json::Value>,
            > = std::collections::BTreeMap::new();

            for (key, value) in form_obj {
                // Dynamic medications[0].name etc.
                if let Some(rest) = key.strip_prefix("medications[") {
                    if let Some(bracket_end) = rest.find(']') {
                        if let Ok(idx) = rest[..bracket_end].parse::<usize>() {
                            if let Some(dot_rest) = rest[bracket_end + 1..].strip_prefix('.') {
                                let json_field = field_to_json(dot_rest);
                                let parsed = match value.as_str() {
                                    Some(s) => serde_json::Value::String(s.to_string()),
                                    None => value.clone(),
                                };
                                medications
                                    .entry(idx)
                                    .or_default()
                                    .insert(json_field, parsed);
                            }
                        }
                    }
                    continue;
                }
                if let Some(rest) = key.strip_prefix("recent_travel[") {
                    if let Some(bracket_end) = rest.find(']') {
                        if let Ok(idx) = rest[..bracket_end].parse::<usize>() {
                            if let Some(dot_rest) = rest[bracket_end + 1..].strip_prefix('.') {
                                let json_field = field_to_json(dot_rest);
                                let parsed = match value.as_str() {
                                    Some(s) => serde_json::Value::String(s.to_string()),
                                    None => value.clone(),
                                };
                                travel_entries
                                    .entry(idx)
                                    .or_default()
                                    .insert(json_field, parsed);
                            }
                        }
                    }
                    continue;
                }

                // section.field — dotted name pattern.
                let parts: Vec<&str> = key.splitn(2, '.').collect();
                if parts.len() == 2 {
                    let section = section_to_json(parts[0]);
                    let field = field_to_json(parts[1]);
                    if let Some(section_obj) =
                        obj.get_mut(section).and_then(|s| s.as_object_mut())
                    {
                        let parsed = parse_form_value(value, section, &field);
                        section_obj.insert(field, parsed);
                    }
                }
            }

            // Materialize medications under medicalHistory.currentMedications.
            if !medications.is_empty() {
                let items: Vec<serde_json::Value> = medications
                    .values()
                    .filter(|entry| {
                        entry
                            .get("name")
                            .and_then(|v| v.as_str())
                            .unwrap_or("")
                            .trim()
                            .len()
                            > 0
                    })
                    .map(|entry| serde_json::Value::Object(entry.clone()))
                    .collect();
                if let Some(mh) =
                    obj.get_mut("medicalHistory").and_then(|s| s.as_object_mut())
                {
                    mh.insert(
                        "currentMedications".to_string(),
                        serde_json::Value::Array(items),
                    );
                }
            }

            // Materialize travel entries under travelHistory.recentTravel.
            if !travel_entries.is_empty() {
                let items: Vec<serde_json::Value> = travel_entries
                    .values()
                    .filter(|entry| {
                        entry
                            .get("country")
                            .and_then(|v| v.as_str())
                            .unwrap_or("")
                            .trim()
                            .len()
                            > 0
                    })
                    .map(|entry| serde_json::Value::Object(entry.clone()))
                    .collect();
                if let Some(th) =
                    obj.get_mut("travelHistory").and_then(|s| s.as_object_mut())
                {
                    th.insert("recentTravel".to_string(), serde_json::Value::Array(items));
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

    let grade = donor_grader::grade(&assessment_data);

    let result_json = serde_json::to_value(&grade).map_err(Error::wrap)?;
    let mut active: ActiveModel = item.into_active_model();
    active.result = ActiveValue::Set(Some(result_json));
    active.status = ActiveValue::Set("completed".to_string());
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("data", &assessment_data);
    context.insert("eligibility_status", &grade.eligibility_status);
    context.insert(
        "eligibility_label",
        &utils::eligibility_label(&grade.eligibility_status),
    );
    context.insert(
        "eligibility_class",
        &utils::eligibility_class(&grade.eligibility_status),
    );
    context.insert("deferral_window", &grade.deferral_window);
    context.insert("fired_rules", &grade.fired_rules);
    context.insert("additional_flags", &grade.additional_flags);
    context.insert("answered_count", &grade.answered_count);
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
