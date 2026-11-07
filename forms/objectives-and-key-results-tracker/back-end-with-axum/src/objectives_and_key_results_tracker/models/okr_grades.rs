//! Okr grades module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
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
    /// Okr objective id.
    pub okr_objective_id: Uuid,
    /// Score by progress percent.
    pub score_by_progress_percent: Option<f64>,
    /// Score by confidence decile.
    pub score_by_confidence_decile: Option<i32>,
    /// Score by stretch tier.
    pub score_by_stretch_tier: Option<i32>,
    /// Score by alignment grade.
    pub score_by_alignment_grade: Option<i32>,
    /// Score by impact tier.
    pub score_by_impact_tier: Option<i32>,
    /// Score by smart quality.
    pub score_by_smart_quality: Option<i32>,
    /// Score by pace deviation percent.
    pub score_by_pace_deviation_percent: Option<f64>,
    /// Computed composite rag.
    pub computed_composite_rag: String,
    /// Final composite rag.
    pub final_composite_rag: String,
    /// Override reason.
    pub override_reason: String,
    /// Recommendation.
    pub recommendation: String,
    /// Triage notes.
    pub triage_notes: String,
    /// Signed by.
    pub signed_by: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}
/// Okr grades.
pub type OkrGrades = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM okr_grades WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM okr_grades WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM okr_grades WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE okr_grades SET deleted_at = now(), updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            okr_grade_rules SET deleted_at = now(), updated_at = now() WHERE \
            okr_grade_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child2 AS (UPDATE okr_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE okr_grade_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
