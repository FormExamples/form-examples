//! gi_surgery_waiting_list_card_grades model.

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
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub waiting_time_status: String,
    pub clinical_priority: String,
    pub target_wait_weeks: Option<f64>,
    pub days_waited: Option<i32>,
    pub weeks_waited: Option<f64>,
    pub days_to_target: Option<i32>,
    pub days_to_breach: Option<i32>,
    pub days_to_appointment: Option<i32>,
    pub grader_notes: String,
    pub graded_at: DateTimeWithTimeZone,
    pub gi_surgery_waiting_list_card_id: Uuid,
}

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
            "SELECT * FROM gi_surgery_waiting_list_card_grades WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
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
        sqlx::query_as(
            "SELECT * FROM gi_surgery_waiting_list_card_grades WHERE id = $1 AND \
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
            "WITH target AS (UPDATE gi_surgery_waiting_list_card_grades SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE gi_surgery_waiting_list_card_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE \
            gi_surgery_waiting_list_card_grade_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            gi_surgery_waiting_list_card_grade_flags SET deleted_at = now(), updated_at \
            = now() WHERE gi_surgery_waiting_list_card_grade_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
