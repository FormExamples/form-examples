//! rockall_score_for_upper_gastrointestinal_bleeding_grades model.

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
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub age_points: Option<i32>,
    pub shock_points: Option<i32>,
    pub comorbidity_points: Option<i32>,
    pub clinical_score: Option<i32>,
    pub diagnosis_points: Option<i32>,
    pub stigmata_points: Option<i32>,
    pub full_score: Option<i32>,
    pub risk_band: String,
    pub graded_at: DateTimeWithTimeZone,
    pub rockall_score_for_upper_gastrointestinal_bleeding_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as("SELECT * FROM rockall_score_for_upper_gastrointestinal_bleeding_grades ORDER BY id LIMIT $1 OFFSET $2")
            .bind(limit)
            .bind(offset)
            .fetch_all(db)
            .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM rockall_score_for_upper_gastrointestinal_bleeding_grades",
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
            "SELECT * FROM rockall_score_for_upper_gastrointestinal_bleeding_grades WHERE id = $1",
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
            "DELETE FROM rockall_score_for_upper_gastrointestinal_bleeding_grades WHERE id = $1",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
