//! Lpa registration recipients module.

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
    /// Lpa id.
    pub lpa_id: Uuid,
    /// Recipient kind.
    pub recipient_kind: String,
    /// Recipient person id.
    pub recipient_person_id: Option<Uuid>,
    /// Company name.
    pub company_name: String,
    /// Prefers post.
    pub prefers_post: bool,
    /// Prefers phone.
    pub prefers_phone: bool,
    /// Prefers email.
    pub prefers_email: bool,
    /// Prefers welsh.
    pub prefers_welsh: bool,
    /// Contact phone.
    pub contact_phone: String,
    /// Contact email.
    pub contact_email: String,
    /// Other first names.
    pub other_first_names: String,
    /// Other last name.
    pub other_last_name: String,
    /// Other address line 1.
    pub other_address_line_1: String,
    /// Other address line 2.
    pub other_address_line_2: String,
    /// Other address line 3.
    pub other_address_line_3: String,
    /// Other postcode.
    pub other_postcode: String,
}
/// Lpa registration recipients.
pub type LpaRegistrationRecipients = Model;

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
            "SELECT * FROM lpa_registration_recipients WHERE deleted_at IS NULL ORDER BY \
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
            "SELECT * FROM lpa_registration_recipients WHERE id = $1 AND deleted_at IS \
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
            "UPDATE lpa_registration_recipients SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
