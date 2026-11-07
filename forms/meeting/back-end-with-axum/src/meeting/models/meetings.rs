//! meetings model.

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
    pub status: String,
    pub title: String,
    pub purpose: String,
    pub long_description: String,
    pub category: String,
    pub visibility: String,
    pub scheduled_start_at: Option<DateTimeWithTimeZone>,
    pub scheduled_end_at: Option<DateTimeWithTimeZone>,
    pub timezone: String,
    pub location: String,
    pub video_url: String,
    pub phone_number: String,
    pub dial_in_code: String,
    pub joining_instructions: String,
    pub calendar_uid: String,
    pub summary: String,
    pub actual_start_at: Option<DateTimeWithTimeZone>,
    pub actual_end_at: Option<DateTimeWithTimeZone>,
    pub overall_result: String,
    pub additional_notes: String,
    pub signed_by_name: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub organizer_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM meetings WHERE deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET \
            $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM meetings WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM meetings WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE meetings SET deleted_at = now(), updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            agenda_items SET deleted_at = now(), updated_at = now() WHERE meeting_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE participants SET deleted_at = now(), updated_at = now() WHERE \
            meeting_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), \
            child3 AS (UPDATE resources SET deleted_at = now(), updated_at = now() WHERE \
            meeting_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), \
            child4 AS (UPDATE recurring_rules SET deleted_at = now(), updated_at = now() \
            WHERE meeting_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child5 AS (UPDATE action_items SET deleted_at = now(), updated_at = \
            now() WHERE meeting_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child6 AS (UPDATE meeting_outputs SET deleted_at = now(), \
            updated_at = now() WHERE meeting_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child7 AS (UPDATE meeting_outcomes SET \
            deleted_at = now(), updated_at = now() WHERE meeting_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child8 AS (UPDATE \
            meeting_grades SET deleted_at = now(), updated_at = now() WHERE meeting_id \
            IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child9 AS \
            (UPDATE meeting_grade_rules SET deleted_at = now(), updated_at = now() WHERE \
            meeting_grade_id IN (SELECT id FROM child8) AND deleted_at IS NULL RETURNING \
            id), child10 AS (UPDATE meeting_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE meeting_grade_id IN (SELECT id FROM child8) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
