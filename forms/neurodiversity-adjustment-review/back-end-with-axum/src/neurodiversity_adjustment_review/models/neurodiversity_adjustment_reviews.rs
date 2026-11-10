//! Neurodiversity-adjustment-reviews domain model: constructors, mappers, query helpers.

use serde::{Deserialize, Serialize};

use crate::engine::types::NeurodiversityAdjustmentReview;
use crate::support::prelude::*;
use chrono::Utc;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
    /// ID.
    pub id: Uuid,
    /// Deleted at (soft-delete).
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Review lifecycle status.
    pub review_status: String,
    /// Reference to the originating response / confirmation being reviewed.
    pub response_reference: String,
    /// How the review was conducted.
    pub review_method: String,
    /// Date the review took place.
    pub review_date: Option<Date>,
    /// Date of the next scheduled review.
    pub next_review_date: Option<Date>,
    /// Effectiveness of working-environment adjustments.
    pub effectiveness_working_environment: String,
    /// Effectiveness of equipment / technology adjustments.
    pub effectiveness_equipment_technology: String,
    /// Effectiveness of working-arrangements adjustments.
    pub effectiveness_working_arrangements: String,
    /// Effectiveness of communication adjustments.
    pub effectiveness_communication: String,
    /// Effectiveness of support / mentoring adjustments.
    pub effectiveness_support_mentoring: String,
    /// Effectiveness of recruitment-process adjustments.
    pub effectiveness_recruitment_process: String,
    /// Effectiveness of policy / dress-code adjustments.
    pub effectiveness_policy_dress: String,
    /// Effectiveness of any other adjustment.
    pub effectiveness_other: String,
    /// The worker's own feedback on how the adjustments are working.
    pub worker_feedback: String,
    /// Whether the worker is satisfied the adjustments meet their needs.
    pub worker_satisfied: String,
    /// Change in the worker's wellbeing / ability to work since the adjustments.
    pub wellbeing_change: String,
    /// Any remaining barriers or difficulties the worker still experiences.
    pub barriers_detail: String,
    /// Whether changes to the adjustments are needed as a result of the review.
    pub changes_needed: bool,
    /// Detail of the changes needed.
    pub changes_detail: String,
    /// Detail of the updated / newly agreed adjustments arising from the review.
    pub updated_adjustments_detail: String,
    /// Whether an occupational-health re-referral has been made.
    pub occupational_health_rereferral: bool,
    /// Whether the matter has been escalated.
    pub escalated: bool,
    /// Free-text detail of any escalation.
    pub escalation_detail: String,
    /// Free-text notes accompanying the review.
    pub notes: String,
    /// Foreign key to the worker.
    pub worker_id: Uuid,
    /// Foreign key to the manager / HR contact conducting the review.
    pub manager_id: Uuid,
}
/// Neurodiversity adjustment reviews entity alias.
pub type NeurodiversityAdjustmentReviews = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as(
            "SELECT * FROM neurodiversity_adjustment_reviews WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as(
            "SELECT * FROM neurodiversity_adjustment_reviews WHERE id = $1 AND deleted_at \
            IS NULL",
        )
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
        sqlx::query(
            "WITH target AS (UPDATE neurodiversity_adjustment_reviews SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE neurodiversity_adjustment_review_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            neurodiversity_adjustment_review_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            neurodiversity_adjustment_review_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE neurodiversity_adjustment_review_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE neurodiversity_adjustment_review_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE neurodiversity_adjustment_review_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
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
        payload: &NeurodiversityAdjustmentReview,
    ) -> sqlx::Result<Self> {
        let now = Utc::now();
        sqlx::query_as(
            "INSERT INTO neurodiversity_adjustment_reviews (created_at, updated_at, worker_id, \
            manager_id, review_status, response_reference, review_method, review_date, \
            next_review_date, effectiveness_working_environment, \
            effectiveness_equipment_technology, effectiveness_working_arrangements, \
            effectiveness_communication, effectiveness_support_mentoring, \
            effectiveness_recruitment_process, effectiveness_policy_dress, \
            effectiveness_other, worker_feedback, worker_satisfied, wellbeing_change, \
            barriers_detail, changes_needed, changes_detail, updated_adjustments_detail, \
            occupational_health_rereferral, escalated, escalation_detail, notes) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, \
            $20, $21, $22, $23, $24, $25, $26, $27, $28) RETURNING *",
        )
        .bind(now)
        .bind(now)
        .bind(worker_id)
        .bind(manager_id)
        .bind(payload.review_status.clone())
        .bind(payload.response_reference.clone())
        .bind(payload.review_method.clone())
        .bind(parse_date(&payload.review_date))
        .bind(parse_date(&payload.next_review_date))
        .bind(payload.effectiveness_working_environment.clone())
        .bind(payload.effectiveness_equipment_technology.clone())
        .bind(payload.effectiveness_working_arrangements.clone())
        .bind(payload.effectiveness_communication.clone())
        .bind(payload.effectiveness_support_mentoring.clone())
        .bind(payload.effectiveness_recruitment_process.clone())
        .bind(payload.effectiveness_policy_dress.clone())
        .bind(payload.effectiveness_other.clone())
        .bind(payload.worker_feedback.clone())
        .bind(payload.worker_satisfied.clone())
        .bind(payload.wellbeing_change.clone())
        .bind(payload.barriers_detail.clone())
        .bind(payload.changes_needed)
        .bind(payload.changes_detail.clone())
        .bind(payload.updated_adjustments_detail.clone())
        .bind(payload.occupational_health_rereferral)
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
        payload: &NeurodiversityAdjustmentReview,
    ) -> sqlx::Result<Self> {
        let now = Utc::now();
        sqlx::query_as(
            "UPDATE neurodiversity_adjustment_reviews SET updated_at = $2, worker_id = \
            $3, manager_id = $4, review_status = $5, response_reference = $6, \
            review_method = $7, review_date = $8, next_review_date = $9, \
            effectiveness_working_environment = $10, effectiveness_equipment_technology \
            = $11, effectiveness_working_arrangements = $12, effectiveness_communication \
            = $13, effectiveness_support_mentoring = $14, \
            effectiveness_recruitment_process = $15, effectiveness_policy_dress = $16, \
            effectiveness_other = $17, worker_feedback = $18, worker_satisfied = $19, \
            wellbeing_change = $20, barriers_detail = $21, changes_needed = $22, \
            changes_detail = $23, updated_adjustments_detail = $24, \
            occupational_health_rereferral = $25, escalated = $26, escalation_detail = \
            $27, notes = $28 WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(now)
        .bind(worker_id)
        .bind(manager_id)
        .bind(payload.review_status.clone())
        .bind(payload.response_reference.clone())
        .bind(payload.review_method.clone())
        .bind(parse_date(&payload.review_date))
        .bind(parse_date(&payload.next_review_date))
        .bind(payload.effectiveness_working_environment.clone())
        .bind(payload.effectiveness_equipment_technology.clone())
        .bind(payload.effectiveness_working_arrangements.clone())
        .bind(payload.effectiveness_communication.clone())
        .bind(payload.effectiveness_support_mentoring.clone())
        .bind(payload.effectiveness_recruitment_process.clone())
        .bind(payload.effectiveness_policy_dress.clone())
        .bind(payload.effectiveness_other.clone())
        .bind(payload.worker_feedback.clone())
        .bind(payload.worker_satisfied.clone())
        .bind(payload.wellbeing_change.clone())
        .bind(payload.barriers_detail.clone())
        .bind(payload.changes_needed)
        .bind(payload.changes_detail.clone())
        .bind(payload.updated_adjustments_detail.clone())
        .bind(payload.occupational_health_rereferral)
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
        sqlx::query(
            "WITH target AS (UPDATE neurodiversity_adjustment_reviews SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE neurodiversity_adjustment_review_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            neurodiversity_adjustment_review_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            neurodiversity_adjustment_review_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE neurodiversity_adjustment_review_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE neurodiversity_adjustment_review_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE neurodiversity_adjustment_review_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}

impl Model {
    /// Project this row into the engine's [`NeurodiversityAdjustmentReview`]
    /// payload so the four-axis grader can run over it. The `worker*` /
    /// `manager*` identity fields live in their own tables and are left empty
    /// here; the completeness axis treats them as absent on the DB path.
    #[must_use]
    pub fn to_payload(&self) -> NeurodiversityAdjustmentReview {
        NeurodiversityAdjustmentReview {
            worker_name: String::new(),
            worker_job_title: String::new(),
            worker_department: String::new(),
            worker_employee_reference: String::new(),
            manager_name: String::new(),
            manager_role: String::new(),
            review_status: self.review_status.clone(),
            response_reference: self.response_reference.clone(),
            review_method: self.review_method.clone(),
            review_date: self.review_date.map(|d| d.to_string()).unwrap_or_default(),
            next_review_date: self
                .next_review_date
                .map(|d| d.to_string())
                .unwrap_or_default(),
            effectiveness_working_environment: self.effectiveness_working_environment.clone(),
            effectiveness_equipment_technology: self.effectiveness_equipment_technology.clone(),
            effectiveness_working_arrangements: self.effectiveness_working_arrangements.clone(),
            effectiveness_communication: self.effectiveness_communication.clone(),
            effectiveness_support_mentoring: self.effectiveness_support_mentoring.clone(),
            effectiveness_recruitment_process: self.effectiveness_recruitment_process.clone(),
            effectiveness_policy_dress: self.effectiveness_policy_dress.clone(),
            effectiveness_other: self.effectiveness_other.clone(),
            worker_feedback: self.worker_feedback.clone(),
            worker_satisfied: self.worker_satisfied.clone(),
            wellbeing_change: self.wellbeing_change.clone(),
            barriers_detail: self.barriers_detail.clone(),
            changes_needed: self.changes_needed,
            changes_detail: self.changes_detail.clone(),
            updated_adjustments_detail: self.updated_adjustments_detail.clone(),
            occupational_health_rereferral: self.occupational_health_rereferral,
            escalated: self.escalated,
            escalation_detail: self.escalation_detail.clone(),
            notes: self.notes.clone(),
        }
    }
}

/// Find a review by its UUID.
///
/// # Errors
/// Returns a database error if the query fails.
pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
    Model::find_by_id(db, id).await
}

/// One page of rows, newest first, with one row more than the page when more
/// follow, which `CursorPage::respond` drops.
///
/// # Errors
/// Returns a database error if a query fails.
pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Model>> {
    let (limit, offset) = page.bounds();
    sqlx::query_as::<_, Model>(
        "SELECT * FROM neurodiversity_adjustment_reviews WHERE deleted_at IS NULL \
            ORDER BY created_at DESC, id LIMIT $1 OFFSET $2",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(db)
    .await
}
