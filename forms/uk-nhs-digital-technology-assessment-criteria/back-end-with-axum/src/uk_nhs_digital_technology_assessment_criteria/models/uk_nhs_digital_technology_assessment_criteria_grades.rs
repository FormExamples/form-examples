//! Uk NHS digital technology assessment criteria grades module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
    /// ID.
    pub id: Uuid,
    /// Deleted at.
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Outcome.
    pub outcome: String,
    /// Mandatory total.
    pub mandatory_total: i32,
    /// Mandatory met.
    pub mandatory_met: i32,
    /// Advisory total.
    pub advisory_total: i32,
    /// Advisory met.
    pub advisory_met: i32,
    /// Section a result.
    pub section_a_result: String,
    /// Section b result.
    pub section_b_result: String,
    /// Section c result.
    pub section_c_result: String,
    /// Section d result.
    pub section_d_result: String,
    /// Section e result.
    pub section_e_result: String,
    /// Section f result.
    pub section_f_result: String,
    /// Section g result.
    pub section_g_result: String,
    /// Assessor override reason.
    pub assessor_override_reason: String,
    /// Final outcome.
    pub final_outcome: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
    /// Uk NHS digital technology assessment criteria ID.
    pub uk_nhs_digital_technology_assessment_criteria_id: Uuid,
}
/// Uk NHS digital technology assessment criteria grades.
pub type UkNhsDigitalTechnologyAssessmentCriteriaGrades = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM uk_nhs_digital_technology_assessment_criteria_grades WHERE \
            deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM uk_nhs_digital_technology_assessment_criteria_grades \
            WHERE deleted_at IS NULL",
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
            "SELECT * FROM uk_nhs_digital_technology_assessment_criteria_grades WHERE id \
            = $1 AND deleted_at IS NULL",
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
            "WITH target AS (UPDATE uk_nhs_digital_technology_assessment_criteria_grades \
            SET deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING id), child1 AS (UPDATE \
            uk_nhs_digital_technology_assessment_criteria_grade_rules SET deleted_at = \
            now(), updated_at = now() WHERE grade_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            uk_nhs_digital_technology_assessment_criteria_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            uk_nhs_digital_technology_assessment_criteria_grade_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
