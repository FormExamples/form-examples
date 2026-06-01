use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::{snot22_grader, types::AssessmentData};
use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};
use crate::views::assessment::build_assessment_context;

/// POST /assessment/new -- create a new draft assessment, redirect to wizard.
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

/// Convert a form section name (snake_case) to its JSON key (camelCase).
fn section_to_json(section: &str) -> &str {
    match section {
        "demographics" => "demographics",
        "presenting_complaint" => "presentingComplaint",
        "history_of_present_illness" => "historyOfPresentIllness",
        "past_ent_history" => "pastEntHistory",
        "snot22" => "snot22",
        "external_examination" => "externalExamination",
        "otoscopy" => "otoscopy",
        "anterior_rhinoscopy" => "anteriorRhinoscopy",
        "oropharyngeal_neck_examination" => "oropharyngealNeckExamination",
        "clinical_impression_plan" => "clinicalImpressionPlan",
        other => other,
    }
}

/// Convert a form field name (snake_case) to its JSON key (camelCase).
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

/// Parse a form value. Empty strings stay as `""`; integer strings become JSON
/// numbers so the engine can deserialize them as `Option<i32>`.
fn parse_form_value(value: &serde_json::Value, numeric: bool) -> serde_json::Value {
    if let Some(s) = value.as_str() {
        if s.is_empty() {
            if numeric {
                serde_json::Value::Null
            } else {
                serde_json::Value::String(String::new())
            }
        } else if numeric {
            if let Ok(n) = s.parse::<i64>() {
                serde_json::json!(n)
            } else if let Ok(n) = s.parse::<f64>() {
                serde_json::json!(n)
            } else {
                value.clone()
            }
        } else {
            value.clone()
        }
    } else {
        value.clone()
    }
}

/// Is this section a numeric SNOT-22 questionnaire entry?
fn is_numeric_field(section_camel: &str, _field_camel: &str) -> bool {
    section_camel == "snot22"
}

/// Apply a flat dotted key to the nested JSONB blob. Supports two-level
/// patterns (`section.field`) and the otoscopy / rhinoscopy three-level
/// patterns (`section.side.field`).
fn apply_form_entry(
    obj: &mut serde_json::Map<String, serde_json::Value>,
    key: &str,
    value: &serde_json::Value,
) {
    let parts: Vec<&str> = key.split('.').collect();
    match parts.len() {
        2 => {
            let section = section_to_json(parts[0]);
            let field = field_to_json(parts[1]);
            let numeric = is_numeric_field(section, &field);
            if let Some(section_obj) = obj.get_mut(section).and_then(|s| s.as_object_mut()) {
                section_obj.insert(field, parse_form_value(value, numeric));
            }
        }
        3 => {
            // section.side.field -- e.g. otoscopy.right.tympanic_membrane
            let section = section_to_json(parts[0]);
            let side = parts[1]; // "right" or "left"
            let field = field_to_json(parts[2]);
            if let Some(section_obj) = obj.get_mut(section).and_then(|s| s.as_object_mut()) {
                if let Some(side_obj) = section_obj.get_mut(side).and_then(|v| v.as_object_mut()) {
                    side_obj.insert(field, parse_form_value(value, false));
                }
            }
        }
        _ => {}
    }
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
            for (key, value) in form_obj {
                apply_form_entry(obj, key, value);
            }
        }
    }

    let mut active: ActiveModel = item.into_active_model();
    active.data = ActiveValue::Set(data_value);
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    Ok(Redirect::to(&format!("/assessment/{id}/report")).into_response())
}

/// GET /assessment/{id}/report -- run the SNOT-22 grader, persist the
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

    let grade = snot22_grader::grade(&assessment_data);

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
    context.insert("total_score", &grade.total_score);
    context.insert("severity_level", &grade.severity_level);
    context.insert(
        "severity_label",
        &snot22_grader::severity_label(&grade.severity_level),
    );
    context.insert(
        "severity_class",
        &snot22_grader::severity_class(&grade.severity_level),
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
