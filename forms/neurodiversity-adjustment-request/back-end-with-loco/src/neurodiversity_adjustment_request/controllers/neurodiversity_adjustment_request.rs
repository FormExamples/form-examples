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
use crate::engine::types::NeurodiversityAdjustmentRequest as EngineRequest;
use crate::models::_entities::{
    managers, neurodiversity_adjustment_request_grade_flags,
    neurodiversity_adjustment_request_grade_rules, neurodiversity_adjustment_request_grades,
    neurodiversity_adjustment_requests, workers,
};

/// Inbound create/update payload for a neurodiversity adjustment request
/// (camelCase on the wire). All request fields plus the worker and manager
/// foreign keys.
#[derive(Debug, Deserialize, Default)]
#[serde(rename_all = "camelCase", default)]
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
    /// Project the inbound params onto a fresh insert `ActiveModel`.
    fn into_active_model(self) -> neurodiversity_adjustment_requests::ActiveModel {
        let now = Utc::now();
        neurodiversity_adjustment_requests::ActiveModel {
            created_at: ActiveValue::Set(now.into()),
            updated_at: ActiveValue::Set(now.into()),
            deleted_at: ActiveValue::Set(None),
            worker_id: ActiveValue::Set(self.worker_id),
            manager_id: ActiveValue::Set(self.manager_id),
            status: ActiveValue::Set(if self.status.is_empty() {
                "draft".to_string()
            } else {
                self.status
            }),
            requested_by: ActiveValue::Set(if self.requested_by.is_empty() {
                "worker".to_string()
            } else {
                self.requested_by
            }),
            request_date: ActiveValue::Set(self.request_date),
            requested_start_date: ActiveValue::Set(self.requested_start_date),
            condition_adhd: ActiveValue::Set(self.condition_adhd),
            condition_autism: ActiveValue::Set(self.condition_autism),
            condition_dyslexia: ActiveValue::Set(self.condition_dyslexia),
            condition_dyspraxia: ActiveValue::Set(self.condition_dyspraxia),
            condition_dyscalculia: ActiveValue::Set(self.condition_dyscalculia),
            condition_tourettes: ActiveValue::Set(self.condition_tourettes),
            condition_other: ActiveValue::Set(self.condition_other),
            condition_other_detail: ActiveValue::Set(self.condition_other_detail),
            diagnosis_status: ActiveValue::Set(self.diagnosis_status),
            considers_disability: ActiveValue::Set(self.considers_disability),
            substantial_long_term_impact: ActiveValue::Set(self.substantial_long_term_impact),
            disclosure_consent: ActiveValue::Set(self.disclosure_consent),
            difficulty_concentration: ActiveValue::Set(self.difficulty_concentration),
            difficulty_written_communication: ActiveValue::Set(self.difficulty_written_communication),
            difficulty_organisation_time: ActiveValue::Set(self.difficulty_organisation_time),
            difficulty_sensory_overload: ActiveValue::Set(self.difficulty_sensory_overload),
            difficulty_balance_coordination: ActiveValue::Set(self.difficulty_balance_coordination),
            difficulty_social_communication: ActiveValue::Set(self.difficulty_social_communication),
            difficulty_memory: ActiveValue::Set(self.difficulty_memory),
            difficulty_burnout_wellbeing: ActiveValue::Set(self.difficulty_burnout_wellbeing),
            tasks_situations_affected: ActiveValue::Set(self.tasks_situations_affected),
            worker_strengths: ActiveValue::Set(self.worker_strengths),
            adjustment_working_environment: ActiveValue::Set(self.adjustment_working_environment),
            adjustment_equipment_technology: ActiveValue::Set(self.adjustment_equipment_technology),
            adjustment_working_arrangements: ActiveValue::Set(self.adjustment_working_arrangements),
            adjustment_communication: ActiveValue::Set(self.adjustment_communication),
            adjustment_support_mentoring: ActiveValue::Set(self.adjustment_support_mentoring),
            adjustment_recruitment_process: ActiveValue::Set(self.adjustment_recruitment_process),
            adjustment_policy_dress: ActiveValue::Set(self.adjustment_policy_dress),
            adjustment_other: ActiveValue::Set(self.adjustment_other),
            adjustments_requested_detail: ActiveValue::Set(self.adjustments_requested_detail),
            supporting_evidence_type: ActiveValue::Set(self.supporting_evidence_type),
            occupational_health_involved: ActiveValue::Set(self.occupational_health_involved),
            access_to_work_involved: ActiveValue::Set(self.access_to_work_involved),
            current_impact: ActiveValue::Set(self.current_impact),
            at_risk_of_absence: ActiveValue::Set(self.at_risk_of_absence),
            urgency: ActiveValue::Set(if self.urgency.is_empty() {
                "routine".to_string()
            } else {
                self.urgency
            }),
            notes: ActiveValue::Set(self.notes),
            ..Default::default()
        }
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
        worker_employment_type: worker.map(|w| w.employment_type.clone()).unwrap_or_default(),
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
async fn load_request(
    db: &impl ConnectionTrait,
    id: Uuid,
) -> Result<neurodiversity_adjustment_requests::Model> {
    neurodiversity_adjustment_requests::Entity::find_by_id(id)
        .one(db)
        .await?
        .ok_or_else(|| Error::NotFound)
}

/// POST /api/neurodiversity-adjustment-requests -- create a new request.
#[debug_handler]
async fn create(
    State(ctx): State<AppContext>,
    Json(params): Json<RequestParams>,
) -> Result<Response> {
    let model = params.into_active_model().insert(&ctx.db).await?;
    Ok(Json(model).into_response())
}

/// GET /api/neurodiversity-adjustment-requests -- list requests (newest first).
#[debug_handler]
async fn list(State(ctx): State<AppContext>) -> Result<Response> {
    let models = neurodiversity_adjustment_requests::Entity::find()
        .order_by_desc(neurodiversity_adjustment_requests::Column::CreatedAt)
        .all(&ctx.db)
        .await?;
    let total = models.len();
    Ok(Json(json!({ "items": models, "total": total })).into_response())
}

/// GET /api/neurodiversity-adjustment-requests/{id} -- fetch one request.
#[debug_handler]
async fn show(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let model = load_request(&ctx.db, id).await?;
    Ok(Json(model).into_response())
}

/// PATCH /api/neurodiversity-adjustment-requests/{id} -- replace request fields.
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

/// DELETE /api/neurodiversity-adjustment-requests/{id} -- remove a request
/// (cascades its grade).
#[debug_handler]
async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_request(&ctx.db, id).await?;
    neurodiversity_adjustment_requests::Entity::delete_by_id(id)
        .exec(&ctx.db)
        .await?;
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
    let request = load_request(&ctx.db, id).await?;
    let worker = workers::Entity::find_by_id(request.worker_id)
        .one(&ctx.db)
        .await?;
    let manager = managers::Entity::find_by_id(request.manager_id)
        .one(&ctx.db)
        .await?;

    let engine_request = to_engine_request(&request, worker.as_ref(), manager.as_ref());
    let grade = calculate_grade(&engine_request);

    let now = Utc::now();
    let txn = ctx.db.begin().await?;

    // Idempotency: drop any prior grade (cascades rules + flags).
    neurodiversity_adjustment_request_grades::Entity::delete_many()
        .filter(neurodiversity_adjustment_request_grades::Column::NeurodiversityAdjustmentRequestId.eq(id))
        .exec(&txn)
        .await?;

    let grade_row = neurodiversity_adjustment_request_grades::ActiveModel {
        created_at: ActiveValue::Set(now.into()),
        updated_at: ActiveValue::Set(now.into()),
        deleted_at: ActiveValue::Set(None),
        neurodiversity_adjustment_request_id: ActiveValue::Set(id),
        eligibility_band: ActiveValue::Set(grade.eligibility_band.clone()),
        impact_band: ActiveValue::Set(grade.impact_band.clone()),
        completeness_percent: ActiveValue::Set(Some(grade.completeness_percent)),
        priority_tier: ActiveValue::Set(grade.priority_tier.clone()),
        target_timeframe: ActiveValue::Set(grade.target_timeframe.clone()),
        recommendation: ActiveValue::Set(grade.recommendation.clone()),
        manager_notes: ActiveValue::Set(String::new()),
        signed_at: ActiveValue::Set(None),
        graded_at: ActiveValue::Set(now.into()),
        ..Default::default()
    }
    .insert(&txn)
    .await?;

    for rule in &grade.fired_rules {
        neurodiversity_adjustment_request_grade_rules::ActiveModel {
            created_at: ActiveValue::Set(now.into()),
            updated_at: ActiveValue::Set(now.into()),
            deleted_at: ActiveValue::Set(None),
            neurodiversity_adjustment_request_grade_id: ActiveValue::Set(grade_row.id),
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
        neurodiversity_adjustment_request_grade_flags::ActiveModel {
            created_at: ActiveValue::Set(now.into()),
            updated_at: ActiveValue::Set(now.into()),
            deleted_at: ActiveValue::Set(None),
            neurodiversity_adjustment_request_grade_id: ActiveValue::Set(grade_row.id),
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
    let mut req_active: neurodiversity_adjustment_requests::ActiveModel = request.into();
    req_active.status = ActiveValue::Set("submitted".to_string());
    req_active.updated_at = ActiveValue::Set(now.into());
    req_active.update(&txn).await?;

    txn.commit().await?;

    Ok(Json(grade_row).into_response())
}

/// GET /api/neurodiversity-adjustment-requests/{id}/result -- read the stored
/// grade back, together with its fired-rule audit trail and compliance flags.
#[debug_handler]
async fn result(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    let grade = neurodiversity_adjustment_request_grades::Entity::find()
        .filter(neurodiversity_adjustment_request_grades::Column::NeurodiversityAdjustmentRequestId.eq(id))
        .one(&ctx.db)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let rules = neurodiversity_adjustment_request_grade_rules::Entity::find()
        .filter(neurodiversity_adjustment_request_grade_rules::Column::NeurodiversityAdjustmentRequestGradeId.eq(grade.id))
        .all(&ctx.db)
        .await?;

    let flags = neurodiversity_adjustment_request_grade_flags::Entity::find()
        .filter(neurodiversity_adjustment_request_grade_flags::Column::NeurodiversityAdjustmentRequestGradeId.eq(grade.id))
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
        .prefix("api/neurodiversity-adjustment-requests")
        .add("/", get(list))
        .add("/", post(create))
        .add("{id}", get(show))
        .add("{id}", axum::routing::patch(update))
        .add("{id}", axum::routing::delete(remove))
        .add("{id}/submit", post(submit))
        .add("{id}/result", get(result))
}
