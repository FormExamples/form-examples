use std::sync::Arc;

use axum::{Extension, debug_handler, response::Redirect};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::cfar_validator::validate_cfar;
use crate::engine::flagged_issues::detect_flagged_issues;
use crate::engine::types::{AssessmentData, GradingResult};
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
        "patient_identification" => "patientIdentification",
        "referral_transport" => "referralTransport",
        "situation" => "situation",
        "background" => "background",
        "major_bleeding" => "majorBleeding",
        "airway" => "airway",
        "breathing" => "breathing",
        "circulation" => "circulation",
        "disability" => "disability",
        "exposure" => "exposure",
        "recommendations" => "recommendations",
        "responder_details" => "responderDetails",
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
/// `Option<f64>` / `Option<i32>`. Checkbox values `"on"` become `true`.
fn parse_form_value(value: &serde_json::Value, as_bool: bool) -> serde_json::Value {
    if let Some(s) = value.as_str() {
        if as_bool {
            let truthy = s == "on" || s == "true" || s == "yes" || s == "1";
            return serde_json::Value::Bool(truthy);
        }
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

/// Determine whether a JSON key in a section is a boolean checkbox field.
///
/// We treat any field that ends with `Normal`, `None`, intervention-checkbox
/// names, precaution flag names, and the situation problem-type flags as
/// booleans. Everything else stays as a string / number.
fn is_bool_field(section: &str, key: &str) -> bool {
    if key.ends_with("Normal") || key == "none" || key.ends_with("None") {
        return true;
    }
    match section {
        "situation" => matches!(key, "medical" | "trauma"),
        "majorBleeding" => matches!(
            key,
            "assessmentNormal" | "directPressure" | "deepWoundPacking" | "tourniquet" | "uterineMassage" | "none"
        ),
        "airway" => matches!(
            key,
            "assessmentNormal"
                | "neckImmobilization"
                | "headTiltChinLift"
                | "jawThrust"
                | "chokingCare"
                | "none"
        ),
        "breathing" => matches!(
            key,
            "assessmentNormal" | "maintainedPositionOfComfort" | "none"
        ),
        "circulation" => matches!(
            key,
            "assessmentNormal"
                | "pelvicBinder"
                | "controlMinorBleeding"
                | "fractureCare"
                | "oralHydration"
                | "leftLateralPosition"
                | "none"
        ),
        "disability" => matches!(
            key,
            "assessmentNormal"
                | "spinalImmobilisation"
                | "glucoseGiven"
                | "seizureCare"
                | "highTemperatureCare"
                | "lowTemperatureCare"
                | "none"
        ),
        "exposure" => matches!(
            key,
            "assessmentNormal"
                | "recoveryPosition"
                | "burnCare"
                | "woundCare"
                | "drowningCare"
                | "snakebiteCare"
                | "none"
                | "medicationTakenNone"
        ),
        "recommendations" => matches!(
            key,
            "highlyInfectiousDisease"
                | "spinalImmobilization"
                | "possibleFracture"
                | "fallRisk"
                | "alteredMentalStatus"
                | "other"
        ),
        _ => false,
    }
}

/// Merge a single dotted form key into the JSON `data` object.
fn merge_field(
    obj: &mut serde_json::Map<String, serde_json::Value>,
    section: &str,
    sub_path: &[&str],
    value: &serde_json::Value,
) {
    if sub_path.is_empty() {
        return;
    }
    let section_key = section_to_json(section);

    // Drill down into the section object, creating nested objects as needed.
    let section_obj = obj
        .entry(section_key.to_string())
        .or_insert_with(|| serde_json::Value::Object(serde_json::Map::new()));

    let Some(mut cur) = section_obj.as_object_mut() else {
        return;
    };

    let last_index = sub_path.len() - 1;
    for (i, part) in sub_path.iter().enumerate() {
        let camel = field_to_json(part);
        if i == last_index {
            let as_bool = is_bool_field(section_key, &camel);
            cur.insert(camel, parse_form_value(value, as_bool));
            return;
        }
        let entry = cur
            .entry(camel.clone())
            .or_insert_with(|| serde_json::Value::Object(serde_json::Map::new()));
        if !entry.is_object() {
            *entry = serde_json::Value::Object(serde_json::Map::new());
        }
        cur = entry.as_object_mut().unwrap();
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
                // section.subfield[.subfield...]
                let parts: Vec<&str> = key.split('.').collect();
                if parts.len() < 2 {
                    continue;
                }
                let section = parts[0];
                let sub_path = &parts[1..];
                merge_field(obj, section, sub_path, value);
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

    let validation = validate_cfar(&assessment_data);
    let flagged_issues = detect_flagged_issues(&assessment_data);
    let timestamp = Utc::now().to_rfc3339();

    let grade = GradingResult {
        validation,
        flagged_issues,
        timestamp: timestamp.clone(),
    };

    let result_json = serde_json::to_value(&grade).map_err(Error::wrap)?;
    let mut active: ActiveModel = item.into_active_model();
    active.result = ActiveValue::Set(Some(result_json));
    active.status = ActiveValue::Set("completed".to_string());
    active.updated_at = ActiveValue::Set(Utc::now().into());
    active.update(&ctx.db).await?;

    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("data", &assessment_data);
    context.insert("result", &grade);
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
