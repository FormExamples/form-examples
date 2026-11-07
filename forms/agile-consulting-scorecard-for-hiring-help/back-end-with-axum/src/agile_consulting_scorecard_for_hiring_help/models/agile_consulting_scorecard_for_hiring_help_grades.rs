//! Agile consulting scorecard for hiring help grades module.

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
    /// Score total.
    pub score_total: Option<i32>,
    /// Manifesto subtotal.
    pub manifesto_subtotal: Option<i32>,
    /// Principles subtotal.
    pub principles_subtotal: Option<i32>,
    /// Computed band.
    pub computed_band: String,
    /// Final band.
    pub final_band: String,
    /// Override reason.
    pub override_reason: String,
    /// Recommendation.
    pub recommendation: String,
    /// Recommended focus areas.
    pub recommended_focus_areas: String,
    /// Review notes.
    pub review_notes: String,
    /// Signed by.
    pub signed_by: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
    /// Agile consulting scorecard for hiring help id.
    pub agile_consulting_scorecard_for_hiring_help_id: Uuid,
}
/// Agile consulting scorecard for hiring help grades.
pub type AgileConsultingScorecardForHiringHelpGrades = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM agile_consulting_scorecard_for_hiring_help_grades WHERE \
            deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM agile_consulting_scorecard_for_hiring_help_grades WHERE \
            deleted_at IS NULL",
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
            "SELECT * FROM agile_consulting_scorecard_for_hiring_help_grades WHERE id = \
            $1 AND deleted_at IS NULL",
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
            "WITH target AS (UPDATE agile_consulting_scorecard_for_hiring_help_grades SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            agile_consulting_scorecard_for_hiring_help_grade_rules SET deleted_at = \
            now(), updated_at = now() WHERE agile_consulting_scorecard_grade_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE agile_consulting_scorecard_for_hiring_help_grade_flags SET \
            deleted_at = now(), updated_at = now() WHERE \
            agile_consulting_scorecard_grade_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
