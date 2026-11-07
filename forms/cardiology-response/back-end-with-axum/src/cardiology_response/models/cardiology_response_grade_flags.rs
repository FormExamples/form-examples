//! Cardiology-response-grade-flags domain model.

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
    /// Stable flag identifier (e.g. `F-CRITICAL-FINDING-001`).
    pub flag_id: String,
    /// Flag category.
    pub category: String,
    /// Priority: low, medium, high.
    pub priority: String,
    /// Human-readable description of what fired the flag.
    pub description: String,
    /// Suggested clinical action.
    pub suggested_action: String,
    /// Foreign key to the parent grade.
    pub cardiology_response_grade_id: Uuid,
}
/// Cardiology response grade flags entity alias.
pub type CardiologyResponseGradeFlags = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM cardiology_response_grade_flags WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM cardiology_response_grade_flags WHERE deleted_at IS \
            NULL",
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
            "SELECT * FROM cardiology_response_grade_flags WHERE id = $1 AND deleted_at \
            IS NULL",
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
            "UPDATE cardiology_response_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}

/// List the flag rows for a grade, oldest first.
///
/// # Errors
/// Returns a database error if the query fails.
pub async fn list_for_grade(db: &PgPool, grade_id: Uuid) -> sqlx::Result<Vec<Model>> {
    sqlx::query_as::<_, Model>(
        "SELECT * FROM cardiology_response_grade_flags WHERE \
            cardiology_response_grade_id = $1 AND deleted_at IS NULL",
    )
    .bind(grade_id)
    .fetch_all(db)
    .await
}
