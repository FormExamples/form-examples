//! electroencephalogram_test_results model.

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
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub eeg_type: String,
    pub recording_duration_minutes: Option<f64>,
    pub recording_quality: String,
    pub clinical_history: String,
    pub comparison_with_previous: String,
    pub background_rhythm: String,
    pub epileptiform_discharges: bool,
    pub focal_slowing: bool,
    pub generalised_slowing: bool,
    pub seizure_recorded: bool,
    pub status_epilepticus: bool,
    pub photoparoxysmal_response: bool,
    pub normal_eeg: bool,
    pub findings_narrative: String,
    pub clinical_correlation: String,
    pub impression: String,
    pub reporting_category: String,
    pub recommended_follow_up: String,
    pub critical_result_communicated: bool,
    pub reported_to: String,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM electroencephalogram_test_results WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM electroencephalogram_test_results WHERE deleted_at IS \
            NULL",
        )
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
        sqlx::query_as(
            "SELECT * FROM electroencephalogram_test_results WHERE id = $1 AND deleted_at \
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
            "WITH target AS (UPDATE electroencephalogram_test_results SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE electroencephalogram_test_result_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            electroencephalogram_test_result_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            electroencephalogram_test_result_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE electroencephalogram_test_result_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE electroencephalogram_test_result_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE electroencephalogram_test_result_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
