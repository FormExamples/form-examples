//! holter_monitor_test_results model.

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
    pub monitor_type: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub recording_duration_hours: Option<f64>,
    pub analysed_percent: Option<f64>,
    pub clinical_history: String,
    pub predominant_rhythm: String,
    pub mean_heart_rate_bpm: Option<i32>,
    pub minimum_heart_rate_bpm: Option<i32>,
    pub maximum_heart_rate_bpm: Option<i32>,
    pub longest_pause_seconds: Option<f64>,
    pub ventricular_ectopic_percent: Option<f64>,
    pub supraventricular_ectopic_percent: Option<f64>,
    pub atrial_fibrillation_detected: bool,
    pub significant_pauses: bool,
    pub ventricular_tachycardia: bool,
    pub supraventricular_tachycardia: bool,
    pub high_grade_av_block: bool,
    pub symptom_rhythm_correlation: bool,
    pub normal_study: bool,
    pub findings_narrative: String,
    pub comparison_with_previous: String,
    pub impression: String,
    pub reporting_category: String,
    pub recommended_follow_up: String,
    pub critical_result_communicated: bool,
    pub reported_to: String,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
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
            "SELECT * FROM holter_monitor_test_results WHERE deleted_at IS NULL ORDER BY \
            id LIMIT $1 OFFSET $2",
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
            "SELECT * FROM holter_monitor_test_results WHERE id = $1 AND deleted_at IS \
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
            "WITH target AS (UPDATE holter_monitor_test_results SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE holter_monitor_test_result_grades SET deleted_at = now(), \
            updated_at = now() WHERE holter_monitor_test_result_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            holter_monitor_test_result_grade_rules SET deleted_at = now(), updated_at = \
            now() WHERE holter_monitor_test_result_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            holter_monitor_test_result_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE holter_monitor_test_result_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
