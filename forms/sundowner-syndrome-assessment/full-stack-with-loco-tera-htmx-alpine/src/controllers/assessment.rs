use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::{sundowner_grader, types::AssessmentData};
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

/// GET /assessment/{id} -- render the single-page assessment wizard.
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
        "cognitive_status" => "cognitiveStatus",
        "behavioural_symptoms" => "behaviouralSymptoms",
        "temporal_pattern" => "temporalPattern",
        "trigger_identification" => "triggerIdentification",
        "sleep_wake_cycle" => "sleepWakeCycle",
        "medication_review" => "medicationReview",
        "environmental_assessment" => "environmentalAssessment",
        "carer_impact" => "carerImpact",
        "management_plan" => "managementPlan",
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
            // Collect dynamic medication[idx].field entries.
            let mut medications: std::collections::BTreeMap<
                usize,
                serde_json::Map<String, serde_json::Value>,
            > = std::collections::BTreeMap::new();

            // Collect CMAI / NPI nested keys.
            let mut cmai_updates: serde_json::Map<String, serde_json::Value> =
                serde_json::Map::new();
            let mut npi_updates: std::collections::BTreeMap<
                String,
                serde_json::Map<String, serde_json::Value>,
            > = std::collections::BTreeMap::new();

            for (key, value) in form_obj {
                // current_medications[0].name -- dynamic medication list.
                if key.starts_with("current_medications[") {
                    if let Some(bracket_end) = key.find(']') {
                        if let Ok(idx) =
                            key[key.find('[').unwrap() + 1..bracket_end].parse::<usize>()
                        {
                            if let Some(dot_pos) = key.find("].") {
                                let field_name = &key[dot_pos + 2..];
                                let json_field = field_to_json(field_name);
                                let parsed = parse_form_value(value);
                                medications
                                    .entry(idx)
                                    .or_default()
                                    .insert(json_field, parsed);
                            }
                        }
                    }
                    continue;
                }

                // behavioural_symptoms.cmai.cmai01 -- nested CMAI key.
                if let Some(rest) = key.strip_prefix("behavioural_symptoms.cmai.") {
                    cmai_updates.insert(rest.to_string(), parse_form_value(value));
                    continue;
                }

                // behavioural_symptoms.npi.<domain>.frequency / .severity
                if let Some(rest) = key.strip_prefix("behavioural_symptoms.npi.") {
                    let parts: Vec<&str> = rest.splitn(2, '.').collect();
                    if parts.len() == 2 {
                        npi_updates
                            .entry(parts[0].to_string())
                            .or_default()
                            .insert(parts[1].to_string(), parse_form_value(value));
                    }
                    continue;
                }

                // section.field -- the standard dotted name pattern.
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

            // Materialize medications as an array (drop empty rows).
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
                if let Some(med_review) = obj
                    .get_mut("medicationReview")
                    .and_then(|s| s.as_object_mut())
                {
                    med_review.insert(
                        "currentMedications".to_string(),
                        serde_json::Value::Array(items),
                    );
                }
            }

            // Merge CMAI updates.
            if !cmai_updates.is_empty() {
                let bs = obj
                    .entry("behaviouralSymptoms".to_string())
                    .or_insert_with(|| serde_json::json!({}));
                if let Some(bs_obj) = bs.as_object_mut() {
                    let cmai_entry = bs_obj
                        .entry("cmai".to_string())
                        .or_insert_with(|| serde_json::json!({}));
                    if let Some(cmai_obj) = cmai_entry.as_object_mut() {
                        for (k, v) in cmai_updates {
                            cmai_obj.insert(k, v);
                        }
                    }
                }
            }

            // Merge NPI updates.
            if !npi_updates.is_empty() {
                let bs = obj
                    .entry("behaviouralSymptoms".to_string())
                    .or_insert_with(|| serde_json::json!({}));
                if let Some(bs_obj) = bs.as_object_mut() {
                    let npi_entry = bs_obj
                        .entry("npi".to_string())
                        .or_insert_with(|| serde_json::json!({}));
                    if let Some(npi_obj) = npi_entry.as_object_mut() {
                        for (domain, updates) in npi_updates {
                            let domain_entry = npi_obj
                                .entry(domain)
                                .or_insert_with(|| serde_json::json!({ "frequency": 0, "severity": 0 }));
                            if let Some(domain_obj) = domain_entry.as_object_mut() {
                                for (k, v) in updates {
                                    domain_obj.insert(k, v);
                                }
                            }
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

    let grade = sundowner_grader::grade(&assessment_data);

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
    context.insert("cmai_score", &grade.cmai_score);
    context.insert("npi_score", &grade.npi_score);
    context.insert("severity", &grade.severity);
    context.insert(
        "severity_label",
        &crate::engine::utils::severity_label(&grade.severity),
    );
    context.insert("cmai_answered_count", &grade.cmai_answered_count);
    context.insert("npi_answered_count", &grade.npi_answered_count);
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
