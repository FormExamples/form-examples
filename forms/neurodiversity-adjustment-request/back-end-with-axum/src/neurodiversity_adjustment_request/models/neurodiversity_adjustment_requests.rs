//! Neurodiversity adjustment requests module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
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
    /// Deleted at.
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Status.
    pub status: String,
    /// Requested by.
    pub requested_by: String,
    /// Request date.
    pub request_date: Option<Date>,
    /// Requested start date.
    pub requested_start_date: Option<Date>,
    /// Condition adhd.
    pub condition_adhd: bool,
    /// Condition autism.
    pub condition_autism: bool,
    /// Condition dyslexia.
    pub condition_dyslexia: bool,
    /// Condition dyspraxia.
    pub condition_dyspraxia: bool,
    /// Condition dyscalculia.
    pub condition_dyscalculia: bool,
    /// Condition tourettes.
    pub condition_tourettes: bool,
    /// Condition other.
    pub condition_other: bool,
    /// Condition other detail.
    pub condition_other_detail: String,
    /// Diagnosis status.
    pub diagnosis_status: String,
    /// Considers disability.
    pub considers_disability: String,
    /// Substantial long term impact.
    pub substantial_long_term_impact: bool,
    /// Disclosure consent.
    pub disclosure_consent: bool,
    /// Difficulty concentration.
    pub difficulty_concentration: bool,
    /// Difficulty written communication.
    pub difficulty_written_communication: bool,
    /// Difficulty organisation time.
    pub difficulty_organisation_time: bool,
    /// Difficulty sensory overload.
    pub difficulty_sensory_overload: bool,
    /// Difficulty balance coordination.
    pub difficulty_balance_coordination: bool,
    /// Difficulty social communication.
    pub difficulty_social_communication: bool,
    /// Difficulty memory.
    pub difficulty_memory: bool,
    /// Difficulty burnout wellbeing.
    pub difficulty_burnout_wellbeing: bool,
    /// Tasks situations affected.
    pub tasks_situations_affected: String,
    /// Worker strengths.
    pub worker_strengths: String,
    /// Adjustment working environment.
    pub adjustment_working_environment: bool,
    /// Adjustment equipment technology.
    pub adjustment_equipment_technology: bool,
    /// Adjustment working arrangements.
    pub adjustment_working_arrangements: bool,
    /// Adjustment communication.
    pub adjustment_communication: bool,
    /// Adjustment support mentoring.
    pub adjustment_support_mentoring: bool,
    /// Adjustment recruitment process.
    pub adjustment_recruitment_process: bool,
    /// Adjustment policy dress.
    pub adjustment_policy_dress: bool,
    /// Adjustment other.
    pub adjustment_other: bool,
    /// Adjustments requested detail.
    pub adjustments_requested_detail: String,
    /// Supporting evidence type.
    pub supporting_evidence_type: String,
    /// Occupational health involved.
    pub occupational_health_involved: bool,
    /// Access to work involved.
    pub access_to_work_involved: bool,
    /// Current impact.
    pub current_impact: String,
    /// At risk of absence.
    pub at_risk_of_absence: bool,
    /// Urgency.
    pub urgency: String,
    /// Notes.
    pub notes: String,
    /// Worker ID.
    pub worker_id: Uuid,
    /// Manager ID.
    pub manager_id: Uuid,
}
/// Neurodiversity adjustment requests.
pub type NeurodiversityAdjustmentRequests = Model;

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
            "SELECT * FROM neurodiversity_adjustment_requests WHERE deleted_at IS NULL \
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
            "SELECT * FROM neurodiversity_adjustment_requests WHERE id = $1 AND \
            deleted_at IS NULL",
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
            "WITH target AS (UPDATE neurodiversity_adjustment_requests SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE neurodiversity_adjustment_request_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            neurodiversity_adjustment_request_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            neurodiversity_adjustment_request_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE neurodiversity_adjustment_request_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE neurodiversity_adjustment_request_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE neurodiversity_adjustment_request_grade_id \
            IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT \
            count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
