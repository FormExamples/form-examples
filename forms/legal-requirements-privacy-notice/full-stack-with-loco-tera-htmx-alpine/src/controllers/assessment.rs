use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::{acknowledgment_grader, types::AssessmentData};
use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};
use crate::views::assessment::build_assessment_context;

/// POST /assessment/new -- create a new draft acknowledgment, redirect to the wizard.
#[debug_handler]
async fn create_new(State(ctx): State<AppContext>) -> Result<Response> {
    let item = ActiveModel::new_draft()
        .map_err(|e| Error::BadRequest(format!("Failed to create acknowledgment: {e}")))?;
    let item = item.insert(&ctx.db).await?;
    let id = item.id;
    Ok(Redirect::to(&format!("/assessment/{id}")).into_response())
}

/// GET /assessment/{id} -- render the single-page acknowledgment wizard.
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
        "patient" => "patient",
        "acknowledgment" => "acknowledgment",
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

/// Parse a form value string. Empty strings stay as `""`; the special
/// strings "on" / "true" / "false" / "1" / "0" become JSON booleans for the
/// `confirmed` checkbox field; numbers are converted to JSON numbers.
fn parse_form_value(field_name: &str, value: &serde_json::Value) -> serde_json::Value {
    if let Some(s) = value.as_str() {
        // Boolean coercion for the confirmation checkbox (HTML sends "on"
        // when checked, nothing when unchecked).
        if field_name == "confirmed" {
            let truthy = matches!(s, "on" | "true" | "1" | "yes");
            return serde_json::Value::Bool(truthy);
        }
        if s.is_empty() {
            serde_json::Value::String(String::new())
        } else if let Ok(n) = s.parse::<f64>() {
            // Avoid coercing strings that happen to look numeric but should
            // remain strings (e.g. dates "2026-06-01" never parse as f64).
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

    // Ensure the confirmed flag defaults to false when the checkbox is not
    // present in the form submission (browsers omit unchecked checkboxes).
    if let Some(obj) = data_value.as_object_mut() {
        if let Some(ack) = obj.get_mut("acknowledgment").and_then(|v| v.as_object_mut()) {
            ack.insert(
                "confirmed".to_string(),
                serde_json::Value::Bool(false),
            );
        }
    }

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
                        section_obj.insert(field.clone(), parse_form_value(&field, value));
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
        .map_err(|e| Error::BadRequest(format!("Invalid acknowledgment data: {e}")))?;

    let grade = acknowledgment_grader::grade(&assessment_data);

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
    context.insert("acknowledgment_status", &grade.acknowledgment_status);
    context.insert(
        "acknowledgment_label",
        &crate::engine::utils::acknowledgment_status_label(&grade.acknowledgment_status),
    );
    context.insert("progress", &grade.progress);
    context.insert("overall_percent", &grade.overall_percent);
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
