//! glasgow_blatchford_bleeding_score_grades model.

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
    pub blood_urea_points: Option<i32>,
    pub haemoglobin_points: Option<i32>,
    pub systolic_blood_pressure_points: Option<i32>,
    pub pulse_point: Option<i32>,
    pub melaena_point: Option<i32>,
    pub syncope_point: Option<i32>,
    pub hepatic_disease_point: Option<i32>,
    pub cardiac_failure_point: Option<i32>,
    pub total_score: Option<i32>,
    pub risk_band: String,
    pub recommended_management: String,
    pub graded_at: DateTimeWithTimeZone,
    pub glasgow_blatchford_bleeding_score_id: Uuid,
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
            "SELECT * FROM glasgow_blatchford_bleeding_score_grades ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM glasgow_blatchford_bleeding_score_grades")
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
        sqlx::query_as("SELECT * FROM glasgow_blatchford_bleeding_score_grades WHERE id = $1")
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
        sqlx::query("DELETE FROM glasgow_blatchford_bleeding_score_grades WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
