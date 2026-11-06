//! agile_checklist_grades model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub id: Uuid,
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub answered_count: i32,
    pub teams_yes_count: i32,
    pub teams_applicable_count: i32,
    pub teams_percent: Option<f64>,
    pub stakeholders_yes_count: i32,
    pub stakeholders_applicable_count: i32,
    pub stakeholders_percent: Option<f64>,
    pub practices_yes_count: i32,
    pub practices_applicable_count: i32,
    pub practices_percent: Option<f64>,
    pub overall_percent: Option<f64>,
    pub teams_band: String,
    pub stakeholders_band: String,
    pub practices_band: String,
    pub maturity: String,
    pub top_action_1: String,
    pub top_action_2: String,
    pub top_action_3: String,
    pub coach_notes: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
    pub agile_checklist_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows =
            sqlx::query_as("SELECT * FROM agile_checklist_grades ORDER BY id LIMIT $1 OFFSET $2")
                .bind(limit)
                .bind(offset)
                .fetch_all(db)
                .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM agile_checklist_grades")
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
        sqlx::query_as("SELECT * FROM agile_checklist_grades WHERE id = $1")
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
        sqlx::query("DELETE FROM agile_checklist_grades WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
