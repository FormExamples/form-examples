//! Neurodiversity-adjustment-request CRUD + grade endpoints under
//! `/api/neurodiversity-adjustment-requests`.
//!
//! The relational schema keeps the source-of-truth request in
//! `neurodiversity_adjustment_requests` (with FKs to `workers` and `managers`),
//! and the computed four-axis grade in
//! `neurodiversity_adjustment_request_grades`, with the fired-rule audit trail
//! and compliance flags fanned out into
//! `neurodiversity_adjustment_request_grade_rules` and
//! `neurodiversity_adjustment_request_grade_flags`.
//!
//! The pure [`crate::engine`] is run in the submit endpoint; its output is
//! mapped — in this controller layer — into the three grade tables inside a
//! single transaction (idempotent: any prior grade for the request is deleted
//! first, cascading its rules and flags).

use crate::support::prelude::*;
use axum::debug_handler;
use chrono::Utc;
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;

use crate::engine::grader::calculate_grade;
use crate::engine::types::NeurodiversityAdjustmentRequest as EngineRequest;
use crate::models::{
    managers, neurodiversity_adjustment_request_grade_flags,
    neurodiversity_adjustment_request_grade_rules, neurodiversity_adjustment_request_grades,
    neurodiversity_adjustment_requests, workers,
};

/// Inbound create/update payload for a neurodiversity adjustment request
/// (camelCase on the wire). All request fields plus the worker and manager
/// foreign keys.
#[derive(Debug, Deserialize, Default)]
#[serde(rename_all = "camelCase", default)]
#[allow(clippy::struct_excessive_bools)] // mirrors the form's sql/ boolean columns (source of truth)
struct RequestParams {
    /// Foreign key to the worker the request is for.
    worker_id: Uuid,
    /// Foreign key to the manager / HR contact handling the request.
    manager_id: Uuid,
    status: String,
    requested_by: String,
    request_date: Option<chrono::NaiveDate>,
    requested_start_date: Option<chrono::NaiveDate>,
    condition_adhd: bool,
    condition_autism: bool,
    condition_dyslexia: bool,
    condition_dyspraxia: bool,
    condition_dyscalculia: bool,
    condition_tourettes: bool,
    condition_other: bool,
    condition_other_detail: String,
    diagnosis_status: String,
    considers_disability: String,
    substantial_long_term_impact: bool,
    disclosure_consent: bool,
    difficulty_concentration: bool,
    difficulty_written_communication: bool,
    difficulty_organisation_time: bool,
    difficulty_sensory_overload: bool,
    difficulty_balance_coordination: bool,
    difficulty_social_communication: bool,
    difficulty_memory: bool,
    difficulty_burnout_wellbeing: bool,
    tasks_situations_affected: String,
    worker_strengths: String,
    adjustment_working_environment: bool,
    adjustment_equipment_technology: bool,
    adjustment_working_arrangements: bool,
    adjustment_communication: bool,
    adjustment_support_mentoring: bool,
    adjustment_recruitment_process: bool,
    adjustment_policy_dress: bool,
    adjustment_other: bool,
    adjustments_requested_detail: String,
    supporting_evidence_type: String,
    occupational_health_involved: bool,
    access_to_work_involved: bool,
    current_impact: String,
    at_risk_of_absence: bool,
    urgency: String,
    notes: String,
}

impl RequestParams {
    /// Insert a row.
    async fn insert(self, db: &PgPool) -> sqlx::Result<neurodiversity_adjustment_requests::Model> {
        let now = Utc::now();
        sqlx::query_as(
            "INSERT INTO neurodiversity_adjustment_requests (created_at, updated_at, \
            worker_id, manager_id, status, requested_by, request_date, requested_start_date, \
            condition_adhd, condition_autism, condition_dyslexia, condition_dyspraxia, \
            condition_dyscalculia, condition_tourettes, condition_other, \
            condition_other_detail, diagnosis_status, considers_disability, \
            substantial_long_term_impact, disclosure_consent, difficulty_concentration, \
            difficulty_written_communication, difficulty_organisation_time, \
            difficulty_sensory_overload, difficulty_balance_coordination, \
            difficulty_social_communication, difficulty_memory, difficulty_burnout_wellbeing, \
            tasks_situations_affected, worker_strengths, adjustment_working_environment, \
            adjustment_equipment_technology, adjustment_working_arrangements, \
            adjustment_communication, adjustment_support_mentoring, \
            adjustment_recruitment_process, adjustment_policy_dress, adjustment_other, \
            adjustments_requested_detail, supporting_evidence_type, \
            occupational_health_involved, access_to_work_involved, current_impact, \
            at_risk_of_absence, urgency, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, \
            $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, \
            $42, $43, $44, $45, $46) RETURNING *",
        )
        .bind(now)
        .bind(now)
        .bind(self.worker_id)
        .bind(self.manager_id)
        .bind(if self.status.is_empty() {
            "draft".to_string()
        } else {
            self.status
        })
        .bind(if self.requested_by.is_empty() {
            "worker".to_string()
        } else {
            self.requested_by
        })
        .bind(self.request_date)
        .bind(self.requested_start_date)
        .bind(self.condition_adhd)
        .bind(self.condition_autism)
        .bind(self.condition_dyslexia)
        .bind(self.condition_dyspraxia)
        .bind(self.condition_dyscalculia)
        .bind(self.condition_tourettes)
        .bind(self.condition_other)
        .bind(self.condition_other_detail)
        .bind(self.diagnosis_status)
        .bind(self.considers_disability)
        .bind(self.substantial_long_term_impact)
        .bind(self.disclosure_consent)
        .bind(self.difficulty_concentration)
        .bind(self.difficulty_written_communication)
        .bind(self.difficulty_organisation_time)
        .bind(self.difficulty_sensory_overload)
        .bind(self.difficulty_balance_coordination)
        .bind(self.difficulty_social_communication)
        .bind(self.difficulty_memory)
        .bind(self.difficulty_burnout_wellbeing)
        .bind(self.tasks_situations_affected)
        .bind(self.worker_strengths)
        .bind(self.adjustment_working_environment)
        .bind(self.adjustment_equipment_technology)
        .bind(self.adjustment_working_arrangements)
        .bind(self.adjustment_communication)
        .bind(self.adjustment_support_mentoring)
        .bind(self.adjustment_recruitment_process)
        .bind(self.adjustment_policy_dress)
        .bind(self.adjustment_other)
        .bind(self.adjustments_requested_detail)
        .bind(self.supporting_evidence_type)
        .bind(self.occupational_health_involved)
        .bind(self.access_to_work_involved)
        .bind(self.current_impact)
        .bind(self.at_risk_of_absence)
        .bind(if self.urgency.is_empty() {
            "routine".to_string()
        } else {
            self.urgency
        })
        .bind(self.notes)
        .fetch_one(db)
        .await
    }

    /// Replace the row with this id.
    async fn update(
        self,
        db: &PgPool,
        id: Uuid,
    ) -> sqlx::Result<neurodiversity_adjustment_requests::Model> {
        let now = Utc::now();
        sqlx::query_as(
            "UPDATE neurodiversity_adjustment_requests SET updated_at = $2, worker_id = \
            $3, manager_id = $4, status = $5, requested_by = $6, request_date = $7, \
            requested_start_date = $8, condition_adhd = $9, condition_autism = $10, \
            condition_dyslexia = $11, condition_dyspraxia = $12, condition_dyscalculia = \
            $13, condition_tourettes = $14, condition_other = $15, \
            condition_other_detail = $16, diagnosis_status = $17, considers_disability = \
            $18, substantial_long_term_impact = $19, disclosure_consent = $20, \
            difficulty_concentration = $21, difficulty_written_communication = $22, \
            difficulty_organisation_time = $23, difficulty_sensory_overload = $24, \
            difficulty_balance_coordination = $25, difficulty_social_communication = \
            $26, difficulty_memory = $27, difficulty_burnout_wellbeing = $28, \
            tasks_situations_affected = $29, worker_strengths = $30, \
            adjustment_working_environment = $31, adjustment_equipment_technology = $32, \
            adjustment_working_arrangements = $33, adjustment_communication = $34, \
            adjustment_support_mentoring = $35, adjustment_recruitment_process = $36, \
            adjustment_policy_dress = $37, adjustment_other = $38, \
            adjustments_requested_detail = $39, supporting_evidence_type = $40, \
            occupational_health_involved = $41, access_to_work_involved = $42, \
            current_impact = $43, at_risk_of_absence = $44, urgency = $45, notes = $46 \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(now)
        .bind(self.worker_id)
        .bind(self.manager_id)
        .bind(if self.status.is_empty() {
            "draft".to_string()
        } else {
            self.status
        })
        .bind(if self.requested_by.is_empty() {
            "worker".to_string()
        } else {
            self.requested_by
        })
        .bind(self.request_date)
        .bind(self.requested_start_date)
        .bind(self.condition_adhd)
        .bind(self.condition_autism)
        .bind(self.condition_dyslexia)
        .bind(self.condition_dyspraxia)
        .bind(self.condition_dyscalculia)
        .bind(self.condition_tourettes)
        .bind(self.condition_other)
        .bind(self.condition_other_detail)
        .bind(self.diagnosis_status)
        .bind(self.considers_disability)
        .bind(self.substantial_long_term_impact)
        .bind(self.disclosure_consent)
        .bind(self.difficulty_concentration)
        .bind(self.difficulty_written_communication)
        .bind(self.difficulty_organisation_time)
        .bind(self.difficulty_sensory_overload)
        .bind(self.difficulty_balance_coordination)
        .bind(self.difficulty_social_communication)
        .bind(self.difficulty_memory)
        .bind(self.difficulty_burnout_wellbeing)
        .bind(self.tasks_situations_affected)
        .bind(self.worker_strengths)
        .bind(self.adjustment_working_environment)
        .bind(self.adjustment_equipment_technology)
        .bind(self.adjustment_working_arrangements)
        .bind(self.adjustment_communication)
        .bind(self.adjustment_support_mentoring)
        .bind(self.adjustment_recruitment_process)
        .bind(self.adjustment_policy_dress)
        .bind(self.adjustment_other)
        .bind(self.adjustments_requested_detail)
        .bind(self.supporting_evidence_type)
        .bind(self.occupational_health_involved)
        .bind(self.access_to_work_involved)
        .bind(self.current_impact)
        .bind(self.at_risk_of_absence)
        .bind(if self.urgency.is_empty() {
            "routine".to_string()
        } else {
            self.urgency
        })
        .bind(self.notes)
        .fetch_one(db)
        .await
    }
}

/// Map a persisted relational request (plus its joined worker and manager) onto
/// the pure engine's [`EngineRequest`] input. This is the controller-layer
/// bridge that keeps the engine unchanged.
fn to_engine_request(
    r: &neurodiversity_adjustment_requests::Model,
    worker: Option<&workers::Model>,
    manager: Option<&managers::Model>,
) -> EngineRequest {
    EngineRequest {
        worker_name: worker.map(|w| w.name.clone()).unwrap_or_default(),
        worker_job_title: worker.map(|w| w.job_title.clone()).unwrap_or_default(),
        worker_department: worker.map(|w| w.department.clone()).unwrap_or_default(),
        worker_employment_type: worker
            .map(|w| w.employment_type.clone())
            .unwrap_or_default(),
        worker_work_pattern: worker.map(|w| w.work_pattern.clone()).unwrap_or_default(),
        worker_work_location: worker.map(|w| w.work_location.clone()).unwrap_or_default(),
        worker_employment_start_date: worker
            .and_then(|w| w.employment_start_date.map(|d| d.to_string()))
            .unwrap_or_default(),
        worker_employee_reference: worker
            .and_then(|w| w.employee_reference.clone())
            .unwrap_or_default(),
        worker_email: worker.and_then(|w| w.email.clone()).unwrap_or_default(),
        worker_phone: worker.and_then(|w| w.phone.clone()).unwrap_or_default(),
        manager_name: manager.map(|m| m.name.clone()).unwrap_or_default(),
        manager_role: manager.map(|m| m.role.clone()).unwrap_or_default(),
        manager_job_title: manager.map(|m| m.job_title.clone()).unwrap_or_default(),
        manager_department: manager.map(|m| m.department.clone()).unwrap_or_default(),
        manager_email: manager.and_then(|m| m.email.clone()).unwrap_or_default(),
        manager_phone: manager.and_then(|m| m.phone.clone()).unwrap_or_default(),
        status: r.status.clone(),
        requested_by: r.requested_by.clone(),
        request_date: r.request_date.map(|d| d.to_string()).unwrap_or_default(),
        requested_start_date: r
            .requested_start_date
            .map(|d| d.to_string())
            .unwrap_or_default(),
        condition_adhd: r.condition_adhd,
        condition_autism: r.condition_autism,
        condition_dyslexia: r.condition_dyslexia,
        condition_dyspraxia: r.condition_dyspraxia,
        condition_dyscalculia: r.condition_dyscalculia,
        condition_tourettes: r.condition_tourettes,
        condition_other: r.condition_other,
        condition_other_detail: r.condition_other_detail.clone(),
        diagnosis_status: r.diagnosis_status.clone(),
        considers_disability: r.considers_disability.clone(),
        substantial_long_term_impact: r.substantial_long_term_impact,
        disclosure_consent: r.disclosure_consent,
        difficulty_concentration: r.difficulty_concentration,
        difficulty_written_communication: r.difficulty_written_communication,
        difficulty_organisation_time: r.difficulty_organisation_time,
        difficulty_sensory_overload: r.difficulty_sensory_overload,
        difficulty_balance_coordination: r.difficulty_balance_coordination,
        difficulty_social_communication: r.difficulty_social_communication,
        difficulty_memory: r.difficulty_memory,
        difficulty_burnout_wellbeing: r.difficulty_burnout_wellbeing,
        tasks_situations_affected: r.tasks_situations_affected.clone(),
        worker_strengths: r.worker_strengths.clone(),
        adjustment_working_environment: r.adjustment_working_environment,
        adjustment_equipment_technology: r.adjustment_equipment_technology,
        adjustment_working_arrangements: r.adjustment_working_arrangements,
        adjustment_communication: r.adjustment_communication,
        adjustment_support_mentoring: r.adjustment_support_mentoring,
        adjustment_recruitment_process: r.adjustment_recruitment_process,
        adjustment_policy_dress: r.adjustment_policy_dress,
        adjustment_other: r.adjustment_other,
        adjustments_requested_detail: r.adjustments_requested_detail.clone(),
        supporting_evidence_type: r.supporting_evidence_type.clone(),
        occupational_health_involved: r.occupational_health_involved,
        access_to_work_involved: r.access_to_work_involved,
        current_impact: r.current_impact.clone(),
        at_risk_of_absence: r.at_risk_of_absence,
        urgency: r.urgency.clone(),
        notes: r.notes.clone(),
    }
}

/// Load a request by id, returning `NotFound` if absent.
async fn load_request(db: &PgPool, id: Uuid) -> Result<neurodiversity_adjustment_requests::Model> {
    neurodiversity_adjustment_requests::Model::find_by_id(db, id)
        .await?
        .ok_or_else(|| Error::NotFound)
}

/// POST /api/neurodiversity-adjustment-requests -- create a new request.
#[debug_handler]
async fn create(
    State(ctx): State<AppContext>,
    Json(params): Json<RequestParams>,
) -> Result<Response> {
    let model = params.insert(&db(&ctx)).await?;
    Ok(Json(model).into_response())
}

/// GET /api/neurodiversity-adjustment-requests -- list requests (newest first).
#[debug_handler]
async fn list(State(ctx): State<AppContext>, Query(params): Query<PageParams>) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (limit, offset) = page.bounds();
    let models = sqlx::query_as::<_, neurodiversity_adjustment_requests::Model>(
        "SELECT * FROM neurodiversity_adjustment_requests WHERE deleted_at IS NULL \
            ORDER BY created_at DESC, id LIMIT $1 OFFSET $2",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(&db(&ctx))
    .await?;
    let total: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM neurodiversity_adjustment_requests WHERE deleted_at IS \
            NULL",
    )
    .fetch_one(&db(&ctx))
    .await?;
    Ok(page.respond(total, models))
}

/// GET /api/neurodiversity-adjustment-requests/{id} -- fetch one request.
#[debug_handler]
async fn show(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let model = load_request(&db(&ctx), id).await?;
    Ok(Json(model).into_response())
}

/// PATCH /api/neurodiversity-adjustment-requests/{id} -- replace request fields.
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

/// DELETE /api/neurodiversity-adjustment-requests/{id} -- remove a request
/// (cascades its grade).
#[debug_handler]
async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_request(&db(&ctx), id).await?;
    neurodiversity_adjustment_requests::Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// POST /api/neurodiversity-adjustment-requests/{id}/submit -- run the four-axis
/// engine over the persisted request (joined with its worker and manager), then
/// transactionally persist the computed grade into
/// `neurodiversity_adjustment_request_grades`, one row per fired rule into
/// `neurodiversity_adjustment_request_grade_rules`, and one row per flag into
/// `neurodiversity_adjustment_request_grade_flags`. Idempotent: any prior grade
/// for the request is deleted first (cascading its rules and flags), enforcing
/// the 1:1 request↔grade relationship.
#[debug_handler]
async fn submit(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let request = load_request(&db(&ctx), id).await?;
    let worker = workers::Model::find_by_id(&db(&ctx), request.worker_id).await?;
    let manager = managers::Model::find_by_id(&db(&ctx), request.manager_id).await?;

    let engine_request = to_engine_request(&request, worker.as_ref(), manager.as_ref());
    let grade = calculate_grade(&engine_request);

    let now = Utc::now();
    let mut txn = db(&ctx).begin().await?;

    // Idempotency: drop any prior grade (cascades rules + flags).
    sqlx::query(
        "WITH target AS (UPDATE neurodiversity_adjustment_request_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            neurodiversity_adjustment_request_id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE neurodiversity_adjustment_request_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE \
            neurodiversity_adjustment_request_grade_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            neurodiversity_adjustment_request_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE neurodiversity_adjustment_request_grade_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
    )
    .bind(id)
    .execute(&mut *txn)
    .await?;

    let grade_row = sqlx::query_as::<_, neurodiversity_adjustment_request_grades::Model>(
        "INSERT INTO neurodiversity_adjustment_request_grades (created_at, updated_at, \
        neurodiversity_adjustment_request_id, eligibility_band, impact_band, \
        completeness_percent, priority_tier, target_timeframe, recommendation, \
        manager_notes, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) \
        RETURNING *",
    )
    .bind(now)
    .bind(now)
    .bind(id)
    .bind(grade.eligibility_band.clone())
    .bind(grade.impact_band.clone())
    .bind(Some(grade.completeness_percent))
    .bind(grade.priority_tier.clone())
    .bind(grade.target_timeframe.clone())
    .bind(grade.recommendation.clone())
    .bind(String::new())
    .bind(now)
    .fetch_one(&mut *txn)
    .await?;

    for rule in &grade.fired_rules {
        sqlx::query_as::<_, neurodiversity_adjustment_request_grade_rules::Model>(
            "INSERT INTO neurodiversity_adjustment_request_grade_rules (created_at, \
        updated_at, neurodiversity_adjustment_request_grade_id, rule_id, axis, category, \
        description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
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
        sqlx::query_as::<_, neurodiversity_adjustment_request_grade_flags::Model>(
            "INSERT INTO neurodiversity_adjustment_request_grade_flags (created_at, \
        updated_at, neurodiversity_adjustment_request_grade_id, flag_id, category, \
        priority, description, suggested_action) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) \
        RETURNING *",
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
    sqlx::query(
        "UPDATE neurodiversity_adjustment_requests SET status = $2, updated_at = $3 \
            WHERE id = $1 AND deleted_at IS NULL",
    )
    .bind(request.id)
    .bind("submitted".to_string())
    .bind(now)
    .execute(&mut *txn)
    .await?;

    txn.commit().await?;

    Ok(Json(grade_row).into_response())
}

/// GET /api/neurodiversity-adjustment-requests/{id}/result -- read the stored
/// grade back, together with its fired-rule audit trail and compliance flags.
#[debug_handler]
async fn result(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let grade = sqlx::query_as::<_, neurodiversity_adjustment_request_grades::Model>(
        "SELECT * FROM neurodiversity_adjustment_request_grades WHERE \
            neurodiversity_adjustment_request_id = $1 AND deleted_at IS NULL",
    )
    .bind(id)
    .fetch_optional(&db(&ctx))
    .await?
    .ok_or_else(|| Error::NotFound)?;

    let rules = sqlx::query_as::<_, neurodiversity_adjustment_request_grade_rules::Model>(
        "SELECT * FROM neurodiversity_adjustment_request_grade_rules WHERE \
            neurodiversity_adjustment_request_grade_id = $1 AND deleted_at IS NULL",
    )
    .bind(grade.id)
    .fetch_all(&db(&ctx))
    .await?;

    let flags = sqlx::query_as::<_, neurodiversity_adjustment_request_grade_flags::Model>(
        "SELECT * FROM neurodiversity_adjustment_request_grade_flags WHERE \
            neurodiversity_adjustment_request_grade_id = $1 AND deleted_at IS NULL",
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
        .prefix("api/neurodiversity-adjustment-requests")
        .add("/", get(list))
        .add("/", post(create))
        .add("{id}", get(show))
        .add("{id}", axum::routing::patch(update))
        .add("{id}", axum::routing::delete(remove))
        .add("{id}/submit", post(submit))
        .add("{id}/result", get(result))
}
