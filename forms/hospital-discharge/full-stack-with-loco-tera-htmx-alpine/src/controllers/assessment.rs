use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::{discharge_validator, types::AssessmentData};
use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};
use crate::views::assessment::build_assessment_context;

/// POST /assessment/new -- create a new draft discharge, redirect to the wizard.
#[debug_handler]
async fn create_new(State(ctx): State<AppContext>) -> Result<Response> {
    let item = ActiveModel::new_draft()
        .map_err(|e| Error::BadRequest(format!("Failed to create discharge: {e}")))?;
    let item = item.insert(&ctx.db).await?;
    let id = item.id;
    Ok(Redirect::to(&format!("/assessment/{id}")).into_response())
}

/// GET /assessment/{id} -- render the single-page discharge wizard.
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
        "admission_summary" => "admissionSummary",
        "diagnoses" => "diagnoses",
        "procedures_performed" => "proceduresPerformed",
        "discharge_medications" => "dischargeMedications",
        "followup_arrangements" => "followupArrangements",
        "community_care_instructions" => "communityCareInstructions",
        "warning_signs" => "warningSigns",
        "clinician_signoff" => "clinicianSignoff",
        "patient_acknowledgement" => "patientAcknowledgement",
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

/// Parse a form value: empty strings stay as `""`; non-empty numeric strings
/// become JSON numbers so typed engine deserializes them as Option<i32>/f64.
fn parse_form_value(value: &serde_json::Value) -> serde_json::Value {
    if let Some(s) = value.as_str() {
        if s.is_empty() {
            serde_json::Value::String(String::new())
        } else {
            // Leave dates and free text as strings; never coerce here.
            value.clone()
        }
    } else {
        value.clone()
    }
}

/// Repeatable array sections: form keys look like
/// `<section>[<idx>].<field>` (e.g. `diagnoses[0].description`).
/// Maps section name -> JSON key in the assessment.
fn array_section_json_key(section: &str) -> Option<(&'static str, &'static str)> {
    match section {
        "diagnoses" => Some(("diagnoses", "diagnoses")),
        "procedures" => Some(("proceduresPerformed", "procedures")),
        "medications" => Some(("dischargeMedications", "medications")),
        "appointments" => Some(("followupArrangements", "appointments")),
        _ => None,
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
            // Buckets for repeatable array rows: section -> idx -> map of field/value.
            let mut arrays: std::collections::BTreeMap<
                &'static str,
                std::collections::BTreeMap<usize, serde_json::Map<String, serde_json::Value>>,
            > = std::collections::BTreeMap::new();

            for (key, value) in form_obj {
                // <section>[<idx>].<field> -- repeatable rows.
                if let Some(bracket_start) = key.find('[') {
                    if let Some(bracket_end) = key.find(']') {
                        let section = &key[..bracket_start];
                        if let Some((parent_key, child_key)) = array_section_json_key(section) {
                            if let Ok(idx) =
                                key[bracket_start + 1..bracket_end].parse::<usize>()
                            {
                                if let Some(dot_pos) = key.find("].") {
                                    let field_name = &key[dot_pos + 2..];
                                    let json_field = field_to_json(field_name);
                                    let entry = arrays
                                        .entry(parent_key)
                                        .or_default()
                                        .entry(idx)
                                        .or_default();
                                    // The Diagnosis struct keeps the JSON key `type`
                                    // because the front end emits `diagnoses[0].type`.
                                    if parent_key == "diagnoses" && field_name == "type" {
                                        entry.insert(
                                            "type".to_string(),
                                            parse_form_value(value),
                                        );
                                    } else {
                                        entry.insert(json_field, parse_form_value(value));
                                    }
                                    // Stash the child key alongside via a side
                                    // map keyed off section so we know where
                                    // to write the array. We just store the
                                    // child key in arrays' top-level layout
                                    // by tagging it on the BTree key —
                                    // see below.
                                    let _ = child_key;
                                }
                            }
                            continue;
                        }
                    }
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

            // Materialize each array section.
            for (parent_key, by_idx) in arrays.into_iter() {
                let child_key = match parent_key {
                    "diagnoses" => "diagnoses",
                    "proceduresPerformed" => "procedures",
                    "dischargeMedications" => "medications",
                    "followupArrangements" => "appointments",
                    _ => continue,
                };
                let items: Vec<serde_json::Value> = by_idx
                    .into_values()
                    .filter(|entry| {
                        // Drop totally blank rows.
                        entry.values().any(|v| match v {
                            serde_json::Value::String(s) => !s.trim().is_empty(),
                            serde_json::Value::Null => false,
                            _ => true,
                        })
                    })
                    .map(serde_json::Value::Object)
                    .collect();

                if let Some(parent_obj) = obj.get_mut(parent_key).and_then(|s| s.as_object_mut())
                {
                    parent_obj.insert(child_key.to_string(), serde_json::Value::Array(items));
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
        .map_err(|e| Error::BadRequest(format!("Invalid discharge data: {e}")))?;

    let grade = discharge_validator::grade(&assessment_data);

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
    context.insert("completeness_level", &grade.completeness_level);
    context.insert(
        "completeness_label",
        &crate::engine::utils::completeness_label(&grade.completeness_level),
    );
    context.insert(
        "completeness_class",
        &crate::engine::utils::completeness_class(&grade.completeness_level),
    );
    context.insert("mandatory_satisfied", &grade.mandatory_satisfied);
    context.insert("mandatory_total", &grade.mandatory_total);
    context.insert("optional_satisfied", &grade.optional_satisfied);
    context.insert("optional_total", &grade.optional_total);
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
