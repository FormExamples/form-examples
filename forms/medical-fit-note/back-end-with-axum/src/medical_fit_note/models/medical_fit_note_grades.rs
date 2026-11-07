//! Medical fit note grades module.

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
    /// Approval status.
    pub approval_status: String,
    /// Duration days.
    pub duration_days: Option<i32>,
    /// Adjustment count.
    pub adjustment_count: Option<i32>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
    /// Medical fit note ID.
    pub medical_fit_note_id: Uuid,
}
/// Medical fit note grades.
pub type MedicalFitNoteGrades = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM medical_fit_note_grades WHERE deleted_at IS NULL ORDER BY id \
            LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM medical_fit_note_grades WHERE deleted_at IS NULL",
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
        sqlx::query_as("SELECT * FROM medical_fit_note_grades WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE medical_fit_note_grades SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE medical_fit_note_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE grade_id IN (SELECT id FROM target) AND deleted_at \
            IS NULL RETURNING id), child2 AS (UPDATE medical_fit_note_grade_flags SET \
            deleted_at = now(), updated_at = now() WHERE medical_fit_note_grade_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
