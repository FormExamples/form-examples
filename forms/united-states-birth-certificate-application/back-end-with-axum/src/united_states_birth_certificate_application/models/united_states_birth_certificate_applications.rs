//! united_states_birth_certificate_applications model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub id: Uuid,
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub applicant_id: Option<Uuid>,
    pub registrant_id: Uuid,
    pub requester_relationship: String,
    pub purpose: String,
    pub needs_apostille: String,
    pub apostille_country: String,
    pub certificate_type: String,
    pub copies: Option<i32>,
    pub delivery_method: String,
    pub fee_enclosed_usd: Option<f64>,
    pub id_type: String,
    pub id_unexpired: String,
    pub proof_of_relationship: String,
    pub authority_document: String,
    pub notarized_sworn_statement: String,
    pub declaration_signed: String,
    pub application_note: String,
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
            "SELECT * FROM united_states_birth_certificate_applications WHERE deleted_at IS \
            NULL ORDER BY id LIMIT $1 OFFSET $2",
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
            "SELECT * FROM united_states_birth_certificate_applications WHERE id = $1 AND \
            deleted_at IS NULL",
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
            "WITH target AS (UPDATE united_states_birth_certificate_applications SET deleted_at \
            = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE united_states_birth_certificate_application_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            united_states_birth_certificate_application_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            united_states_birth_certificate_application_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE united_states_birth_certificate_application_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE united_states_birth_certificate_application_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            united_states_birth_certificate_application_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
