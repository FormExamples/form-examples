//! release_forms model.

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
            "SELECT * FROM release_forms WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
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
        sqlx::query_as("SELECT * FROM release_forms WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE release_forms SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            authorized_recipients SET deleted_at = now(), updated_at = now() WHERE \
            release_form_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child2 AS (UPDATE records_to_releases SET deleted_at = now(), \
            updated_at = now() WHERE release_form_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE purpose_of_releases SET \
            deleted_at = now(), updated_at = now() WHERE release_form_id IN (SELECT id \
            FROM target) AND deleted_at IS NULL RETURNING id), child4 AS (UPDATE \
            authorization_periods SET deleted_at = now(), updated_at = now() WHERE \
            release_form_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child5 AS (UPDATE restrictions_limitations SET deleted_at = now(), \
            updated_at = now() WHERE release_form_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child6 AS (UPDATE patient_rights SET \
            deleted_at = now(), updated_at = now() WHERE release_form_id IN (SELECT id \
            FROM target) AND deleted_at IS NULL RETURNING id), child7 AS (UPDATE \
            signature_consents SET deleted_at = now(), updated_at = now() WHERE \
            release_form_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child8 AS (UPDATE validation_results SET deleted_at = now(), updated_at \
            = now() WHERE release_form_id IN (SELECT id FROM target) AND deleted_at IS \
            NULL RETURNING id), child9 AS (UPDATE validation_fired_rules SET deleted_at \
            = now(), updated_at = now() WHERE validation_result_id IN (SELECT id FROM \
            child8) AND deleted_at IS NULL RETURNING id), child10 AS (UPDATE \
            validation_additional_flags SET deleted_at = now(), updated_at = now() WHERE \
            validation_result_id IN (SELECT id FROM child8) AND deleted_at IS NULL \
            RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
