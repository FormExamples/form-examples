//! lumbar_puncture_test_results model.

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
    pub clinical_history: String,
    pub opening_pressure_cmh2o: Option<f64>,
    pub csf_appearance: String,
    pub csf_white_cell_count: Option<f64>,
    pub csf_red_cell_count: Option<f64>,
    pub csf_protein_g_l: Option<f64>,
    pub csf_glucose_mmol_l: Option<f64>,
    pub csf_serum_glucose_ratio: Option<f64>,
    pub csf_lactate_mmol_l: Option<f64>,
    pub gram_stain_result: String,
    pub culture_result: String,
    pub pcr_result: String,
    pub oligoclonal_bands: String,
    pub xanthochromia: String,
    pub raised_protein: bool,
    pub pleocytosis: bool,
    pub low_glucose: bool,
    pub bacterial_meningitis_pattern: bool,
    pub viral_pattern: bool,
    pub subarachnoid_haemorrhage_suggested: bool,
    pub normal_csf: bool,
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
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as(
            "SELECT * FROM lumbar_puncture_test_results WHERE deleted_at IS NULL ORDER BY \
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
            "SELECT * FROM lumbar_puncture_test_results WHERE id = $1 AND deleted_at IS \
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
            "WITH target AS (UPDATE lumbar_puncture_test_results SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE lumbar_puncture_test_result_grades SET deleted_at = now(), \
            updated_at = now() WHERE lumbar_puncture_test_result_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            lumbar_puncture_test_result_grade_rules SET deleted_at = now(), updated_at = \
            now() WHERE lumbar_puncture_test_result_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            lumbar_puncture_test_result_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE lumbar_puncture_test_result_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
