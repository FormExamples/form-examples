use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::mat_b1_validator::validate_mat_b1;
use crate::engine::types::AssessmentData;
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

/// GET /assessment/{id} -- render the single-page MAT B1 wizard.
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

/// Convert a form section name (snake_case) to the camelCase JSON key.
fn section_to_json(section: &str) -> &str {
    match section {
        "patient_identification" => "patientIdentification",
        "pre_confinement" => "preConfinement",
        "post_confinement" => "postConfinement",
        "issuer" => "issuer",
        "doctor" => "doctor",
        "midwife" => "midwife",
        other => other,
    }
}

/// Convert a snake_case form field to its camelCase JSON key.
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

/// Parse a form value string. Empty strings remain `""`; numbers are passed
/// through as JSON strings (MAT B1 has no numeric fields).
fn parse_form_value(value: &serde_json::Value) -> serde_json::Value {
    if let Some(s) = value.as_str() {
        if s.is_empty() {
            serde_json::Value::String(String::new())
        } else {
            value.clone()
        }
    } else {
        value.clone()
    }
}

/// Merge a single dotted form key (e.g. `issuer.doctor.doctor_name`) into the
/// nested JSON object. Supports either two-level (`section.field`) or
/// three-level (`section.subsection.field`) keys, matching the MAT B1
/// structure (issuer.doctor.* and issuer.midwife.*).
fn merge_form_key(
    obj: &mut serde_json::Map<String, serde_json::Value>,
    key: &str,
    value: serde_json::Value,
) {
    let parts: Vec<&str> = key.split('.').collect();
    match parts.len() {
        2 => {
            let section = section_to_json(parts[0]);
            let field = field_to_json(parts[1]);
            if let Some(section_obj) = obj.get_mut(section).and_then(|s| s.as_object_mut()) {
                section_obj.insert(field, value);
            } else if section == "certificateType" {
                // not a section -- treat as top-level (handled separately).
            } else if parts[0] == "certificate_type" {
                obj.insert("certificateType".to_string(), value);
            }
        }
        3 => {
            let section = section_to_json(parts[0]);
            let subsection = section_to_json(parts[1]);
            let field = field_to_json(parts[2]);
            if let Some(section_obj) = obj.get_mut(section).and_then(|s| s.as_object_mut()) {
                if let Some(sub_obj) =
                    section_obj.get_mut(subsection).and_then(|s| s.as_object_mut())
                {
                    sub_obj.insert(field, value);
                }
            }
        }
        _ => {}
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
            for (key, value) in form_obj {
                // Top-level certificate_type radio.
                if key == "certificate_type" {
                    obj.insert("certificateType".to_string(), parse_form_value(value));
                    continue;
                }
                merge_form_key(obj, key, parse_form_value(value));
            }
        }
    }

    let mut active: ActiveModel = item.into_active_model();
    active.data = ActiveValue::Set(data_value);
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    Ok(Redirect::to(&format!("/assessment/{id}/report")).into_response())
}

/// GET /assessment/{id}/report -- run the validator, persist the result,
/// and render the report template.
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

    let result = validate_mat_b1(&assessment_data);

    // Persist the result.
    let result_json = serde_json::to_value(&result).map_err(Error::wrap)?;
    let mut active: ActiveModel = item.into_active_model();
    active.result = ActiveValue::Set(Some(result_json));
    active.status = ActiveValue::Set("completed".to_string());
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("data", &assessment_data);
    context.insert("result", &result);
    context.insert("timestamp", &result.timestamp);
    context.insert(
        "certificate_type_label",
        crate::engine::utils::certificate_type_label(&result.certificate_type),
    );
    context.insert(
        "issuer_type_label",
        crate::engine::utils::issuer_type_label(&result.issuer_type),
    );
    context.insert(
        "complete_label",
        crate::engine::utils::complete_label(result.complete),
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
