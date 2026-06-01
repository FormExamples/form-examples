use std::collections::BTreeMap;
use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::{
    ips_validator,
    types::AssessmentData,
    utils::completeness_level_class,
};
use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};
use crate::views::assessment::build_assessment_context;

/// POST /assessment/new -- create a new draft IPS, redirect to the wizard.
#[debug_handler]
async fn create_new(State(ctx): State<AppContext>) -> Result<Response> {
    let item = ActiveModel::new_draft()
        .map_err(|e| Error::BadRequest(format!("Failed to create IPS: {e}")))?;
    let item = item.insert(&ctx.db).await?;
    let id = item.id;
    Ok(Redirect::to(&format!("/assessment/{id}")).into_response())
}

/// GET /assessment/{id} -- render the single-page IPS wizard.
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

/// Convert a snake_case form section name to its camelCase JSON key.
fn section_to_json(section: &str) -> &str {
    match section {
        "patient_demographics" => "patientDemographics",
        "problem_list" => "problemList",
        "medication_summary" => "medicationSummary",
        "allergies_intolerances" => "allergiesIntolerances",
        "immunisations" => "immunisations",
        "procedures" => "procedures",
        "results_investigations" => "resultsInvestigations",
        "medical_devices" => "medicalDevices",
        "advance_directives" => "advanceDirectives",
        "authoring_clinician" => "authoringClinician",
        other => other,
    }
}

/// Convert a snake_case field name to its camelCase JSON key.
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

/// Parse a form value: empty strings stay as `""`, otherwise pass through.
fn parse_form_value(value: &serde_json::Value) -> serde_json::Value {
    value.clone()
}

/// Sections that are arrays of objects in the JSONB blob.
const LIST_SECTIONS: &[&str] = &[
    "problem_list",
    "medication_summary",
    "allergies_intolerances",
    "immunisations",
    "procedures",
    "results_investigations",
    "medical_devices",
];

/// Is the supplied row object "empty" (no usable content)?
fn row_is_empty(row: &serde_json::Map<String, serde_json::Value>) -> bool {
    row.values().all(|v| match v {
        serde_json::Value::String(s) => s.trim().is_empty(),
        serde_json::Value::Null => true,
        _ => false,
    })
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
            // Per-list-section collection: section -> idx -> field map.
            let mut lists: BTreeMap<
                &str,
                BTreeMap<usize, serde_json::Map<String, serde_json::Value>>,
            > = BTreeMap::new();
            for s in LIST_SECTIONS {
                lists.insert(s, BTreeMap::new());
            }

            for (key, value) in form_obj {
                // section[idx].field — repeating list rows.
                let matched_list = LIST_SECTIONS
                    .iter()
                    .find(|s| key.starts_with(&format!("{s}[")));
                if let Some(section) = matched_list {
                    let after = &key[section.len()..];
                    if let Some(bracket_end) = after.find(']') {
                        if let Ok(idx) = after[1..bracket_end].parse::<usize>() {
                            if let Some(dot_pos) = after.find("].") {
                                let field_name = &after[dot_pos + 2..];
                                let json_field = field_to_json(field_name);
                                let parsed = parse_form_value(value);
                                lists
                                    .get_mut(section)
                                    .unwrap()
                                    .entry(idx)
                                    .or_default()
                                    .insert(json_field, parsed);
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

            // Materialize each list section, dropping rows with no content.
            for section in LIST_SECTIONS {
                let json_key = section_to_json(section);
                let items: Vec<serde_json::Value> = lists
                    .get(section)
                    .unwrap()
                    .values()
                    .filter(|row| !row_is_empty(row))
                    .map(|row| serde_json::Value::Object(row.clone()))
                    .collect();
                obj.insert(json_key.to_string(), serde_json::Value::Array(items));
            }
        }
    }

    let mut active: ActiveModel = item.into_active_model();
    active.data = ActiveValue::Set(data_value);
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    Ok(Redirect::to(&format!("/assessment/{id}/report")).into_response())
}

/// GET /assessment/{id}/report -- run the IPS validator, persist the
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
        .map_err(|e| Error::BadRequest(format!("Invalid IPS data: {e}")))?;

    let grade = ips_validator::validate(&assessment_data);

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
        &ips_validator::completeness_level_label(&grade.completeness_level),
    );
    context.insert(
        "completeness_class",
        &completeness_level_class(&grade.completeness_level),
    );
    context.insert("mandatory_populated", &grade.mandatory_populated);
    context.insert("mandatory_total", &grade.mandatory_total);
    context.insert("optional_populated", &grade.optional_populated);
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
