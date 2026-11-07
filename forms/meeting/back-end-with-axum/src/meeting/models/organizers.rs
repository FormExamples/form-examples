//! organizers model.

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
    pub name: String,
    pub email: String,
    pub phone: String,
    pub role: String,
    pub organisation: String,
    pub team: String,
    pub location: String,
    pub timezone: String,
    pub preferred_contact: String,
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
            "SELECT * FROM organizers WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM organizers WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM organizers WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE organizers SET deleted_at = now(), updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            meetings SET deleted_at = now(), updated_at = now() WHERE organizer_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE agenda_items SET deleted_at = now(), updated_at = now() WHERE \
            meeting_id IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), \
            child3 AS (UPDATE participants SET deleted_at = now(), updated_at = now() \
            WHERE meeting_id IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING \
            id), child4 AS (UPDATE resources SET deleted_at = now(), updated_at = now() \
            WHERE meeting_id IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING \
            id), child5 AS (UPDATE recurring_rules SET deleted_at = now(), updated_at = \
            now() WHERE meeting_id IN (SELECT id FROM child1) AND deleted_at IS NULL \
            RETURNING id), child6 AS (UPDATE action_items SET deleted_at = now(), \
            updated_at = now() WHERE meeting_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child7 AS (UPDATE meeting_outputs SET \
            deleted_at = now(), updated_at = now() WHERE meeting_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child8 AS (UPDATE \
            meeting_outcomes SET deleted_at = now(), updated_at = now() WHERE meeting_id \
            IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child9 AS \
            (UPDATE meeting_grades SET deleted_at = now(), updated_at = now() WHERE \
            meeting_id IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), \
            child10 AS (UPDATE meeting_grade_rules SET deleted_at = now(), updated_at = \
            now() WHERE meeting_grade_id IN (SELECT id FROM child9) AND deleted_at IS \
            NULL RETURNING id), child11 AS (UPDATE meeting_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE meeting_grade_id IN (SELECT id FROM child9) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
