//! apgar_score_grades model.

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
    pub total_one_minute: Option<i32>,
    pub total_five_minute: Option<i32>,
    pub total_ten_minute: Option<i32>,
    pub band_one_minute: String,
    pub band_five_minute: String,
    pub band_ten_minute: String,
    pub summary_band: String,
    pub trend: String,
    pub graded_at: DateTimeWithTimeZone,
    pub apgar_score_id: Uuid,
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
            "SELECT * FROM apgar_score_grades WHERE deleted_at IS NULL ORDER BY id LIMIT \
            $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM apgar_score_grades WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM apgar_score_grades WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE apgar_score_grades SET deleted_at = now(), updated_at \
            = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS \
            (UPDATE apgar_score_grade_rules SET deleted_at = now(), updated_at = now() \
            WHERE apgar_score_grade_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child2 AS (UPDATE apgar_score_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE apgar_score_grade_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
