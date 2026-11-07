//! donors model.

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
    pub title: String,
    pub given_names: String,
    pub family_name: String,
    pub other_names_used: String,
    pub birth_date: Option<Date>,
    pub email: String,
    pub phone: String,
    pub postal_address_as_full_text: String,
    pub country_as_iso_3166_1_alpha_2: String,
    pub postcode: String,
    pub united_kingdom_nhs_number: Option<String>,
    pub jurisdiction: String,
    pub preferred_language: String,
    pub capacity_declared: String,
    pub capacity_declared_at: Option<DateTimeWithTimeZone>,
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
            "SELECT * FROM donors WHERE deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET $2",
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
        sqlx::query_as("SELECT * FROM donors WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE donors SET deleted_at = now(), updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE lpas \
            SET deleted_at = now(), updated_at = now() WHERE donor_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            lpa_attorneys SET deleted_at = now(), updated_at = now() WHERE lpa_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE lpa_replacement_attorneys SET deleted_at = now(), updated_at = now() \
            WHERE lpa_id IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING \
            id), child4 AS (UPDATE lpa_person_to_notifies SET deleted_at = now(), \
            updated_at = now() WHERE lpa_id IN (SELECT id FROM child1) AND deleted_at IS \
            NULL RETURNING id), child5 AS (UPDATE lpa_decision_rules SET deleted_at = \
            now(), updated_at = now() WHERE lpa_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child6 AS (UPDATE lpa_lst_choices SET \
            deleted_at = now(), updated_at = now() WHERE lpa_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child7 AS (UPDATE \
            lpa_preferences SET deleted_at = now(), updated_at = now() WHERE lpa_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child8 AS \
            (UPDATE lpa_instructions SET deleted_at = now(), updated_at = now() WHERE \
            lpa_id IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), \
            child9 AS (UPDATE lpa_signatures SET deleted_at = now(), updated_at = now() \
            WHERE lpa_id IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING \
            id), child10 AS (UPDATE lpa_registration_applications SET deleted_at = \
            now(), updated_at = now() WHERE lpa_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child11 AS (UPDATE lpa_validities SET \
            deleted_at = now(), updated_at = now() WHERE lpa_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child12 AS (UPDATE \
            lpa_validity_fired_rules SET deleted_at = now(), updated_at = now() WHERE \
            lpa_validity_id IN (SELECT id FROM child11) AND deleted_at IS NULL RETURNING \
            id), child13 AS (UPDATE lpa_validity_additional_flags SET deleted_at = \
            now(), updated_at = now() WHERE lpa_validity_id IN (SELECT id FROM child11) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
