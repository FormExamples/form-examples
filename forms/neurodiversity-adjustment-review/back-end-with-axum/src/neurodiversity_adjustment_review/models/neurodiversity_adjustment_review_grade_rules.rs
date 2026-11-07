//! Neurodiversity-adjustment-review-grade-rules domain model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
    /// ID.
    pub id: Uuid,
    /// Deleted at (soft-delete).
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Stable rule identifier (e.g. `R-EFFECT-INEFFECTIVE`).
    pub rule_id: String,
    /// Scoring axis the rule belongs to.
    pub axis: String,
    /// Category or reason the rule relates to.
    pub category: String,
    /// Human-readable description of why the rule fired.
    pub description: String,
    /// Foreign key to the parent grade.
    pub neurodiversity_adjustment_review_grade_id: Uuid,
}
/// Neurodiversity adjustment review grade rules entity alias.
pub type NeurodiversityAdjustmentReviewGradeRules = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM neurodiversity_adjustment_review_grade_rules WHERE deleted_at \
            IS NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM neurodiversity_adjustment_review_grade_rules WHERE \
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
            "SELECT * FROM neurodiversity_adjustment_review_grade_rules WHERE id = $1 AND \
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
            "UPDATE neurodiversity_adjustment_review_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}

/// List the fired-rule rows for a grade, oldest first.
///
/// # Errors
/// Returns a database error if the query fails.
pub async fn list_for_grade(db: &PgPool, grade_id: Uuid) -> sqlx::Result<Vec<Model>> {
    sqlx::query_as::<_, Model>(
        "SELECT * FROM neurodiversity_adjustment_review_grade_rules WHERE \
            neurodiversity_adjustment_review_grade_id = $1 AND deleted_at IS NULL",
    )
    .bind(grade_id)
    .fetch_all(db)
    .await
}
