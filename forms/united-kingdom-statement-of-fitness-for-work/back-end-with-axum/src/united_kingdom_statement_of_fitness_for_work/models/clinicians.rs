//! clinicians model.

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
    pub email: Option<String>,
    pub phone: Option<String>,
    pub postal_address_as_full_text: Option<String>,
    pub country_as_iso_3166_1_alpha_2: Option<String>,
    pub postcode: Option<String>,
    pub profession: String,
    pub registration_body: String,
    pub registration_number: String,
    pub is_private_practice: String,
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
            "SELECT * FROM clinicians WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM clinicians WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM clinicians WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE clinicians SET deleted_at = now(), updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            united_kingdom_statement_of_fitness_for_works SET deleted_at = now(), \
            updated_at = now() WHERE clinician_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_kingdom_statement_of_fitness_for_work_grades SET deleted_at = now(), \
            updated_at = now() WHERE united_kingdom_statement_of_fitness_for_work_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE united_kingdom_statement_of_fitness_for_work_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE \
            united_kingdom_statement_of_fitness_for_work_grade_id IN (SELECT id FROM \
            child2) AND deleted_at IS NULL RETURNING id), child4 AS (UPDATE \
            united_kingdom_statement_of_fitness_for_work_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_kingdom_statement_of_fitness_for_work_grade_id IN (SELECT id FROM \
            child2) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
