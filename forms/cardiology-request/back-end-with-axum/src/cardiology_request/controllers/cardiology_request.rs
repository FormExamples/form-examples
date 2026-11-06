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

use crate::support::prelude::*;
use axum::{Json, debug_handler};
use chrono::Utc;
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;

use crate::engine::grader::calculate_grade;
use crate::engine::types::CardiologyRequest as EngineRequest;
use crate::models::{
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
    /// Insert a row.
    async fn insert(self, db: &PgPool) -> sqlx::Result<cardiology_requests::Model> {
        let now = Utc::now();
        sqlx::query_as(
            "INSERT INTO cardiology_requests (created_at, updated_at, patient_id, \
            clinician_id, status, site_name, setting, referral_date, requested_by_date, \
            requested_service, referral_reason, clinical_question, relevant_history, \
            symptom_chest_pain, chest_pain_character, symptom_breathlessness, nyha_class, \
            symptom_palpitations, symptom_syncope, symptom_oedema, suspected_acs, \
            exertional_syncope, new_onset_heart_failure, ecg_done, ecg_findings, \
            troponin_status, bnp_status, known_coronary_artery_disease, previous_mi, \
            heart_failure, valve_disease, arrhythmia, hypertension, diabetes, \
            current_medications, urgency, supervising_consultant, requester_contact, notes) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, \
            $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, \
            $33, $34, $35, $36, $37, $38, $39) RETURNING *",
        )
        .bind(now)
        .bind(now)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(if self.status.is_empty() {
            "draft".to_string()
        } else {
            self.status
        })
        .bind(self.site_name)
        .bind(self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(self.requested_service)
        .bind(self.referral_reason)
        .bind(self.clinical_question)
        .bind(self.relevant_history)
        .bind(self.symptom_chest_pain)
        .bind(self.chest_pain_character)
        .bind(self.symptom_breathlessness)
        .bind(self.nyha_class)
        .bind(self.symptom_palpitations)
        .bind(self.symptom_syncope)
        .bind(self.symptom_oedema)
        .bind(self.suspected_acs)
        .bind(self.exertional_syncope)
        .bind(self.new_onset_heart_failure)
        .bind(self.ecg_done)
        .bind(self.ecg_findings)
        .bind(self.troponin_status)
        .bind(self.bnp_status)
        .bind(self.known_coronary_artery_disease)
        .bind(self.previous_mi)
        .bind(self.heart_failure)
        .bind(self.valve_disease)
        .bind(self.arrhythmia)
        .bind(self.hypertension)
        .bind(self.diabetes)
        .bind(self.current_medications)
        .bind(self.urgency)
        .bind(self.supervising_consultant)
        .bind(self.requester_contact)
        .bind(self.notes)
        .fetch_one(db)
        .await
    }

    /// Replace the row with this id.
    async fn update(self, db: &PgPool, id: Uuid) -> sqlx::Result<cardiology_requests::Model> {
        let now = Utc::now();
        sqlx::query_as(
            "UPDATE cardiology_requests SET updated_at = $2, deleted_at = NULL, patient_id = \
            $3, clinician_id = $4, status = $5, site_name = $6, setting = $7, referral_date = \
            $8, requested_by_date = $9, requested_service = $10, referral_reason = $11, \
            clinical_question = $12, relevant_history = $13, symptom_chest_pain = $14, \
            chest_pain_character = $15, symptom_breathlessness = $16, nyha_class = $17, \
            symptom_palpitations = $18, symptom_syncope = $19, symptom_oedema = $20, \
            suspected_acs = $21, exertional_syncope = $22, new_onset_heart_failure = $23, \
            ecg_done = $24, ecg_findings = $25, troponin_status = $26, bnp_status = $27, \
            known_coronary_artery_disease = $28, previous_mi = $29, heart_failure = $30, \
            valve_disease = $31, arrhythmia = $32, hypertension = $33, diabetes = $34, \
            current_medications = $35, urgency = $36, supervising_consultant = $37, \
            requester_contact = $38, notes = $39 WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(now)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(if self.status.is_empty() {
            "draft".to_string()
        } else {
            self.status
        })
        .bind(self.site_name)
        .bind(self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(self.requested_service)
        .bind(self.referral_reason)
        .bind(self.clinical_question)
        .bind(self.relevant_history)
        .bind(self.symptom_chest_pain)
        .bind(self.chest_pain_character)
        .bind(self.symptom_breathlessness)
        .bind(self.nyha_class)
        .bind(self.symptom_palpitations)
        .bind(self.symptom_syncope)
        .bind(self.symptom_oedema)
        .bind(self.suspected_acs)
        .bind(self.exertional_syncope)
        .bind(self.new_onset_heart_failure)
        .bind(self.ecg_done)
        .bind(self.ecg_findings)
        .bind(self.troponin_status)
        .bind(self.bnp_status)
        .bind(self.known_coronary_artery_disease)
        .bind(self.previous_mi)
        .bind(self.heart_failure)
        .bind(self.valve_disease)
        .bind(self.arrhythmia)
        .bind(self.hypertension)
        .bind(self.diabetes)
        .bind(self.current_medications)
        .bind(self.urgency)
        .bind(self.supervising_consultant)
        .bind(self.requester_contact)
        .bind(self.notes)
        .fetch_one(db)
        .await
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
        registration_body: clinician
            .map(|c| c.registration_body.clone())
            .unwrap_or_default(),
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
        date_of_birth: patient
            .map(|p| p.birth_date.to_string())
            .unwrap_or_default(),
        status: r.status.clone(),
        site_name: r.site_name.clone(),
        setting: r.setting.clone(),
        requested_by_date: r
            .requested_by_date
            .map(|d| d.to_string())
            .unwrap_or_default(),
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
async fn load_request(db: &PgPool, id: Uuid) -> Result<cardiology_requests::Model> {
    cardiology_requests::Model::find_by_id(db, id)
        .await?
        .ok_or_else(|| Error::NotFound)
}

/// POST /`api/cardiology_requests` -- create a new referral request.
#[debug_handler]
async fn create(
    State(ctx): State<AppContext>,
    Json(params): Json<RequestParams>,
) -> Result<Response> {
    let model = params.insert(&db(&ctx)).await?;
    Ok(Json(model).into_response())
}

/// GET /`api/cardiology_requests` -- list requests (most recent first).
#[debug_handler]
async fn list(State(ctx): State<AppContext>, Query(params): Query<PageParams>) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (limit, offset) = paging::bounds(page);
    let models = sqlx::query_as::<_, cardiology_requests::Model>(
        "SELECT * FROM cardiology_requests ORDER BY created_at DESC, id LIMIT $1 OFFSET $2",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(&db(&ctx))
    .await?;
    let total: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM cardiology_requests")
        .fetch_one(&db(&ctx))
        .await?;
    let headers = page.headers(u64::try_from(total).unwrap_or(0));
    Ok((headers, Json(json!({ "items": models, "total": total }))).into_response())
}

/// GET /`api/cardiology_requests/{id`} -- fetch one request.
#[debug_handler]
async fn show(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let model = load_request(&db(&ctx), id).await?;
    Ok(Json(model).into_response())
}

/// PATCH /`api/cardiology_requests/{id`} -- replace the request fields.
#[debug_handler]
async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<RequestParams>,
) -> Result<Response> {
    load_request(&db(&ctx), id).await?;
    let model = params.update(&db(&ctx), id).await?;
    Ok(Json(model).into_response())
}

/// DELETE /`api/cardiology_requests/{id`} -- remove a request (cascades grade).
#[debug_handler]
async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_request(&db(&ctx), id).await?;
    cardiology_requests::Model::delete(&db(&ctx), id).await?;
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
    let request = load_request(&db(&ctx), id).await?;
    let patient = patients::Model::find_by_id(&db(&ctx), request.patient_id).await?;
    let clinician = clinicians::Model::find_by_id(&db(&ctx), request.clinician_id).await?;

    let engine_request = to_engine_request(&request, patient.as_ref(), clinician.as_ref());
    let grade = calculate_grade(&engine_request);

    let now = Utc::now();
    let mut txn = db(&ctx).begin().await?;

    // Idempotency: drop any prior grade (cascades rules + flags).
    sqlx::query("DELETE FROM cardiology_request_grades WHERE cardiology_request_id = $1")
        .bind(id)
        .execute(&mut *txn)
        .await?;

    let grade_row = sqlx::query_as::<_, cardiology_request_grades::Model>(
        "INSERT INTO cardiology_request_grades (created_at, updated_at, \
        cardiology_request_id, appropriateness_band, safety_band, completeness_percent, \
        triage_tier, target_timeframe, recommendation, clinician_notes, graded_at) VALUES \
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
    )
    .bind(now)
    .bind(now)
    .bind(id)
    .bind(grade.appropriateness_band.clone())
    .bind(grade.safety_band.clone())
    .bind(Some(grade.completeness_percent))
    .bind(grade.triage_tier.clone())
    .bind(grade.target_timeframe.clone())
    .bind(grade.recommendation.clone())
    .bind(String::new())
    .bind(now)
    .fetch_one(&mut *txn)
    .await?;

    for rule in &grade.fired_rules {
        sqlx::query_as::<_, cardiology_request_grade_rules::Model>(
            "INSERT INTO cardiology_request_grade_rules (created_at, updated_at, \
        cardiology_request_grade_id, rule_id, axis, category, description) VALUES ($1, \
        $2, $3, $4, $5, $6, $7) RETURNING *",
        )
        .bind(now)
        .bind(now)
        .bind(grade_row.id)
        .bind(rule.rule_id.clone())
        .bind(rule.axis.clone())
        .bind(rule.category.clone())
        .bind(rule.description.clone())
        .fetch_one(&mut *txn)
        .await?;
    }

    for flag in &grade.flags {
        sqlx::query_as::<_, cardiology_request_grade_flags::Model>(
            "INSERT INTO cardiology_request_grade_flags (created_at, updated_at, \
        cardiology_request_grade_id, flag_id, category, priority, description, \
        suggested_action) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        )
        .bind(now)
        .bind(now)
        .bind(grade_row.id)
        .bind(flag.flag_id.clone())
        .bind(flag.category.clone())
        .bind(flag.priority.clone())
        .bind(flag.description.clone())
        .bind(flag.suggested_action.clone())
        .fetch_one(&mut *txn)
        .await?;
    }

    // Mark the request submitted alongside the grade, in the same transaction.
    sqlx::query("UPDATE cardiology_requests SET status = $2, updated_at = $3 WHERE id = $1")
        .bind(request.id)
        .bind("submitted".to_string())
        .bind(now)
        .execute(&mut *txn)
        .await?;

    txn.commit().await?;

    Ok(Json(grade_row).into_response())
}

/// GET /`api/cardiology_requests/{id}/result` -- read the stored grade back,
/// together with its fired-rule audit trail and safety flags.
#[debug_handler]
async fn result(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let grade = sqlx::query_as::<_, cardiology_request_grades::Model>(
        "SELECT * FROM cardiology_request_grades WHERE cardiology_request_id = $1",
    )
    .bind(id)
    .fetch_optional(&db(&ctx))
    .await?
    .ok_or_else(|| Error::NotFound)?;

    let rules = sqlx::query_as::<_, cardiology_request_grade_rules::Model>(
        "SELECT * FROM cardiology_request_grade_rules WHERE cardiology_request_grade_id = $1",
    )
    .bind(grade.id)
    .fetch_all(&db(&ctx))
    .await?;

    let flags = sqlx::query_as::<_, cardiology_request_grade_flags::Model>(
        "SELECT * FROM cardiology_request_grade_flags WHERE cardiology_request_grade_id = $1",
    )
    .bind(grade.id)
    .fetch_all(&db(&ctx))
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
