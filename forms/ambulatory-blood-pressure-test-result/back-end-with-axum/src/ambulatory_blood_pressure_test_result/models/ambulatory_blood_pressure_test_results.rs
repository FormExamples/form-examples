//! ambulatory_blood_pressure_test_results model.

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
    pub monitoring_type: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub valid_readings_percent: Option<f64>,
    pub recording_adequate: bool,
    pub clinical_history: String,
    pub daytime_average_systolic: Option<f64>,
    pub daytime_average_diastolic: Option<f64>,
    pub nighttime_average_systolic: Option<f64>,
    pub nighttime_average_diastolic: Option<f64>,
    pub twenty_four_hour_average_systolic: Option<f64>,
    pub twenty_four_hour_average_diastolic: Option<f64>,
    pub nocturnal_dip_percent: Option<f64>,
    pub dipper_status: String,
    pub hypertension_confirmed: bool,
    pub white_coat_effect: bool,
    pub masked_hypertension: bool,
    pub severe_hypertension: bool,
    pub nocturnal_hypertension: bool,
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
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM ambulatory_blood_pressure_test_results WHERE deleted_at IS \
            NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM ambulatory_blood_pressure_test_results WHERE deleted_at \
            IS NULL",
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
            "SELECT * FROM ambulatory_blood_pressure_test_results WHERE id = $1 AND \
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
            "WITH target AS (UPDATE ambulatory_blood_pressure_test_results SET deleted_at \
            = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE ambulatory_blood_pressure_test_result_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            ambulatory_blood_pressure_test_result_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            ambulatory_blood_pressure_test_result_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE ambulatory_blood_pressure_test_result_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE ambulatory_blood_pressure_test_result_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            ambulatory_blood_pressure_test_result_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
