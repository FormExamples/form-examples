//! assessments model.

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
    pub patient_id: Uuid,
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
            "SELECT * FROM assessments WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
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
        sqlx::query_as("SELECT * FROM assessments WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE assessments SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            assessment_range_of_motions SET deleted_at = now(), updated_at = now() WHERE \
            assessment_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child2 AS (UPDATE assessment_strength_testings SET deleted_at = now(), \
            updated_at = now() WHERE assessment_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            assessment_imaging_histories SET deleted_at = now(), updated_at = now() \
            WHERE assessment_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child4 AS (UPDATE assessment_surgical_histories SET \
            deleted_at = now(), updated_at = now() WHERE assessment_id IN (SELECT id \
            FROM target) AND deleted_at IS NULL RETURNING id), child5 AS (UPDATE grades \
            SET deleted_at = now(), updated_at = now() WHERE assessment_id IN (SELECT id \
            FROM target) AND deleted_at IS NULL RETURNING id), child6 AS (UPDATE \
            assessment_rom_measurements SET deleted_at = now(), updated_at = now() WHERE \
            range_of_motion_id IN (SELECT id FROM child1) AND deleted_at IS \
            NULL RETURNING id), child7 AS (UPDATE assessment_strength_test_items SET \
            deleted_at = now(), updated_at = now() WHERE strength_testing_id IN (SELECT \
            id FROM child2) AND deleted_at IS NULL RETURNING id), child8 AS (UPDATE \
            assessment_imaging_items SET deleted_at = now(), updated_at = now() WHERE \
            imaging_history_id IN (SELECT id FROM child3) AND deleted_at IS NULL \
            RETURNING id), child9 AS (UPDATE assessment_surgery_items SET deleted_at = \
            now(), updated_at = now() WHERE surgical_history_id IN (SELECT id FROM \
            child4) AND deleted_at IS NULL RETURNING id), child10 AS (UPDATE \
            grading_fired_rules SET deleted_at = now(), updated_at = now() WHERE \
            grade_id IN (SELECT id FROM child5) AND deleted_at IS NULL RETURNING id), \
            child11 AS (UPDATE grading_additional_flags SET deleted_at = now(), \
            updated_at = now() WHERE grade_id IN (SELECT id FROM child5) AND deleted_at \
            IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
