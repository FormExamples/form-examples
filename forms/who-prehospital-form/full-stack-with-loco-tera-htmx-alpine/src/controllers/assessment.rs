use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::{
    flagged_issues::detect_flagged_issues, prehospital_validator::validate_prehospital,
    types::AssessmentData,
};
use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};
use crate::views::assessment::{PersistedResult, build_assessment_context};

/// POST /assessment/new — create a new draft and redirect to the wizard.
#[debug_handler]
async fn create_new(State(ctx): State<AppContext>) -> Result<Response> {
    let item = ActiveModel::new_draft()
        .map_err(|e| Error::BadRequest(format!("Failed to create assessment: {e}")))?;
    let item = item.insert(&ctx.db).await?;
    let id = item.id;
    Ok(Redirect::to(&format!("/assessment/{id}")).into_response())
}

/// GET /assessment/{id} — render the single-page wizard.
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
        "caller_and_scene" => "callerAndScene",
        "chief_complaint_and_vitals" => "chiefComplaintAndVitals",
        "high_risk_signs" => "highRiskSigns",
        "triage" => "triage",
        "airway" => "airway",
        "breathing" => "breathing",
        "circulation" => "circulation",
        "disability" => "disability",
        "exposure" => "exposure",
        "sample_history" => "sampleHistory",
        "injury_details" => "injuryDetails",
        "physical_exam" => "physicalExam",
        "additional_interventions" => "additionalInterventions",
        "assessment_and_plan" => "assessmentAndPlan",
        "disposition" => "disposition",
        "initial_vitals" => "initialVitals",
        "final_vitals" => "finalVitals",
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

/// Parse a form value string. Empty strings stay as `""`; numeric strings
/// become JSON numbers; the literal "on"/"true" / "off"/"false" tokens for
/// checkbox inputs become JSON booleans.
fn parse_form_value(value: &serde_json::Value) -> serde_json::Value {
    if let Some(s) = value.as_str() {
        if s.is_empty() {
            serde_json::Value::String(String::new())
        } else if s == "on" || s == "true" {
            serde_json::Value::Bool(true)
        } else if s == "off" || s == "false" {
            serde_json::Value::Bool(false)
        } else if let Ok(n) = s.parse::<f64>() {
            serde_json::json!(n)
        } else {
            value.clone()
        }
    } else {
        value.clone()
    }
}

/// Walk a JSON object down a dotted path, creating intermediate objects as
/// needed, and insert the value at the leaf.
fn insert_at_path(
    root: &mut serde_json::Map<String, serde_json::Value>,
    path: &[String],
    value: serde_json::Value,
) {
    if path.is_empty() {
        return;
    }
    if path.len() == 1 {
        root.insert(path[0].clone(), value);
        return;
    }
    let head = &path[0];
    let entry = root
        .entry(head.clone())
        .or_insert_with(|| serde_json::Value::Object(serde_json::Map::new()));
    if let Some(obj) = entry.as_object_mut() {
        insert_at_path(obj, &path[1..], value);
    }
}

/// POST /assessment/{id}/submit — merge form data into the JSONB blob and
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
            // Collect dynamic reassessments[idx].field entries.
            let mut reassessments: std::collections::BTreeMap<
                usize,
                serde_json::Map<String, serde_json::Value>,
            > = std::collections::BTreeMap::new();

            for (key, value) in form_obj {
                // reassessments[0].field — dynamic vital-sign rows.
                if let Some(rest) = key.strip_prefix("reassessments[") {
                    if let Some(bracket_end) = rest.find(']') {
                        if let Ok(idx) = rest[..bracket_end].parse::<usize>() {
                            if let Some(dot_pos) = rest.find("].") {
                                let field_name = &rest[dot_pos + 2..];
                                let json_field = field_to_json(field_name);
                                let parsed = parse_form_value(value);
                                reassessments
                                    .entry(idx)
                                    .or_default()
                                    .insert(json_field, parsed);
                            }
                        }
                    }
                    continue;
                }

                // section.field[.subfield] — standard dotted name pattern.
                let parts: Vec<&str> = key.split('.').collect();
                if parts.len() >= 2 {
                    let json_path: Vec<String> = std::iter::once(section_to_json(parts[0]).to_string())
                        .chain(parts[1..].iter().map(|p| {
                            // Nested field segment: lower-snake -> camel.
                            // The very last segment is always a field, intermediate
                            // segments (e.g. initial_vitals) are section-like.
                            field_to_json(p)
                        }))
                        .collect();
                    insert_at_path(obj, &json_path, parse_form_value(value));
                }
            }

            // Materialise reassessments as an array (drop empty rows).
            if !reassessments.is_empty() {
                let items: Vec<serde_json::Value> = reassessments
                    .values()
                    .filter(|entry| {
                        // Keep rows where any field is non-empty.
                        entry.iter().any(|(_, v)| match v {
                            serde_json::Value::String(s) => !s.is_empty(),
                            serde_json::Value::Number(_) => true,
                            serde_json::Value::Bool(b) => *b,
                            _ => false,
                        })
                    })
                    .map(|entry| serde_json::Value::Object(entry.clone()))
                    .collect();
                obj.insert("reassessments".to_string(), serde_json::Value::Array(items));
            }
        }
    }

    let mut active: ActiveModel = item.into_active_model();
    active.data = ActiveValue::Set(data_value);
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    Ok(Redirect::to(&format!("/assessment/{id}/report")).into_response())
}

/// GET /assessment/{id}/report — run the validator + flagged-issue engine,
/// persist the result, and render the report.
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

    let validation = validate_prehospital(&assessment_data);
    let flagged_issues = detect_flagged_issues(&assessment_data);
    let timestamp = Utc::now().to_rfc3339();

    let persisted = PersistedResult {
        validation: validation.clone(),
        flagged_issues: flagged_issues.clone(),
        timestamp: timestamp.clone(),
    };

    // Persist the grading result.
    let result_json = serde_json::to_value(&persisted).map_err(Error::wrap)?;
    let mut active: ActiveModel = item.into_active_model();
    active.result = ActiveValue::Set(Some(result_json));
    active.status = ActiveValue::Set("completed".to_string());
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("data", &assessment_data);
    context.insert("validation", &validation);
    context.insert("flagged_issues", &flagged_issues);
    context.insert("timestamp", &timestamp);

    let rendered = tera
        .render("report.html.tera", &context)
        .map_err(|e| Error::BadRequest(format!("Template error: {e}")))?;

    Ok(Response::builder()
        .header("Content-Type", "text/html; charset=utf-8")
        .body(axum::body::Body::from(rendered))
        .map_err(Error::wrap)?
        .into_response())
}

/// GET / — landing page.
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
