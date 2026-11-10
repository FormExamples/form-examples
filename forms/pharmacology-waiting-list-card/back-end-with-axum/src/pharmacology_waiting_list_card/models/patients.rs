//! patients model.

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
    pub birth_date: Date,
    pub sex: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub postal_address_as_full_text: Option<String>,
    pub country_as_iso_3166_1_alpha_2: Option<String>,
    pub postcode: Option<String>,
    pub united_kingdom_nhs_number: Option<String>,
    pub preferred_language_as_iso_639_1: String,
    pub interpreter_required: String,
    pub accessibility_needs: String,
    pub preferred_contact_channel: String,
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
            "SELECT * FROM patients WHERE deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET \
            $2",
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
        sqlx::query_as("SELECT * FROM patients WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE patients SET deleted_at = now(), updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            pharmacology_waiting_list_cards SET deleted_at = now(), updated_at = now() \
            WHERE patient_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child2 AS (UPDATE pharmacology_waiting_list_card_appointments SET \
            deleted_at = now(), updated_at = now() WHERE \
            pharmacology_waiting_list_card_id IN (SELECT id FROM child1) AND deleted_at \
            IS NULL RETURNING id), child3 AS (UPDATE \
            pharmacology_waiting_list_card_grades SET deleted_at = now(), updated_at = \
            now() WHERE pharmacology_waiting_list_card_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child4 AS (UPDATE \
            pharmacology_waiting_list_card_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE pharmacology_waiting_list_card_grade_id IN (SELECT \
            id FROM child3) AND deleted_at IS NULL RETURNING id), child5 AS (UPDATE \
            pharmacology_waiting_list_card_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE pharmacology_waiting_list_card_grade_id IN (SELECT \
            id FROM child3) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM \
            target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
