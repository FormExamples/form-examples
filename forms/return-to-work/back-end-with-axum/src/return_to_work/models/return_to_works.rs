//! return_to_works model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub id: Uuid,
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub status: String,
    pub statement_kind: String,
    pub assessment_date: Option<Date>,
    pub assessment_time: Option<String>,
    pub absence_first_day: Option<Date>,
    pub absence_total_calendar_days: Option<i32>,
    pub prior_med3_reference: String,
    pub prior_self_certification_reference: String,
    pub primary_diagnosis_text: String,
    pub primary_diagnosis_snomed: String,
    pub primary_diagnosis_icd10: String,
    pub comorbid_conditions: String,
    pub mechanism: String,
    pub workplace_cause: String,
    pub riddor_reference: String,
    pub current_medications: String,
    pub ongoing_therapy: String,
    pub last_consultation_date: Option<Date>,
    pub anticipated_recovery_trajectory: String,
    pub specialist_followup_required: String,
    pub mobility: String,
    pub manual_handling_capacity_kg: Option<f64>,
    pub cognition: String,
    pub mood: String,
    pub sleep: String,
    pub pain_score_0_10: Option<i32>,
    pub driving_capacity: String,
    pub standing_tolerance_minutes: Option<i32>,
    pub sitting_tolerance_minutes: Option<i32>,
    pub screen_tolerance_minutes: Option<i32>,
    pub adl_independence: String,
    pub fitness_statement_computed: String,
    pub fitness_statement_final: String,
    pub clinician_override: String,
    pub clinician_override_reason: String,
    pub clinician_confidence: String,
    pub valid_from: Option<Date>,
    pub valid_until: Option<Date>,
    pub validity_weeks: Option<i32>,
    pub reassessment_required: String,
    pub phased_return_applicable: String,
    pub phased_return_template: String,
    pub phased_return_target_date: Option<Date>,
    pub phased_return_schedule_json: serde_json::Value,
    pub phased_return_support_contact: String,
    pub workstation_review_required: String,
    pub additional_adjustments_text: String,
    pub review_location: String,
    pub review_date: Option<Date>,
    pub occupational_health_referral_made: String,
    pub dvla_notification_required: String,
    pub employer_oh_notified: String,
    pub return_to_work_meeting_scheduled: String,
    pub maternity_certificate_reference: String,
    pub final_notes: String,
    pub signature_svg: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub employer_id: Option<Uuid>,
}

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
            "SELECT * FROM return_to_works WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
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
        sqlx::query_as("SELECT * FROM return_to_works WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE return_to_works SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            return_to_work_restrictions SET deleted_at = now(), updated_at = now() WHERE \
            return_to_work_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child2 AS (UPDATE return_to_work_grades SET deleted_at = \
            now(), updated_at = now() WHERE return_to_work_id IN (SELECT id FROM target) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            return_to_work_grade_rules SET deleted_at = now(), updated_at = now() WHERE \
            return_to_work_grade_id IN (SELECT id FROM child2) AND deleted_at IS NULL \
            RETURNING id), child4 AS (UPDATE return_to_work_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE return_to_work_grade_id IN (SELECT id FROM \
            child2) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
