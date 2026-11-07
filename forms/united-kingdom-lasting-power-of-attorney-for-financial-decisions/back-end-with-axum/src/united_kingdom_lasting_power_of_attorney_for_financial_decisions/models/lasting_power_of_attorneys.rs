//! Lasting power of attorneys module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
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
    /// Decision mode.
    pub decision_mode: String,
    /// Decision mode mixed text.
    pub decision_mode_mixed_text: String,
    /// When attorneys can act.
    pub when_attorneys_can_act: String,
    /// Preferences text.
    pub preferences_text: String,
    /// Instructions text.
    pub instructions_text: String,
    /// Legal rights acknowledged.
    pub legal_rights_acknowledged: bool,
    /// Opg reference number.
    pub opg_reference_number: String,
    /// Opg registration date.
    pub opg_registration_date: Option<Date>,
    /// Status.
    pub status: String,
    /// Donor person id.
    pub donor_person_id: Uuid,
}
/// Lasting power of attorneys.
pub type LastingPowerOfAttorneys = Model;

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
            "SELECT * FROM lasting_power_of_attorneys WHERE deleted_at IS NULL ORDER BY \
            id LIMIT $1 OFFSET $2",
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
            "SELECT * FROM lasting_power_of_attorneys WHERE id = $1 AND deleted_at IS \
            NULL",
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
            "WITH target AS (UPDATE lasting_power_of_attorneys SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE lpa_attorneys SET deleted_at = now(), updated_at = now() \
            WHERE lpa_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child2 AS (UPDATE lpa_replacement_attorneys SET deleted_at = now(), \
            updated_at = now() WHERE lpa_id IN (SELECT id FROM target) AND deleted_at IS \
            NULL RETURNING id), child3 AS (UPDATE lpa_certificate_providers SET \
            deleted_at = now(), updated_at = now() WHERE lpa_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child4 AS (UPDATE \
            lpa_person_to_notifies SET deleted_at = now(), updated_at = now() WHERE \
            lpa_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), \
            child5 AS (UPDATE lpa_preferences_and_instructions SET deleted_at = now(), \
            updated_at = now() WHERE lpa_id IN (SELECT id FROM target) AND deleted_at IS \
            NULL RETURNING id), child6 AS (UPDATE lpa_signatures SET deleted_at = now(), \
            updated_at = now() WHERE lpa_id IN (SELECT id FROM target) AND deleted_at IS \
            NULL RETURNING id), child7 AS (UPDATE lpa_continuation_sheets SET deleted_at \
            = now(), updated_at = now() WHERE lpa_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child8 AS (UPDATE \
            lpa_registration_applications SET deleted_at = now(), updated_at = now() \
            WHERE lpa_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child9 AS (UPDATE lpa_registration_recipients SET deleted_at = now(), \
            updated_at = now() WHERE lpa_id IN (SELECT id FROM target) AND deleted_at IS \
            NULL RETURNING id), child10 AS (UPDATE lpa_validation_results SET deleted_at \
            = now(), updated_at = now() WHERE lpa_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child11 AS (UPDATE lpa_validation_rules \
            SET deleted_at = now(), updated_at = now() WHERE lpa_id IN (SELECT id FROM \
            target) AND deleted_at IS NULL RETURNING id), child12 AS (UPDATE \
            lpa_validation_flags SET deleted_at = now(), updated_at = now() WHERE lpa_id \
            IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child13 AS \
            (UPDATE lpa_witnesses SET deleted_at = now(), updated_at = now() WHERE \
            signature_id IN (SELECT id FROM child6) AND deleted_at IS NULL RETURNING id) \
            SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
