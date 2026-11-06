//! Neurodiversity-adjustment-responses domain model: constructors, mappers, query helpers.

use serde::{Deserialize, Serialize};

use crate::engine::types::NeurodiversityAdjustmentResponse;
use crate::support::prelude::*;
use chrono::Utc;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::struct_excessive_bools)] // mirrors the form's sql/ boolean columns (source of truth)
pub struct Model {
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
    /// ID.
    pub id: Uuid,
    /// Deleted at (soft-delete).
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Response lifecycle status.
    pub response_status: String,
    /// Reference to the originating reasonable-adjustments request.
    pub request_reference: String,
    /// How the request was handled.
    pub handling_method: String,
    /// Date the request was assessed / discussed with the worker.
    pub assessed_date: Option<Date>,
    /// Date the response was issued to the worker.
    pub responded_date: Option<Date>,
    /// Date the agreed adjustments take effect.
    pub effective_date: Option<Date>,
    /// Overall decision.
    pub overall_decision: String,
    /// Rationale for the decision (including the reasonableness justification).
    pub decision_rationale: String,
    /// Reasonableness category where any adjustment is declined.
    pub decline_reason_category: String,
    /// Agreed adjustment: physical working environment.
    pub agreed_working_environment: bool,
    /// Agreed adjustment: equipment or assistive technology.
    pub agreed_equipment_technology: bool,
    /// Agreed adjustment: working arrangements.
    pub agreed_working_arrangements: bool,
    /// Agreed adjustment: communication.
    pub agreed_communication: bool,
    /// Agreed adjustment: additional support / mentoring.
    pub agreed_support_mentoring: bool,
    /// Agreed adjustment: recruitment / assessment process.
    pub agreed_recruitment_process: bool,
    /// Agreed adjustment: policies (dress code / uniform, absence policy).
    pub agreed_policy_dress: bool,
    /// Agreed adjustment: another adjustment not separately listed.
    pub agreed_other: bool,
    /// Free-text detail of the specific adjustments agreed.
    pub agreed_adjustments_detail: String,
    /// Free-text detail of any alternative adjustments offered.
    pub alternative_adjustments_detail: String,
    /// Whether the adjustments are being tried for a trial period.
    pub trial_period: bool,
    /// Length of the trial period in weeks, if a trial applies (0–104).
    pub trial_period_weeks: Option<i32>,
    /// Whether a review of the adjustments has been scheduled.
    pub review_scheduled: bool,
    /// Date the adjustments will be reviewed.
    pub review_date: Option<Date>,
    /// Whether the worker has been referred to occupational health.
    pub occupational_health_referred: bool,
    /// Whether the worker has been signposted / referred to Access to Work.
    pub access_to_work_referred: bool,
    /// Free-text detail of support resources allocated.
    pub support_resources_detail: String,
    /// Free-text detail of who is responsible for implementing each adjustment.
    pub responsibilities_detail: String,
    /// Named point of contact for the worker.
    pub point_of_contact: String,
    /// Whether the matter has been escalated (dispute, grievance, appeal).
    pub escalated: bool,
    /// Free-text detail of any escalation, dispute, or appeal.
    pub escalation_detail: String,
    /// Free-text notes accompanying the response.
    pub notes: String,
    /// Foreign key to the worker.
    pub worker_id: Uuid,
    /// Foreign key to the manager / HR contact authoring the response.
    pub manager_id: Uuid,
}
/// Neurodiversity adjustment responses entity alias.
pub type NeurodiversityAdjustmentResponses = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM neurodiversity_adjustment_responses ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM neurodiversity_adjustment_responses")
            .fetch_one(db)
            .await?;
        Ok((rows, total))
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as("SELECT * FROM neurodiversity_adjustment_responses WHERE id = $1")
            .bind(id)
            .fetch_optional(db)
            .await
    }

    /// Delete the row with this id.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn delete(db: &PgPool, id: Uuid) -> sqlx::Result<()> {
        sqlx::query("DELETE FROM neurodiversity_adjustment_responses WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}

/// Parse an ISO-8601 `YYYY-MM-DD` string into a `Date`, or `None` if empty / invalid.
fn parse_date(s: &str) -> Option<Date> {
    if s.is_empty() {
        return None;
    }
    chrono::NaiveDate::parse_from_str(s, "%Y-%m-%d").ok()
}

impl Model {
    /// Insert a row from an engine payload plus its foreign keys.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn insert_payload(
        db: &PgPool,
        worker_id: Uuid,
        manager_id: Uuid,
        payload: &NeurodiversityAdjustmentResponse,
    ) -> sqlx::Result<Self> {
        let now = Utc::now();
        sqlx::query_as(
            "INSERT INTO neurodiversity_adjustment_responses (created_at, updated_at, \
            worker_id, manager_id, response_status, request_reference, handling_method, \
            assessed_date, responded_date, effective_date, overall_decision, \
            decision_rationale, decline_reason_category, agreed_working_environment, \
            agreed_equipment_technology, agreed_working_arrangements, agreed_communication, \
            agreed_support_mentoring, agreed_recruitment_process, agreed_policy_dress, \
            agreed_other, agreed_adjustments_detail, alternative_adjustments_detail, \
            trial_period, trial_period_weeks, review_scheduled, review_date, \
            occupational_health_referred, access_to_work_referred, support_resources_detail, \
            responsibilities_detail, point_of_contact, escalated, escalation_detail, notes) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, \
            $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, \
            $33, $34, $35) RETURNING *",
        )
        .bind(now)
        .bind(now)
        .bind(worker_id)
        .bind(manager_id)
        .bind(payload.response_status.clone())
        .bind(payload.request_reference.clone())
        .bind(payload.handling_method.clone())
        .bind(parse_date(&payload.assessed_date))
        .bind(parse_date(&payload.responded_date))
        .bind(parse_date(&payload.effective_date))
        .bind(payload.overall_decision.clone())
        .bind(payload.decision_rationale.clone())
        .bind(payload.decline_reason_category.clone())
        .bind(payload.agreed_working_environment)
        .bind(payload.agreed_equipment_technology)
        .bind(payload.agreed_working_arrangements)
        .bind(payload.agreed_communication)
        .bind(payload.agreed_support_mentoring)
        .bind(payload.agreed_recruitment_process)
        .bind(payload.agreed_policy_dress)
        .bind(payload.agreed_other)
        .bind(payload.agreed_adjustments_detail.clone())
        .bind(payload.alternative_adjustments_detail.clone())
        .bind(payload.trial_period)
        .bind(payload.trial_period_weeks)
        .bind(payload.review_scheduled)
        .bind(parse_date(&payload.review_date))
        .bind(payload.occupational_health_referred)
        .bind(payload.access_to_work_referred)
        .bind(payload.support_resources_detail.clone())
        .bind(payload.responsibilities_detail.clone())
        .bind(payload.point_of_contact.clone())
        .bind(payload.escalated)
        .bind(payload.escalation_detail.clone())
        .bind(payload.notes.clone())
        .fetch_one(db)
        .await
    }

    /// Overwrite a row from an engine payload, keeping its creation time.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn update_payload(
        db: &PgPool,
        id: Uuid,
        worker_id: Uuid,
        manager_id: Uuid,
        payload: &NeurodiversityAdjustmentResponse,
    ) -> sqlx::Result<Self> {
        let now = Utc::now();
        sqlx::query_as(
            "UPDATE neurodiversity_adjustment_responses SET updated_at = $2, deleted_at = \
            NULL, worker_id = $3, manager_id = $4, response_status = $5, request_reference = \
            $6, handling_method = $7, assessed_date = $8, responded_date = $9, effective_date \
            = $10, overall_decision = $11, decision_rationale = $12, decline_reason_category \
            = $13, agreed_working_environment = $14, agreed_equipment_technology = $15, \
            agreed_working_arrangements = $16, agreed_communication = $17, \
            agreed_support_mentoring = $18, agreed_recruitment_process = $19, \
            agreed_policy_dress = $20, agreed_other = $21, agreed_adjustments_detail = $22, \
            alternative_adjustments_detail = $23, trial_period = $24, trial_period_weeks = \
            $25, review_scheduled = $26, review_date = $27, occupational_health_referred = \
            $28, access_to_work_referred = $29, support_resources_detail = $30, \
            responsibilities_detail = $31, point_of_contact = $32, escalated = $33, \
            escalation_detail = $34, notes = $35 WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(now)
        .bind(worker_id)
        .bind(manager_id)
        .bind(payload.response_status.clone())
        .bind(payload.request_reference.clone())
        .bind(payload.handling_method.clone())
        .bind(parse_date(&payload.assessed_date))
        .bind(parse_date(&payload.responded_date))
        .bind(parse_date(&payload.effective_date))
        .bind(payload.overall_decision.clone())
        .bind(payload.decision_rationale.clone())
        .bind(payload.decline_reason_category.clone())
        .bind(payload.agreed_working_environment)
        .bind(payload.agreed_equipment_technology)
        .bind(payload.agreed_working_arrangements)
        .bind(payload.agreed_communication)
        .bind(payload.agreed_support_mentoring)
        .bind(payload.agreed_recruitment_process)
        .bind(payload.agreed_policy_dress)
        .bind(payload.agreed_other)
        .bind(payload.agreed_adjustments_detail.clone())
        .bind(payload.alternative_adjustments_detail.clone())
        .bind(payload.trial_period)
        .bind(payload.trial_period_weeks)
        .bind(payload.review_scheduled)
        .bind(parse_date(&payload.review_date))
        .bind(payload.occupational_health_referred)
        .bind(payload.access_to_work_referred)
        .bind(payload.support_resources_detail.clone())
        .bind(payload.responsibilities_detail.clone())
        .bind(payload.point_of_contact.clone())
        .bind(payload.escalated)
        .bind(payload.escalation_detail.clone())
        .bind(payload.notes.clone())
        .fetch_one(db)
        .await
    }

    /// Mark a row deleted.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn soft_delete(db: &PgPool, id: Uuid) -> sqlx::Result<()> {
        sqlx::query("UPDATE neurodiversity_adjustment_responses SET deleted_at = now(), updated_at = now() WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}

impl Model {
    /// Project this row into the engine's [`NeurodiversityAdjustmentResponse`]
    /// payload so the four-axis grader can run over it. The `worker*` /
    /// `manager*` identity fields live in their own tables and are left empty
    /// here; the completeness axis treats them as absent on the DB path.
    #[must_use]
    pub fn to_payload(&self) -> NeurodiversityAdjustmentResponse {
        NeurodiversityAdjustmentResponse {
            worker_name: String::new(),
            worker_job_title: String::new(),
            worker_department: String::new(),
            worker_employee_reference: String::new(),
            manager_name: String::new(),
            manager_role: String::new(),
            response_status: self.response_status.clone(),
            request_reference: self.request_reference.clone(),
            handling_method: self.handling_method.clone(),
            assessed_date: self
                .assessed_date
                .map(|d| d.to_string())
                .unwrap_or_default(),
            responded_date: self
                .responded_date
                .map(|d| d.to_string())
                .unwrap_or_default(),
            effective_date: self
                .effective_date
                .map(|d| d.to_string())
                .unwrap_or_default(),
            overall_decision: self.overall_decision.clone(),
            decision_rationale: self.decision_rationale.clone(),
            decline_reason_category: self.decline_reason_category.clone(),
            agreed_working_environment: self.agreed_working_environment,
            agreed_equipment_technology: self.agreed_equipment_technology,
            agreed_working_arrangements: self.agreed_working_arrangements,
            agreed_communication: self.agreed_communication,
            agreed_support_mentoring: self.agreed_support_mentoring,
            agreed_recruitment_process: self.agreed_recruitment_process,
            agreed_policy_dress: self.agreed_policy_dress,
            agreed_other: self.agreed_other,
            agreed_adjustments_detail: self.agreed_adjustments_detail.clone(),
            alternative_adjustments_detail: self.alternative_adjustments_detail.clone(),
            trial_period: self.trial_period,
            trial_period_weeks: self.trial_period_weeks,
            review_scheduled: self.review_scheduled,
            review_date: self.review_date.map(|d| d.to_string()).unwrap_or_default(),
            occupational_health_referred: self.occupational_health_referred,
            access_to_work_referred: self.access_to_work_referred,
            support_resources_detail: self.support_resources_detail.clone(),
            responsibilities_detail: self.responsibilities_detail.clone(),
            point_of_contact: self.point_of_contact.clone(),
            escalated: self.escalated,
            escalation_detail: self.escalation_detail.clone(),
            notes: self.notes.clone(),
        }
    }
}

/// Find a response by its UUID.
///
/// # Errors
/// Returns a database error if the query fails.
pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
    Model::find_by_id(db, id).await
}

/// One page of rows, newest first, and how many rows there are in all.
///
/// # Errors
/// Returns a database error if a query fails.
pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Model>, i64)> {
    let (limit, offset) = crate::support::paging::bounds(page);
    let rows = sqlx::query_as::<_, Model>(
        "SELECT * FROM neurodiversity_adjustment_responses ORDER BY created_at DESC, id LIMIT $1 OFFSET $2",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(db)
    .await?;
    let total = sqlx::query_scalar("SELECT COUNT(*) FROM neurodiversity_adjustment_responses")
        .fetch_one(db)
        .await?;
    Ok((rows, total))
}
