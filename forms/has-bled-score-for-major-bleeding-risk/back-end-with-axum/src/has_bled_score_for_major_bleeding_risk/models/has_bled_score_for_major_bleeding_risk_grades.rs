//! has_bled_score_for_major_bleeding_risk_grades model.

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
    pub hypertension_points: Option<i32>,
    pub renal_points: Option<i32>,
    pub liver_points: Option<i32>,
    pub stroke_points: Option<i32>,
    pub bleeding_points: Option<i32>,
    pub labile_inr_points: Option<i32>,
    pub elderly_points: Option<i32>,
    pub drugs_points: Option<i32>,
    pub alcohol_points: Option<i32>,
    pub total_score: Option<i32>,
    pub risk_band: String,
    pub modifiable_factors: String,
    pub graded_at: DateTimeWithTimeZone,
    pub has_bled_score_for_major_bleeding_risk_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as("SELECT * FROM has_bled_score_for_major_bleeding_risk_grades ORDER BY id LIMIT $1 OFFSET $2")
            .bind(limit)
            .bind(offset)
            .fetch_all(db)
            .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM has_bled_score_for_major_bleeding_risk_grades",
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
        sqlx::query_as("SELECT * FROM has_bled_score_for_major_bleeding_risk_grades WHERE id = $1")
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
        sqlx::query("DELETE FROM has_bled_score_for_major_bleeding_risk_grades WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
