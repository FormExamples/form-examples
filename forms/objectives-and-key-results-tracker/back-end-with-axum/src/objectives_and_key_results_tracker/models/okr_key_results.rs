//! Okr key results module.

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
    /// Position.
    pub position: i32,
    /// Title.
    pub title: String,
    /// Kr type.
    pub kr_type: String,
    /// Unit.
    pub unit: String,
    /// Start value.
    pub start_value: Option<f64>,
    /// Current value.
    pub current_value: Option<f64>,
    /// Target value.
    pub target_value: Option<f64>,
    /// Milestones json.
    pub milestones_json: Option<serde_json::Value>,
    /// Binary done.
    pub binary_done: Option<bool>,
    /// Owner name.
    pub owner_name: String,
    /// Due date.
    pub due_date: Option<Date>,
    /// Progress fraction.
    pub progress_fraction: Option<f64>,
}
/// Okr key results.
pub type OkrKeyResults = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as(
            "SELECT * FROM okr_key_results WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as("SELECT * FROM okr_key_results WHERE id = $1 AND deleted_at IS NULL")
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
            "UPDATE okr_key_results SET deleted_at = now(), updated_at = now() WHERE id = \
            $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
