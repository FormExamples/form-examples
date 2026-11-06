//! mammography_test_results model.

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
    pub exam_type: String,
    pub laterality: String,
    pub examination_adequacy: String,
    pub breast_density: String,
    pub clinical_history: String,
    pub comparison_with_previous: String,
    pub findings_narrative: String,
    pub mass: bool,
    pub calcifications: bool,
    pub architectural_distortion: bool,
    pub asymmetry: bool,
    pub skin_or_nipple_change: bool,
    pub lymphadenopathy: bool,
    pub incidental_finding: bool,
    pub largest_lesion_size_mm: Option<f64>,
    pub impression: String,
    pub bi_rads_category: String,
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
            sqlx::query_as("SELECT * FROM mammography_test_results ORDER BY id LIMIT $1 OFFSET $2")
                .bind(limit)
                .bind(offset)
                .fetch_all(db)
                .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM mammography_test_results")
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
        sqlx::query_as("SELECT * FROM mammography_test_results WHERE id = $1")
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
        sqlx::query("DELETE FROM mammography_test_results WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
