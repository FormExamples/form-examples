//! dexa_bone_density_test_results model.

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
    pub scan_region: String,
    pub examination_adequacy: String,
    pub clinical_history: String,
    pub lumbar_spine_t_score: Option<f64>,
    pub lumbar_spine_z_score: Option<f64>,
    pub femoral_neck_t_score: Option<f64>,
    pub femoral_neck_z_score: Option<f64>,
    pub total_hip_t_score: Option<f64>,
    pub lowest_t_score: Option<f64>,
    pub bone_mineral_density_g_cm2: Option<f64>,
    pub who_classification: String,
    pub frax_major_fracture_percent: Option<f64>,
    pub frax_hip_fracture_percent: Option<f64>,
    pub vertebral_fracture_identified: bool,
    pub comparison_with_previous: String,
    pub percent_change_since_previous: Option<f64>,
    pub impression: String,
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
            "SELECT * FROM dexa_bone_density_test_results WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM dexa_bone_density_test_results WHERE deleted_at IS NULL",
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
            "SELECT * FROM dexa_bone_density_test_results WHERE id = $1 AND deleted_at IS \
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
            "WITH target AS (UPDATE dexa_bone_density_test_results SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE dexa_bone_density_test_result_grades SET deleted_at = \
            now(), updated_at = now() WHERE dexa_bone_density_test_result_id IN (SELECT \
            id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            dexa_bone_density_test_result_grade_rules SET deleted_at = now(), updated_at \
            = now() WHERE dexa_bone_density_test_result_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            dexa_bone_density_test_result_grade_flags SET deleted_at = now(), updated_at \
            = now() WHERE dexa_bone_density_test_result_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
