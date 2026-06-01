use std::sync::Arc;

use axum::{debug_handler, response::Redirect, Extension};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::{composite_grader::calculate_waiting_time_status, types::Card};
use crate::models::{_entities::assessments::ActiveModel, assessments::find_by_id};
use crate::views::assessment::build_assessment_context;

/// POST /assessment/new -- create new card, redirect to the single page.
#[debug_handler]
async fn create_new(State(ctx): State<AppContext>) -> Result<Response> {
    let item = ActiveModel::new_draft()
        .map_err(|e| Error::BadRequest(format!("Failed to create card: {e}")))?;
    let item = item.insert(&ctx.db).await?;
    let id = item.id;
    Ok(Redirect::to(&format!("/assessment/{id}")).into_response())
}

/// GET /assessment/{id} -- render the single-page form.
#[debug_handler]
async fn show_assessment(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let item = find_by_id(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let card: Card = item.card().unwrap_or_default();
    let context = build_assessment_context(&card, id);
    let rendered = tera
        .render("assessment.html.tera", &context)
        .map_err(|e| Error::BadRequest(format!("Template error: {e}")))?;

    Ok(Response::builder()
        .header("Content-Type", "text/html; charset=utf-8")
        .body(axum::body::Body::from(rendered))
        .map_err(Error::wrap)?
        .into_response())
}

/// Map a section name (snake_case) to its JSON key (camelCase).
fn section_to_json(section: &str) -> &str {
    match section {
        "practitioner" => "practitioner",
        "patient" => "patient",
        "referral" => "referral",
        "waiting_list" => "waitingList",
        "appointment" => "appointment",
        "communication" => "communication",
        "signoff" => "signoff",
        other => other,
    }
}

/// Map a field name (snake_case) to its JSON key (camelCase).
fn field_to_json(field: &str) -> String {
    let mut result = String::new();
    for (i, part) in field.split('_').enumerate() {
        if i == 0 {
            result.push_str(part);
        } else {
            let mut chars = part.chars();
            if let Some(c) = chars.next() {
                result.push(c.to_ascii_uppercase());
                result.extend(chars);
            }
        }
    }
    result
}

/// Coerce a form value: numeric strings to JSON numbers, blanks to `null`
/// for numeric/date/time fields (detected by field name suffix).
fn parse_form_value(value: &serde_json::Value, field: &str) -> serde_json::Value {
    if let Some(s) = value.as_str() {
        if s.is_empty() {
            // Numeric / date / time fields become null when empty.
            if field.ends_with("_weeks")
                || field.ends_with("_minutes")
                || field.ends_with("_date")
                || field.ends_with("_time")
            {
                return serde_json::Value::Null;
            }
            return serde_json::Value::String(String::new());
        }
        // Integer-looking weeks / minutes fields parse as numbers.
        if field.ends_with("_weeks") || field.ends_with("_minutes") {
            if let Ok(n) = s.parse::<i64>() {
                return serde_json::json!(n);
            }
        }
        value.clone()
    } else {
        value.clone()
    }
}

/// POST /assessment/{id}/submit -- save form data, redirect to the report.
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
                let parts: Vec<&str> = key.split('.').collect();
                if parts.len() != 2 {
                    continue;
                }
                let section_key = section_to_json(parts[0]);
                let field_snake = parts[1];
                let field_key = field_to_json(field_snake);

                // Lazily create the section object if missing.
                if !obj.contains_key(section_key) {
                    obj.insert(
                        section_key.to_string(),
                        serde_json::Value::Object(serde_json::Map::new()),
                    );
                }
                if let Some(section_obj) =
                    obj.get_mut(section_key).and_then(|s| s.as_object_mut())
                {
                    section_obj.insert(field_key, parse_form_value(value, field_snake));
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

/// GET /assessment/{id}/report -- grade and render the report.
#[debug_handler]
async fn show_report(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let item = find_by_id(&ctx.db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let card: Card = item
        .card()
        .map_err(|e| Error::BadRequest(format!("Invalid card data: {e}")))?;
    let grade = calculate_waiting_time_status(&card, None);

    // Persist the grading result and mark the card as completed.
    let result_json = serde_json::to_value(&grade).map_err(Error::wrap)?;
    let mut active: ActiveModel = item.into_active_model();
    active.result = ActiveValue::Set(Some(result_json));
    active.status = ActiveValue::Set("completed".to_string());
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("data", &card);
    context.insert("waiting_time_status", &grade.waiting_time_status);
    context.insert(
        "waiting_time_label",
        &crate::engine::utils::waiting_time_status_label(&grade.waiting_time_status),
    );
    context.insert("clinical_priority", &grade.clinical_priority);
    context.insert(
        "clinical_priority_label",
        &crate::engine::utils::clinical_priority_label(&grade.clinical_priority),
    );
    context.insert("target_wait_weeks", &grade.target_wait_weeks);
    context.insert("days_waited", &grade.days_waited);
    context.insert("weeks_waited", &grade.weeks_waited);
    context.insert("days_to_target", &grade.days_to_target);
    context.insert("days_to_breach", &grade.days_to_breach);
    context.insert("days_to_appointment", &grade.days_to_appointment);
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
