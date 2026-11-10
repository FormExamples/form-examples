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
    pub birth_date: Option<Date>,
    pub social_security_number: String,
    pub street_address: String,
    pub city: String,
    pub state: String,
    pub zip_code: String,
    pub phone: String,
    pub email: String,
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
            hipaa_authorizations SET deleted_at = now(), updated_at = now() WHERE \
            patient_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), \
            child2 AS (UPDATE signers SET deleted_at = now(), updated_at = now() WHERE \
            hipaa_authorization_id IN (SELECT id FROM child1) AND deleted_at IS NULL \
            RETURNING id), child3 AS (UPDATE disclosing_sources SET deleted_at = now(), \
            updated_at = now() WHERE hipaa_authorization_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child4 AS (UPDATE \
            authorized_recipients SET deleted_at = now(), updated_at = now() WHERE \
            hipaa_authorization_id IN (SELECT id FROM child1) AND deleted_at IS NULL \
            RETURNING id), child5 AS (UPDATE records_to_discloses SET deleted_at = \
            now(), updated_at = now() WHERE hipaa_authorization_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child6 AS (UPDATE \
            purpose_of_disclosures SET deleted_at = now(), updated_at = now() WHERE \
            hipaa_authorization_id IN (SELECT id FROM child1) AND deleted_at IS NULL \
            RETURNING id), child7 AS (UPDATE expirations SET deleted_at = now(), \
            updated_at = now() WHERE hipaa_authorization_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child8 AS (UPDATE \
            patient_rights_acknowledgements SET deleted_at = now(), updated_at = now() \
            WHERE hipaa_authorization_id IN (SELECT id FROM child1) AND deleted_at IS \
            NULL RETURNING id), child9 AS (UPDATE signature_witnesses SET deleted_at = \
            now(), updated_at = now() WHERE hipaa_authorization_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child10 AS (UPDATE \
            validation_results SET deleted_at = now(), updated_at = now() WHERE \
            hipaa_authorization_id IN (SELECT id FROM child1) AND deleted_at IS NULL \
            RETURNING id), child11 AS (UPDATE validation_fired_rules SET deleted_at = \
            now(), updated_at = now() WHERE validation_result_id IN (SELECT id FROM \
            child10) AND deleted_at IS NULL RETURNING id), child12 AS (UPDATE \
            validation_additional_flags SET deleted_at = now(), updated_at = now() WHERE \
            validation_result_id IN (SELECT id FROM child10) AND deleted_at IS NULL \
            RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
