//! tumor_marker_test_results model.

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
    pub specimen_condition: String,
    pub clinical_history: String,
    pub known_cancer_site: String,
    pub psa: Option<f64>,
    pub ca125: Option<f64>,
    pub ca19_9: Option<f64>,
    pub carcinoembryonic_antigen_cea: Option<f64>,
    pub alpha_fetoprotein_afp: Option<f64>,
    pub beta_hcg: Option<f64>,
    pub ca15_3: Option<f64>,
    pub lactate_dehydrogenase_ldh: Option<f64>,
    pub calcitonin: Option<f64>,
    pub chromogranin_a: Option<f64>,
    pub previous_value: Option<f64>,
    pub trend: String,
    pub comparison_with_previous: String,
    pub overall_result_status: String,
    pub markedly_elevated: bool,
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
        let rows = sqlx::query_as(
            "SELECT * FROM tumor_marker_test_results WHERE deleted_at IS NULL ORDER BY id \
            LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM tumor_marker_test_results WHERE deleted_at IS NULL",
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
            "SELECT * FROM tumor_marker_test_results WHERE id = $1 AND deleted_at IS NULL",
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
            "WITH target AS (UPDATE tumor_marker_test_results SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE tumor_marker_test_result_grades SET deleted_at = now(), \
            updated_at = now() WHERE tumor_marker_test_result_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            tumor_marker_test_result_grade_rules SET deleted_at = now(), updated_at = \
            now() WHERE tumor_marker_test_result_grade_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            tumor_marker_test_result_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE tumor_marker_test_result_grade_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
