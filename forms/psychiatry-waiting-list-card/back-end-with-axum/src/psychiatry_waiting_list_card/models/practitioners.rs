//! practitioners model.

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
    pub role: String,
    pub registration_body: String,
    pub registration_number: String,
    pub organisation_name: String,
    pub organisation_ods_code: String,
    pub site_name: String,
    pub country_as_iso_3166_1_alpha_2: Option<String>,
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
            "SELECT * FROM practitioners WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM practitioners WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM practitioners WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE practitioners SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            psychiatry_waiting_list_cards SET deleted_at = now(), updated_at = now() \
            WHERE practitioner_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child2 AS (UPDATE psychiatry_waiting_list_card_appointments \
            SET deleted_at = now(), updated_at = now() WHERE \
            psychiatry_waiting_list_card_id IN (SELECT id FROM child1) AND deleted_at IS \
            NULL RETURNING id), child3 AS (UPDATE psychiatry_waiting_list_card_grades \
            SET deleted_at = now(), updated_at = now() WHERE \
            psychiatry_waiting_list_card_id IN (SELECT id FROM child1) AND deleted_at IS \
            NULL RETURNING id), child4 AS (UPDATE \
            psychiatry_waiting_list_card_grade_rules SET deleted_at = now(), updated_at \
            = now() WHERE psychiatry_waiting_list_card_grade_id IN (SELECT id FROM \
            child3) AND deleted_at IS NULL RETURNING id), child5 AS (UPDATE \
            psychiatry_waiting_list_card_grade_flags SET deleted_at = now(), updated_at \
            = now() WHERE psychiatry_waiting_list_card_grade_id IN (SELECT id FROM \
            child3) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
