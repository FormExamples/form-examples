use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::nutrition_grader;
use crate::engine::types::AssessmentData;
use crate::engine::utils::recompute_derived;
use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};
use crate::views::assessment::build_assessment_context;

/// POST /assessment/new -- create a new draft assessment, redirect to the
/// wizard.
#[debug_handler]
async fn create_new(State(ctx): State<AppContext>) -> Result<Response> {
    let item = ActiveModel::new_draft()
        .map_err(|e| Error::BadRequest(format!("Failed to create assessment: {e}")))?;
    let item = item.insert(&ctx.db).await?;
    let id = item.id;
    Ok(Redirect::to(&format!("/assessment/{id}")).into_response())
}

/// GET /assessment/{id} -- render the single-page nutrition-assessment wizard.
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
        "anthropometric_measurements" => "anthropometricMeasurements",
        "dietary_history" => "dietaryHistory",
        "nutritional_screening" => "nutritionalScreening",
        "swallowing_oral_health" => "swallowingOralHealth",
        "gastrointestinal_function" => "gastrointestinalFunction",
        "food_allergies_intolerances" => "foodAllergiesIntolerances",
        "nutritional_requirements" => "nutritionalRequirements",
        "current_nutritional_support" => "currentNutritionalSupport",
        "care_plan_monitoring" => "carePlanMonitoring",
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

/// Heuristic: fields that should be parsed as numeric. Names ending in any
/// of these tokens, or matching certain known names, get their string value
/// converted into a JSON number so the typed engine deserializes them as
/// `Option<i32>` / `Option<f64>`.
fn is_numeric_field(json_field: &str) -> bool {
    json_field.ends_with("Kg")
        || json_field.ends_with("Cm")
        || json_field.ends_with("Mm")
        || json_field.ends_with("Ml")
        || json_field.ends_with("Kcal")
        || json_field.ends_with("Days")
        || json_field.ends_with("PerDay")
        || json_field.ends_with("PerWeek")
        || json_field.ends_with("Percent")
        || json_field == "bmi"
        || json_field == "estimatedProteinG"
}

/// Parse a form value string. Empty strings stay as `""` (or `null` for
/// numeric fields); numbers are converted to JSON numbers so the typed
/// engine deserializes them correctly.
fn parse_form_value(value: &serde_json::Value, numeric: bool) -> serde_json::Value {
    if let Some(s) = value.as_str() {
        if s.is_empty() {
            if numeric {
                serde_json::Value::Null
            } else {
                serde_json::Value::String(String::new())
            }
        } else if numeric {
            if let Ok(n) = s.parse::<f64>() {
                serde_json::json!(n)
            } else {
                serde_json::Value::Null
            }
        } else {
            value.clone()
        }
    } else {
        value.clone()
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

    let mut data_value = item.data.clone();
    if let Some(obj) = data_value.as_object_mut() {
        if let Some(form_obj) = form_data.as_object() {
            // Collect dynamic food_allergies[idx].field and supplement-list
            // entries.
            let mut food_allergies: std::collections::BTreeMap<
                usize,
                serde_json::Map<String, serde_json::Value>,
            > = std::collections::BTreeMap::new();
            let mut food_intolerances: std::collections::BTreeMap<usize, String> =
                std::collections::BTreeMap::new();
            let mut oral_supplements: std::collections::BTreeMap<
                usize,
                serde_json::Map<String, serde_json::Value>,
            > = std::collections::BTreeMap::new();
            let mut vitamin_mineral_list: std::collections::BTreeMap<
                usize,
                serde_json::Map<String, serde_json::Value>,
            > = std::collections::BTreeMap::new();

            for (key, value) in form_obj {
                // Repeating-list rows: food_allergies[idx].field
                if let Some(rest) = key.strip_prefix("food_allergies[") {
                    if let Some(bracket_end) = rest.find(']') {
                        if let Ok(idx) = rest[..bracket_end].parse::<usize>() {
                            if let Some(dot_pos) = rest.find("].") {
                                let field_name = &rest[dot_pos + 2..];
                                let json_field = field_to_json(field_name);
                                let numeric = is_numeric_field(&json_field);
                                let parsed = parse_form_value(value, numeric);
                                food_allergies
                                    .entry(idx)
                                    .or_default()
                                    .insert(json_field, parsed);
                            }
                        }
                    }
                    continue;
                }

                if let Some(rest) = key.strip_prefix("food_intolerances[") {
                    if let Some(bracket_end) = rest.find(']') {
                        if let Ok(idx) = rest[..bracket_end].parse::<usize>() {
                            if let Some(s) = value.as_str() {
                                food_intolerances.insert(idx, s.to_string());
                            }
                        }
                    }
                    continue;
                }

                if let Some(rest) = key.strip_prefix("oral_supplement_list[") {
                    if let Some(bracket_end) = rest.find(']') {
                        if let Ok(idx) = rest[..bracket_end].parse::<usize>() {
                            if let Some(dot_pos) = rest.find("].") {
                                let field_name = &rest[dot_pos + 2..];
                                let json_field = field_to_json(field_name);
                                let parsed = parse_form_value(value, false);
                                oral_supplements
                                    .entry(idx)
                                    .or_default()
                                    .insert(json_field, parsed);
                            }
                        }
                    }
                    continue;
                }

                if let Some(rest) = key.strip_prefix("vitamin_mineral_list[") {
                    if let Some(bracket_end) = rest.find(']') {
                        if let Ok(idx) = rest[..bracket_end].parse::<usize>() {
                            if let Some(dot_pos) = rest.find("].") {
                                let field_name = &rest[dot_pos + 2..];
                                let json_field = field_to_json(field_name);
                                let parsed = parse_form_value(value, false);
                                vitamin_mineral_list
                                    .entry(idx)
                                    .or_default()
                                    .insert(json_field, parsed);
                            }
                        }
                    }
                    continue;
                }

                // Standard dotted name: section.field
                let parts: Vec<&str> = key.split('.').collect();
                if parts.len() == 2 {
                    let section = section_to_json(parts[0]);
                    let field = field_to_json(parts[1]);
                    let numeric = is_numeric_field(&field);
                    if let Some(section_obj) =
                        obj.get_mut(section).and_then(|s| s.as_object_mut())
                    {
                        section_obj.insert(field, parse_form_value(value, numeric));
                    }
                }
            }

            // Materialize food_allergies as an array (drop empty rows).
            if !food_allergies.is_empty() {
                let items: Vec<serde_json::Value> = food_allergies
                    .values()
                    .filter(|entry| {
                        entry
                            .get("allergen")
                            .and_then(|v| v.as_str())
                            .unwrap_or("")
                            .trim()
                            .len()
                            > 0
                    })
                    .map(|entry| serde_json::Value::Object(entry.clone()))
                    .collect();
                if let Some(section) = obj
                    .get_mut("foodAllergiesIntolerances")
                    .and_then(|s| s.as_object_mut())
                {
                    section.insert("foodAllergies".to_string(), serde_json::Value::Array(items));
                }
            }

            // Materialize food_intolerances as an array of strings (drop blanks).
            if !food_intolerances.is_empty() {
                let items: Vec<serde_json::Value> = food_intolerances
                    .values()
                    .filter(|s| !s.trim().is_empty())
                    .map(|s| serde_json::Value::String(s.clone()))
                    .collect();
                if let Some(section) = obj
                    .get_mut("foodAllergiesIntolerances")
                    .and_then(|s| s.as_object_mut())
                {
                    section.insert(
                        "foodIntolerances".to_string(),
                        serde_json::Value::Array(items),
                    );
                }
            }

            // Materialize oral_supplement_list.
            if !oral_supplements.is_empty() {
                let items: Vec<serde_json::Value> = oral_supplements
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
                if let Some(section) = obj
                    .get_mut("currentNutritionalSupport")
                    .and_then(|s| s.as_object_mut())
                {
                    section.insert(
                        "oralSupplementList".to_string(),
                        serde_json::Value::Array(items),
                    );
                }
            }

            // Materialize vitamin_mineral_list.
            if !vitamin_mineral_list.is_empty() {
                let items: Vec<serde_json::Value> = vitamin_mineral_list
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
                if let Some(section) = obj
                    .get_mut("currentNutritionalSupport")
                    .and_then(|s| s.as_object_mut())
                {
                    section.insert(
                        "vitaminMineralList".to_string(),
                        serde_json::Value::Array(items),
                    );
                }
            }
        }
    }

    // Recompute derived values (BMI, weight-loss %) before persisting.
    if let Ok(mut typed) = serde_json::from_value::<AssessmentData>(data_value.clone()) {
        recompute_derived(&mut typed);
        if let Ok(v) = serde_json::to_value(&typed) {
            data_value = v;
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

    let mut assessment_data: AssessmentData = item
        .assessment_data()
        .map_err(|e| Error::BadRequest(format!("Invalid assessment data: {e}")))?;
    recompute_derived(&mut assessment_data);

    let grade = nutrition_grader::grade(&assessment_data);

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
    context.insert("must_score", &grade.must_score);
    context.insert("must_risk", &grade.must_risk);
    context.insert(
        "must_risk_label",
        &nutrition_grader::must_risk_label(&grade.must_risk),
    );
    context.insert("severity", &grade.severity);
    context.insert(
        "severity_label",
        &nutrition_grader::severity_label(&grade.severity),
    );
    context.insert(
        "severity_class",
        &nutrition_grader::severity_class(&grade.severity),
    );
    context.insert("answered_count", &grade.answered_count);
    context.insert("fired_rules", &grade.fired_rules);
    context.insert("additional_flags", &grade.additional_flags);
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
