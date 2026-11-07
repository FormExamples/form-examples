//! ward_round_notes model.

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
    pub clinician_grade: String,
    pub reviewed_at: Option<DateTimeWithTimeZone>,
    pub ward: String,
    pub patient_identifier: String,
    pub admission_date: Option<Date>,
    pub primary_diagnosis: String,
    pub overnight_events: String,
    pub no_overnight_events: String,
    pub problem_list: String,
    pub examination_summary: String,
    pub news2_total: Option<i32>,
    pub news2_single_param_three: String,
    pub observation_trend: String,
    pub investigations_reviewed: String,
    pub no_investigations_outstanding: String,
    pub abnormal_result_flagged: String,
    pub abnormal_result_actioned: String,
    pub vte_status: String,
    pub vte_prophylaxis_in_place: String,
    pub medication_changes: String,
    pub no_medication_changes: String,
    pub plan_and_jobs: String,
    pub escalation_status: String,
    pub senior_review_present: String,
    pub estimated_discharge_date: Option<Date>,
    pub discharge_not_estimable: String,
    pub clinical_note: String,
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
            "SELECT * FROM ward_round_notes WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
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
        sqlx::query_as("SELECT * FROM ward_round_notes WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE ward_round_notes SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            ward_round_note_grades SET deleted_at = now(), updated_at = now() WHERE \
            ward_round_note_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child2 AS (UPDATE ward_round_note_grade_rules SET deleted_at \
            = now(), updated_at = now() WHERE ward_round_note_grade_id IN (SELECT id \
            FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            ward_round_note_grade_flags SET deleted_at = now(), updated_at = now() WHERE \
            ward_round_note_grade_id IN (SELECT id FROM child1) AND deleted_at IS NULL \
            RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
