//! International certificate of vaccination or prophylaxes module.

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
    /// Status.
    pub status: String,
    /// Issued at.
    pub issued_at: Option<DateTimeWithTimeZone>,
    /// Revoked at.
    pub revoked_at: Option<DateTimeWithTimeZone>,
    /// Revocation reason.
    pub revocation_reason: String,
    /// Certificate serial number.
    pub certificate_serial_number: String,
    /// Issuing country as iso 3166 1 alpha 3.
    pub issuing_country_as_iso_3166_1_alpha_3: String,
    /// Primary language as bcp 47.
    pub primary_language_as_bcp_47: String,
    /// Secondary language as bcp 47.
    pub secondary_language_as_bcp_47: String,
    /// Tertiary language as bcp 47.
    pub tertiary_language_as_bcp_47: String,
    /// Destination countries as iso 3166 1 alpha 3.
    pub destination_countries_as_iso_3166_1_alpha_3: String,
    /// Planned arrival date.
    pub planned_arrival_date: Option<Date>,
    /// Purpose of travel.
    pub purpose_of_travel: String,
    /// Medical waiver.
    pub medical_waiver: String,
    /// Medical waiver reason.
    pub medical_waiver_reason: String,
    /// Medical waiver signed at.
    pub medical_waiver_signed_at: Option<DateTimeWithTimeZone>,
    /// Declared pregnancy.
    pub declared_pregnancy: String,
    /// Declared breastfeeding.
    pub declared_breastfeeding: String,
    /// Declared immunosuppression.
    pub declared_immunosuppression: String,
    /// Electronic signature data url.
    pub electronic_signature_data_url: String,
    /// Electronic signature signed at.
    pub electronic_signature_signed_at: Option<DateTimeWithTimeZone>,
    /// Overall valid.
    pub overall_valid: String,
    /// Validity computed at.
    pub validity_computed_at: Option<DateTimeWithTimeZone>,
    /// Notes.
    pub notes: String,
    /// Patient id.
    pub patient_id: Uuid,
    /// Clinician id.
    pub clinician_id: Uuid,
    /// Center id.
    pub center_id: Uuid,
    /// Medical waiver signed by clinician id.
    pub medical_waiver_signed_by_clinician_id: Option<Uuid>,
}
/// International certificate of vaccination or prophylaxes.
pub type InternationalCertificateOfVaccinationOrProphylaxes = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM international_certificate_of_vaccination_or_prophylaxes WHERE \
            deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM international_certificate_of_vaccination_or_prophylaxes \
            WHERE deleted_at IS NULL",
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
            "SELECT * FROM international_certificate_of_vaccination_or_prophylaxes WHERE \
            id = $1 AND deleted_at IS NULL",
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
            "WITH target AS (UPDATE \
            international_certificate_of_vaccination_or_prophylaxes SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE \
            international_certificate_of_vaccination_or_prophylaxis_entries SET \
            deleted_at = now(), updated_at = now() WHERE \
            international_certificate_of_vaccination_or_prophylaxis_id IN (SELECT id \
            FROM target) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM \
            target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
