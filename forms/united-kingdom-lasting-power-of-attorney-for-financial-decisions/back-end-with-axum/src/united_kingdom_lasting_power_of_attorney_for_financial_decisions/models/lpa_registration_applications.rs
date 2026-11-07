//! Lpa registration applications module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
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
    /// Applicant kind.
    pub applicant_kind: String,
    /// Payment method.
    pub payment_method: String,
    /// Card payment phone.
    pub card_payment_phone: String,
    /// Reduced fee requested.
    pub reduced_fee_requested: bool,
    /// Has lpa120a evidence.
    pub has_lpa120a_evidence: bool,
    /// Is repeat application.
    pub is_repeat_application: bool,
    /// Repeat case number.
    pub repeat_case_number: String,
    /// Payment reference.
    pub payment_reference: String,
    /// Payment date.
    pub payment_date: Option<Date>,
    /// Payment amount.
    pub payment_amount: Option<f64>,
}
/// Lpa registration applications.
pub type LpaRegistrationApplications = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM lpa_registration_applications WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM lpa_registration_applications WHERE deleted_at IS NULL",
        )
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
        sqlx::query_as(
            "SELECT * FROM lpa_registration_applications WHERE id = $1 AND deleted_at IS \
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
            "UPDATE lpa_registration_applications SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
