use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::{clavien_dindo_grader, types::AssessmentData};
use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};
use crate::views::assessment::build_assessment_context;

/// POST /assessment/new -- create a new draft report, redirect to the wizard.
#[debug_handler]
async fn create_new(State(ctx): State<AppContext>) -> Result<Response> {
    let item = ActiveModel::new_draft()
        .map_err(|e| Error::BadRequest(format!("Failed to create report: {e}")))?;
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
        "patient_details" => "patientDetails",
        "procedure_details" => "procedureDetails",
        "surgical_team" => "surgicalTeam",
        "intraoperative_findings" => "intraoperativeFindings",
        "anaesthesia_summary" => "anaesthesiaSummary",
        "blood_loss_fluid_balance" => "bloodLossFluidBalance",
        "specimens_implants" => "specimensImplants",
        "immediate_postop_status" => "immediatePostopStatus",
        "complications_assessment" => "complicationsAssessment",
        "postop_plan_instructions" => "postopPlanInstructions",
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

/// Parse a form value string. Empty strings stay as `""`; numbers are
/// converted to JSON numbers so the typed engine deserializes them as
/// `Option<i32>` or `Option<f64>`.
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
            // Collect dynamic complications[idx].field entries.
            let mut complications: std::collections::BTreeMap<
                usize,
                serde_json::Map<String, serde_json::Value>,
            > = std::collections::BTreeMap::new();
            // Collect dynamic specimens[idx].field entries.
            let mut specimens: std::collections::BTreeMap<
                usize,
                serde_json::Map<String, serde_json::Value>,
            > = std::collections::BTreeMap::new();
            // Collect dynamic implants[idx].field entries.
            let mut implants: std::collections::BTreeMap<
                usize,
                serde_json::Map<String, serde_json::Value>,
            > = std::collections::BTreeMap::new();
            // Collect dynamic additional_members[idx].field entries.
            let mut additional_members: std::collections::BTreeMap<
                usize,
                serde_json::Map<String, serde_json::Value>,
            > = std::collections::BTreeMap::new();

            for (key, value) in form_obj {
                // complications[0].description, complications[0].grade, etc.
                if let Some(rest) = key.strip_prefix("complications[") {
                    if let Some(bracket_end) = rest.find(']') {
                        if let Ok(idx) = rest[..bracket_end].parse::<usize>() {
                            if let Some(dot_pos) = rest[bracket_end..].strip_prefix("].") {
                                let json_field = field_to_json(dot_pos);
                                complications
                                    .entry(idx)
                                    .or_default()
                                    .insert(json_field, parse_form_value(value));
                            }
                        }
                    }
                    continue;
                }
                if let Some(rest) = key.strip_prefix("specimens[") {
                    if let Some(bracket_end) = rest.find(']') {
                        if let Ok(idx) = rest[..bracket_end].parse::<usize>() {
                            if let Some(dot_pos) = rest[bracket_end..].strip_prefix("].") {
                                let json_field = field_to_json(dot_pos);
                                specimens
                                    .entry(idx)
                                    .or_default()
                                    .insert(json_field, parse_form_value(value));
                            }
                        }
                    }
                    continue;
                }
                if let Some(rest) = key.strip_prefix("implants[") {
                    if let Some(bracket_end) = rest.find(']') {
                        if let Ok(idx) = rest[..bracket_end].parse::<usize>() {
                            if let Some(dot_pos) = rest[bracket_end..].strip_prefix("].") {
                                let json_field = field_to_json(dot_pos);
                                implants
                                    .entry(idx)
                                    .or_default()
                                    .insert(json_field, parse_form_value(value));
                            }
                        }
                    }
                    continue;
                }
                if let Some(rest) = key.strip_prefix("additional_members[") {
                    if let Some(bracket_end) = rest.find(']') {
                        if let Ok(idx) = rest[..bracket_end].parse::<usize>() {
                            if let Some(dot_pos) = rest[bracket_end..].strip_prefix("].") {
                                let json_field = field_to_json(dot_pos);
                                additional_members
                                    .entry(idx)
                                    .or_default()
                                    .insert(json_field, parse_form_value(value));
                            }
                        }
                    }
                    continue;
                }

                // section.field — the standard dotted name pattern.
                let parts: Vec<&str> = key.split('.').collect();
                if parts.len() == 2 {
                    let section = section_to_json(parts[0]);
                    let field = field_to_json(parts[1]);
                    if let Some(section_obj) =
                        obj.get_mut(section).and_then(|s| s.as_object_mut())
                    {
                        section_obj.insert(field, parse_form_value(value));
                    }
                }
            }

            // Materialize the dynamic arrays.
            if !complications.is_empty() {
                let items: Vec<serde_json::Value> = complications
                    .values()
                    .filter(|entry| {
                        let has_desc = entry
                            .get("description")
                            .and_then(|v| v.as_str())
                            .map(|s| !s.trim().is_empty())
                            .unwrap_or(false);
                        let has_grade = entry
                            .get("grade")
                            .and_then(|v| v.as_str())
                            .map(|s| !s.is_empty())
                            .unwrap_or(false);
                        has_desc || has_grade
                    })
                    .map(|e| serde_json::Value::Object(e.clone()))
                    .collect();
                if let Some(comp_section) = obj
                    .get_mut("complicationsAssessment")
                    .and_then(|s| s.as_object_mut())
                {
                    comp_section.insert(
                        "complications".to_string(),
                        serde_json::Value::Array(items),
                    );
                }
            }
            if !specimens.is_empty() {
                let items: Vec<serde_json::Value> = specimens
                    .values()
                    .filter(|entry| {
                        entry
                            .get("description")
                            .and_then(|v| v.as_str())
                            .map(|s| !s.trim().is_empty())
                            .unwrap_or(false)
                    })
                    .map(|e| serde_json::Value::Object(e.clone()))
                    .collect();
                if let Some(si) = obj
                    .get_mut("specimensImplants")
                    .and_then(|s| s.as_object_mut())
                {
                    si.insert("specimens".to_string(), serde_json::Value::Array(items));
                }
            }
            if !implants.is_empty() {
                let items: Vec<serde_json::Value> = implants
                    .values()
                    .filter(|entry| {
                        entry
                            .get("description")
                            .and_then(|v| v.as_str())
                            .map(|s| !s.trim().is_empty())
                            .unwrap_or(false)
                    })
                    .map(|e| serde_json::Value::Object(e.clone()))
                    .collect();
                if let Some(si) = obj
                    .get_mut("specimensImplants")
                    .and_then(|s| s.as_object_mut())
                {
                    si.insert("implants".to_string(), serde_json::Value::Array(items));
                }
            }
            if !additional_members.is_empty() {
                let items: Vec<serde_json::Value> = additional_members
                    .values()
                    .filter(|entry| {
                        entry
                            .get("name")
                            .and_then(|v| v.as_str())
                            .map(|s| !s.trim().is_empty())
                            .unwrap_or(false)
                    })
                    .map(|e| serde_json::Value::Object(e.clone()))
                    .collect();
                if let Some(team) = obj
                    .get_mut("surgicalTeam")
                    .and_then(|s| s.as_object_mut())
                {
                    team.insert(
                        "additionalMembers".to_string(),
                        serde_json::Value::Array(items),
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
        .map_err(|e| Error::BadRequest(format!("Invalid report data: {e}")))?;

    let grade = clavien_dindo_grader::grade(&assessment_data);

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
    context.insert("overall_grade", &grade.overall_grade);
    context.insert(
        "overall_grade_label",
        &crate::engine::utils::grade_label(&grade.overall_grade),
    );
    context.insert(
        "overall_grade_short_label",
        &crate::engine::utils::grade_short_label(&grade.overall_grade),
    );
    context.insert(
        "overall_grade_badge_class",
        &crate::engine::utils::grade_badge_class(&grade.overall_grade),
    );
    context.insert("complication_count", &grade.complication_count);
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
