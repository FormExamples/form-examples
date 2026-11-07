//! Clinicians domain model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
    /// ID.
    pub id: Uuid,
    /// Deleted at (soft-delete).
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Name.
    pub name: String,
    /// Email address.
    pub email: Option<String>,
    /// Phone number.
    pub phone: Option<String>,
    /// Postal address as full text.
    pub postal_address_as_full_text: Option<String>,
    /// Country as ISO 3166-1 alpha-2.
    pub country_as_iso_3166_1_alpha_2: Option<String>,
    /// Postcode.
    pub postcode: Option<String>,
    /// Clinician role.
    pub role: String,
    /// Registration body.
    pub registration_body: String,
    /// Registration number.
    pub registration_number: String,
    /// United Kingdom NHS number (unique).
    pub united_kingdom_nhs_number: Option<String>,
}
/// Clinicians entity alias.
pub type Clinicians = Model;

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
            cardiology_responses SET deleted_at = now(), updated_at = now() WHERE \
            clinician_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child2 AS (UPDATE cardiology_response_grades SET deleted_at = now(), \
            updated_at = now() WHERE cardiology_response_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            cardiology_response_grade_rules SET deleted_at = now(), updated_at = now() \
            WHERE cardiology_response_grade_id IN (SELECT id FROM child2) AND deleted_at \
            IS NULL RETURNING id), child4 AS (UPDATE cardiology_response_grade_flags SET \
            deleted_at = now(), updated_at = now() WHERE cardiology_response_grade_id IN \
            (SELECT id FROM child2) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
