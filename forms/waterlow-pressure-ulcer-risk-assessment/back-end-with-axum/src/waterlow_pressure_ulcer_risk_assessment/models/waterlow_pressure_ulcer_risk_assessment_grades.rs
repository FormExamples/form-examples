//! waterlow_pressure_ulcer_risk_assessment_grades model.

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
    pub build_points: Option<i32>,
    pub skin_points: Option<i32>,
    pub sex_points: Option<i32>,
    pub age_points: Option<i32>,
    pub continence_points: Option<i32>,
    pub mobility_points: Option<i32>,
    pub tissue_malnutrition_points: Option<i32>,
    pub neurological_deficit_points: Option<i32>,
    pub major_surgery_trauma_points: Option<i32>,
    pub medication_points: Option<i32>,
    pub total_score: Option<i32>,
    pub risk_band: String,
    pub prevention_actions: String,
    pub graded_at: DateTimeWithTimeZone,
    pub waterlow_pressure_ulcer_risk_assessment_id: Uuid,
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
            "SELECT * FROM waterlow_pressure_ulcer_risk_assessment_grades WHERE \
            deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET $2",
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
            "SELECT * FROM waterlow_pressure_ulcer_risk_assessment_grades WHERE id = $1 \
            AND deleted_at IS NULL",
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
            "WITH target AS (UPDATE waterlow_pressure_ulcer_risk_assessment_grades SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            waterlow_pressure_ulcer_risk_assessment_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE waterlow_pressure_ulcer_risk_assessment_grade_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE waterlow_pressure_ulcer_risk_assessment_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            waterlow_pressure_ulcer_risk_assessment_grade_id IN (SELECT id FROM target) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
