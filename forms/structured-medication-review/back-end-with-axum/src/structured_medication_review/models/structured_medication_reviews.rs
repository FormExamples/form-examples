//! structured_medication_reviews model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub id: Uuid,
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub reviewed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub consultation_mode: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub frailty_status: String,
    pub lives_in_care_home: String,
    pub long_term_conditions: String,
    pub presenting_problems: String,
    pub patient_reported_issues: String,
    pub what_matters_to_patient: String,
    pub shared_decisions: String,
    pub monitoring_due: String,
    pub overdue_monitoring_count: Option<i32>,
    pub follow_up_plan: String,
    pub follow_up_date: Option<Date>,
    pub review_completed: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
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
            "SELECT * FROM structured_medication_reviews WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
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
            "SELECT * FROM structured_medication_reviews WHERE id = $1 AND deleted_at IS \
            NULL",
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
            "WITH target AS (UPDATE structured_medication_reviews SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE structured_medication_review_medicines SET deleted_at = \
            now(), updated_at = now() WHERE structured_medication_review_id IN (SELECT \
            id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            structured_medication_review_grades SET deleted_at = now(), updated_at = \
            now() WHERE structured_medication_review_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            structured_medication_review_grade_rules SET deleted_at = now(), updated_at \
            = now() WHERE structured_medication_review_grade_id IN (SELECT id FROM \
            child2) AND deleted_at IS NULL RETURNING id), child4 AS (UPDATE \
            structured_medication_review_grade_flags SET deleted_at = now(), updated_at \
            = now() WHERE structured_medication_review_grade_id IN (SELECT id FROM \
            child2) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
