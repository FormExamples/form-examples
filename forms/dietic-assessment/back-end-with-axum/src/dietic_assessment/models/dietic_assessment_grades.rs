//! dietic_assessment_grades model.

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
    pub must_bmi_score: Option<i32>,
    pub must_weight_loss_score: Option<i32>,
    pub must_acute_disease_score: Option<i32>,
    pub must_score: Option<i32>,
    pub computed_must_risk: String,
    pub final_must_risk: String,
    pub must_is_estimated: bool,
    pub glim_phenotypic_criteria: String,
    pub glim_etiologic_criteria: String,
    pub glim_diagnosis: String,
    pub nrs_2002_score: Option<i32>,
    pub sarcf_score: Option<i32>,
    pub scoff_score: Option<i32>,
    pub refeeding_risk: String,
    pub energy_requirement_kcal: Option<i32>,
    pub protein_requirement_g: Option<i32>,
    pub computed_composite_risk: String,
    pub final_composite_risk: String,
    pub override_reason: String,
    pub recommendation: String,
    pub dietitian_notes: String,
    pub signed_by_name: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
    pub dietic_assessment_id: Uuid,
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
            "SELECT * FROM dietic_assessment_grades WHERE deleted_at IS NULL ORDER BY id \
            LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM dietic_assessment_grades WHERE deleted_at IS NULL",
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
            "SELECT * FROM dietic_assessment_grades WHERE id = $1 AND deleted_at IS NULL",
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
            "WITH target AS (UPDATE dietic_assessment_grades SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE dietic_assessment_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE dietic_assessment_grade_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            dietic_assessment_grade_flags SET deleted_at = now(), updated_at = now() \
            WHERE dietic_assessment_grade_id IN (SELECT id FROM target) AND deleted_at \
            IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
