//! Neurodiversity adjustment request grades module.

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
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Eligibility band.
    pub eligibility_band: String,
    /// Impact band.
    pub impact_band: String,
    /// Completeness percent.
    pub completeness_percent: Option<i32>,
    /// Priority tier.
    pub priority_tier: String,
    /// Target timeframe.
    pub target_timeframe: String,
    /// Recommendation.
    pub recommendation: String,
    /// Manager notes.
    pub manager_notes: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
    /// Neurodiversity adjustment request ID.
    pub neurodiversity_adjustment_request_id: Uuid,
}
/// Neurodiversity adjustment request grades.
pub type NeurodiversityAdjustmentRequestGrades = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM neurodiversity_adjustment_request_grades ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM neurodiversity_adjustment_request_grades")
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
        sqlx::query_as("SELECT * FROM neurodiversity_adjustment_request_grades WHERE id = $1")
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
        sqlx::query("DELETE FROM neurodiversity_adjustment_request_grades WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
