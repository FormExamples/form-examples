//! sleep_study_test_results model.

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
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub study_type: String,
    pub study_adequacy: String,
    pub clinical_history: String,
    pub comparison_with_previous: String,
    pub total_recording_time_hours: Option<f64>,
    pub total_sleep_time_hours: Option<f64>,
    pub apnoea_hypopnoea_index: Option<f64>,
    pub oxygen_desaturation_index: Option<f64>,
    pub minimum_spo2_percent: Option<f64>,
    pub time_below_90_percent_spo2: Option<f64>,
    pub mean_heart_rate_bpm: Option<i32>,
    pub osa_severity: String,
    pub obstructive_sleep_apnoea: bool,
    pub central_sleep_apnoea: bool,
    pub periodic_limb_movements: bool,
    pub nocturnal_hypoventilation: bool,
    pub significant_desaturation: bool,
    pub normal_study: bool,
    pub findings_narrative: String,
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
        let rows =
            sqlx::query_as("SELECT * FROM sleep_study_test_results ORDER BY id LIMIT $1 OFFSET $2")
                .bind(limit)
                .bind(offset)
                .fetch_all(db)
                .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM sleep_study_test_results")
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
        sqlx::query_as("SELECT * FROM sleep_study_test_results WHERE id = $1")
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
        sqlx::query("DELETE FROM sleep_study_test_results WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
