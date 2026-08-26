//! Cardiology-request CRUD + grade endpoints under `/api/cardiology_requests`.
//!
//! The relational schema keeps the source-of-truth referral in
//! `cardiology_requests` (with FKs to `patients` and `clinicians`), and the
//! computed four-axis vetting grade in `cardiology_request_grades`, with the
//! fired-rule audit trail and safety flags fanned out into
//! `cardiology_request_grade_rules` and `cardiology_request_grade_flags`.
//!
//! The pure [`crate::engine`] is run in the submit endpoint; its output is
//! mapped — in this controller layer — into the three grade tables inside a
//! single transaction (idempotent: any prior grade for the request is deleted
//! first, cascading its rules and flags).

use axum::{debug_handler, Json};
use chrono::Utc;
use loco_rs::prelude::*;
use sea_orm::{
    ActiveValue, ColumnTrait, EntityTrait, QueryFilter, QueryOrder, TransactionTrait,
};
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;

use crate::engine::grader::calculate_grade;
use crate::engine::types::CardiologyRequest as EngineRequest;
use crate::models::_entities::{
    cardiology_request_grade_flags, cardiology_request_grade_rules, cardiology_request_grades,
    cardiology_requests, clinicians, patients,
};

/// Inbound create/update payload for a cardiology request (camelCase on the
/// wire). All referral fields plus the patient and clinician foreign keys.
#[derive(Debug, Deserialize, Default)]
#[serde(rename_all = "camelCase", default)]
#[allow(clippy::struct_excessive_bools)] // mirrors the form's sql/ boolean columns (source of truth)
struct RequestParams {
    /// Foreign key to the patient being referred.
    patient_id: Uuid,
    /// Foreign key to the referring clinician.
    clinician_id: Uuid,
    status: String,
    site_name: String,
    setting: String,
    referral_date: Option<chrono::NaiveDate>,
    requested_by_date: Option<chrono::NaiveDate>,
    requested_service: String,
    referral_reason: String,
    clinical_question: String,
    relevant_history: String,
    symptom_chest_pain: bool,
    chest_pain_character: String,
    symptom_breathlessness: bool,
    nyha_class: String,
    symptom_palpitations: bool,
    symptom_syncope: bool,
    symptom_oedema: bool,
    suspected_acs: bool,
    exertional_syncope: bool,
    new_onset_heart_failure: bool,
    ecg_done: bool,
    ecg_findings: String,
    troponin_status: String,
    bnp_status: String,
    known_coronary_artery_disease: bool,
    previous_mi: bool,
    heart_failure: bool,
    valve_disease: bool,
    arrhythmia: bool,
    hypertension: bool,
    diabetes: bool,
    current_medications: String,
    urgency: String,
    supervising_consultant: String,
    requester_contact: String,
    notes: String,
}

impl RequestParams {
    /// Project the inbound params onto a fresh insert `ActiveModel`.
    fn into_active_model(self) -> cardiology_requests::ActiveModel {
        let now = Utc::now();
        cardiology_requests::ActiveModel {
            created_at: ActiveValue::Set(now.into()),
            updated_at: ActiveValue::Set(now.into()),
            deleted_at: ActiveValue::Set(None),
            patient_id: ActiveValue::Set(self.patient_id),
            clinician_id: ActiveValue::Set(self.clinician_id),
            status: ActiveValue::Set(if self.status.is_empty() {
                "draft".to_string()
            } else {
                self.status
            }),
            site_name: ActiveValue::Set(self.site_name),
            setting: ActiveValue::Set(self.setting),
            referral_date: ActiveValue::Set(self.referral_date),
            requested_by_date: ActiveValue::Set(self.requested_by_date),
            requested_service: ActiveValue::Set(self.requested_service),
            referral_reason: ActiveValue::Set(self.referral_reason),
            clinical_question: ActiveValue::Set(self.clinical_question),
            relevant_history: ActiveValue::Set(self.relevant_history),
            symptom_chest_pain: ActiveValue::Set(self.symptom_chest_pain),
            chest_pain_character: ActiveValue::Set(self.chest_pain_character),
            symptom_breathlessness: ActiveValue::Set(self.symptom_breathlessness),
            nyha_class: ActiveValue::Set(self.nyha_class),
            symptom_palpitations: ActiveValue::Set(self.symptom_palpitations),
            symptom_syncope: ActiveValue::Set(self.symptom_syncope),
            symptom_oedema: ActiveValue::Set(self.symptom_oedema),
            suspected_acs: ActiveValue::Set(self.suspected_acs),
            exertional_syncope: ActiveValue::Set(self.exertional_syncope),
            new_onset_heart_failure: ActiveValue::Set(self.new_onset_heart_failure),
            ecg_done: ActiveValue::Set(self.ecg_done),
            ecg_findings: ActiveValue::Set(self.ecg_findings),
            troponin_status: ActiveValue::Set(self.troponin_status),
            bnp_status: ActiveValue::Set(self.bnp_status),
            known_coronary_artery_disease: ActiveValue::Set(self.known_coronary_artery_disease),
            previous_mi: ActiveValue::Set(self.previous_mi),
            heart_failure: ActiveValue::Set(self.heart_failure),
            valve_disease: ActiveValue::Set(self.valve_disease),
            arrhythmia: ActiveValue::Set(self.arrhythmia),
            hypertension: ActiveValue::Set(self.hypertension),
            diabetes: ActiveValue::Set(self.diabetes),
            current_medications: ActiveValue::Set(self.current_medications),
            urgency: ActiveValue::Set(self.urgency),
            supervising_consultant: ActiveValue::Set(self.supervising_consultant),
            requester_contact: ActiveValue::Set(self.requester_contact),
            notes: ActiveValue::Set(self.notes),
            ..Default::default()
        }
    }
}

/// Map a persisted relational request (plus its joined patient and clinician)
/// onto the pure engine's [`EngineRequest`] input. This is the controller-layer
/// bridge that keeps the engine unchanged.
fn to_engine_request(
    r: &cardiology_requests::Model,
    patient: Option<&patients::Model>,
    clinician: Option<&clinicians::Model>,
) -> EngineRequest {
    EngineRequest {
        referring_clinician: clinician.map(|c| c.name.clone()).unwrap_or_default(),
        referrer_role: clinician.map(|c| c.role.clone()).unwrap_or_default(),
        registration_body: clinician.map(|c| c.registration_body.clone()).unwrap_or_default(),
        registration_number: clinician
            .map(|c| c.registration_number.clone())
            .unwrap_or_default(),
        supervising_consultant: r.supervising_consultant.clone(),
        requester_contact: r.requester_contact.clone(),
        referral_date: r.referral_date.map(|d| d.to_string()).unwrap_or_default(),
        nhs_number: patient
            .map(|p| p.united_kingdom_nhs_number.clone())
            .unwrap_or_default(),
        patient_name: patient.map(|p| p.name.clone()).unwrap_or_default(),
        date_of_birth: patient.map(|p| p.birth_date.to_string()).unwrap_or_default(),
        status: r.status.clone(),
        site_name: r.site_name.clone(),
        setting: r.setting.clone(),
        requested_by_date: r.requested_by_date.map(|d| d.to_string()).unwrap_or_default(),
        requested_service: r.requested_service.clone(),
        referral_reason: r.referral_reason.clone(),
        clinical_question: r.clinical_question.clone(),
        relevant_history: r.relevant_history.clone(),
        symptom_chest_pain: r.symptom_chest_pain,
        chest_pain_character: r.chest_pain_character.clone(),
        symptom_breathlessness: r.symptom_breathlessness,
        nyha_class: r.nyha_class.clone(),
        symptom_palpitations: r.symptom_palpitations,
        symptom_syncope: r.symptom_syncope,
        symptom_oedema: r.symptom_oedema,
        suspected_acs: r.suspected_acs,
        exertional_syncope: r.exertional_syncope,
        new_onset_heart_failure: r.new_onset_heart_failure,
        ecg_done: r.ecg_done,
        ecg_findings: r.ecg_findings.clone(),
        troponin_status: r.troponin_status.clone(),
        bnp_status: r.bnp_status.clone(),
        known_coronary_artery_disease: r.known_coronary_artery_disease,
        previous_mi: r.previous_mi,
        heart_failure: r.heart_failure,
        valve_disease: r.valve_disease,
        arrhythmia: r.arrhythmia,
        hypertension: r.hypertension,
        diabetes: r.diabetes,
        current_medications: r.current_medications.clone(),
        urgency: r.urgency.clone(),
        notes: r.notes.clone(),
    }
}

/// Load a request by id, returning `NotFound` if absent.
async fn load_request(
    db: &impl ConnectionTrait,
    id: Uuid,
) -> Result<cardiology_requests::Model> {
    cardiology_requests::Entity::find_by_id(id)
        .one(db)
        .await?
        .ok_or_else(|| Error::NotFound)
}

/// POST /`api/cardiology_requests` -- create a new referral request.
#[debug_handler]
async fn create(
    State(ctx): State<AppContext>,
    Json(params): Json<RequestParams>,
) -> Result<Response> {
    let model = params.into_active_model().insert(&ctx.db).await?;
    Ok(Json(model).into_response())
}

/// GET /`api/cardiology_requests` -- list requests (most recent first).
#[debug_handler]
async fn list(State(ctx): State<AppContext>) -> Result<Response> {
    let models = cardiology_requests::Entity::find()
        .order_by_desc(cardiology_requests::Column::CreatedAt)
        .all(&ctx.db)
        .await?;
    let total = models.len();
    Ok(Json(json!({ "items": models, "total": total })).into_response())
}

/// GET /`api/cardiology_requests/{id`} -- fetch one request.
#[debug_handler]
async fn show(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let model = load_request(&ctx.db, id).await?;
    Ok(Json(model).into_response())
}

/// PATCH /`api/cardiology_requests/{id`} -- replace the request fields.
#[debug_handler]
async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<RequestParams>,
) -> Result<Response> {
    let existing = load_request(&ctx.db, id).await?;
    let mut active = params.into_active_model();
    active.id = ActiveValue::Unchanged(existing.id);
    active.created_at = ActiveValue::Unchanged(existing.created_at);
    active.updated_at = ActiveValue::Set(Utc::now().into());
    let model = active.update(&ctx.db).await?;
    Ok(Json(model).into_response())
}

/// DELETE /`api/cardiology_requests/{id`} -- remove a request (cascades grade).
#[debug_handler]
async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_request(&ctx.db, id).await?;
    cardiology_requests::Entity::delete_by_id(id)
        .exec(&ctx.db)
        .await?;
    format::empty()
}

/// POST /`api/cardiology_requests/{id}/submit` -- run the four-axis vetting
/// engine over the persisted request (joined with its patient and clinician),
/// then transactionally persist the computed grade into
/// `cardiology_request_grades`, one row per fired rule into
/// `cardiology_request_grade_rules`, and one row per flag into
/// `cardiology_request_grade_flags`. Idempotent: any prior grade for the
/// request is deleted first (cascading its rules and flags), enforcing the 1:1
/// request↔grade relationship.
#[debug_handler]
async fn submit(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let request = load_request(&ctx.db, id).await?;
    let patient = patients::Entity::find_by_id(request.patient_id)
        .one(&ctx.db)
        .await?;
    let clinician = clinicians::Entity::find_by_id(request.clinician_id)
        .one(&ctx.db)
        .await?;

    let engine_request = to_engine_request(&request, patient.as_ref(), clinician.as_ref());
    let grade = calculate_grade(&engine_request);

    let now = Utc::now();
    let txn = ctx.db.begin().await?;

    // Idempotency: drop any prior grade (cascades rules + flags).
    cardiology_request_grades::Entity::delete_many()
        .filter(cardiology_request_grades::Column::CardiologyRequestId.eq(id))
        .exec(&txn)
        .await?;

    let grade_row = cardiology_request_grades::ActiveModel {
        created_at: ActiveValue::Set(now.into()),
        updated_at: ActiveValue::Set(now.into()),
        deleted_at: ActiveValue::Set(None),
        cardiology_request_id: ActiveValue::Set(id),
        appropriateness_band: ActiveValue::Set(grade.appropriateness_band.clone()),
        safety_band: ActiveValue::Set(grade.safety_band.clone()),
        completeness_percent: ActiveValue::Set(Some(grade.completeness_percent)),
        triage_tier: ActiveValue::Set(grade.triage_tier.clone()),
        target_timeframe: ActiveValue::Set(grade.target_timeframe.clone()),
        recommendation: ActiveValue::Set(grade.recommendation.clone()),
        clinician_notes: ActiveValue::Set(String::new()),
        signed_at: ActiveValue::Set(None),
        graded_at: ActiveValue::Set(now.into()),
        ..Default::default()
    }
    .insert(&txn)
    .await?;

    for rule in &grade.fired_rules {
        cardiology_request_grade_rules::ActiveModel {
            created_at: ActiveValue::Set(now.into()),
            updated_at: ActiveValue::Set(now.into()),
            deleted_at: ActiveValue::Set(None),
            cardiology_request_grade_id: ActiveValue::Set(grade_row.id),
            rule_id: ActiveValue::Set(rule.rule_id.clone()),
            axis: ActiveValue::Set(rule.axis.clone()),
            category: ActiveValue::Set(rule.category.clone()),
            description: ActiveValue::Set(rule.description.clone()),
            ..Default::default()
        }
        .insert(&txn)
        .await?;
    }

    for flag in &grade.flags {
        cardiology_request_grade_flags::ActiveModel {
            created_at: ActiveValue::Set(now.into()),
            updated_at: ActiveValue::Set(now.into()),
            deleted_at: ActiveValue::Set(None),
            cardiology_request_grade_id: ActiveValue::Set(grade_row.id),
            flag_id: ActiveValue::Set(flag.flag_id.clone()),
            category: ActiveValue::Set(flag.category.clone()),
            priority: ActiveValue::Set(flag.priority.clone()),
            description: ActiveValue::Set(flag.description.clone()),
            suggested_action: ActiveValue::Set(flag.suggested_action.clone()),
            ..Default::default()
        }
        .insert(&txn)
        .await?;
    }

    // Mark the request submitted alongside the grade, in the same transaction.
    let mut req_active: cardiology_requests::ActiveModel = request.into();
    req_active.status = ActiveValue::Set("submitted".to_string());
    req_active.updated_at = ActiveValue::Set(now.into());
    req_active.update(&txn).await?;

    txn.commit().await?;

    Ok(Json(grade_row).into_response())
}

/// GET /`api/cardiology_requests/{id}/result` -- read the stored grade back,
/// together with its fired-rule audit trail and safety flags.
#[debug_handler]
async fn result(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let grade = cardiology_request_grades::Entity::find()
        .filter(cardiology_request_grades::Column::CardiologyRequestId.eq(id))
        .one(&ctx.db)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let rules = cardiology_request_grade_rules::Entity::find()
        .filter(cardiology_request_grade_rules::Column::CardiologyRequestGradeId.eq(grade.id))
        .all(&ctx.db)
        .await?;

    let flags = cardiology_request_grade_flags::Entity::find()
        .filter(cardiology_request_grade_flags::Column::CardiologyRequestGradeId.eq(grade.id))
        .all(&ctx.db)
        .await?;

    Ok(Json(json!({
        "grade": grade,
        "firedRules": rules,
        "flags": flags,
    }))
    .into_response())
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/cardiology_requests")
        .add("/", get(list))
        .add("/", post(create))
        .add("{id}", get(show))
        .add("{id}", axum::routing::patch(update))
        .add("{id}", axum::routing::delete(remove))
        .add("{id}/submit", post(submit))
        .add("{id}/result", get(result))
}
