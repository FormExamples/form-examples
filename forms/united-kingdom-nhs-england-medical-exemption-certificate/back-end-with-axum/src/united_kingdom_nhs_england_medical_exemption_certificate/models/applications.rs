//! Applications module.

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
    /// Patient id.
    pub patient_id: Uuid,
    /// Practitioner id.
    pub practitioner_id: Uuid,
    /// Status.
    pub status: String,
    /// Application kind.
    pub application_kind: String,
    /// Previous certificate number.
    pub previous_certificate_number: String,
    /// Previous certificate expiry date.
    pub previous_certificate_expiry_date: Option<Date>,
    /// Completed date.
    pub completed_date: Option<Date>,
    /// Posted date.
    pub posted_date: Option<Date>,
    /// Received by nhsbsa date.
    pub received_by_nhsbsa_date: Option<Date>,
    /// Certificate number.
    pub certificate_number: String,
    /// Valid from.
    pub valid_from: Option<Date>,
    /// Valid until.
    pub valid_until: Option<Date>,
    /// Practitioner signature present.
    pub practitioner_signature_present: String,
    /// Practitioner declaration text.
    pub practitioner_declaration_text: String,
    /// Notes.
    pub notes: String,
}
/// Applications.
pub type Applications = Model;

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
            "SELECT * FROM applications WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
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
        sqlx::query_as("SELECT * FROM applications WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE applications SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            application_eligible_conditions SET deleted_at = now(), updated_at = now() \
            WHERE application_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child2 AS (UPDATE grades SET deleted_at = now(), updated_at = \
            now() WHERE application_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child3 AS (UPDATE grade_fired_rules SET deleted_at = now(), \
            updated_at = now() WHERE grade_id IN (SELECT id FROM child2) AND deleted_at \
            IS NULL RETURNING id), child4 AS (UPDATE grade_additional_flags SET \
            deleted_at = now(), updated_at = now() WHERE grade_id IN (SELECT id FROM \
            child2) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
