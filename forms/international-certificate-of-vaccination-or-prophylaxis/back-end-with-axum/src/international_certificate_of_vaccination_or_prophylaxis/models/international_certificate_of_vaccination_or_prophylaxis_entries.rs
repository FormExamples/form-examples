//! International certificate of vaccination or prophylaxis entries module.

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
    /// International certificate of vaccination or prophylaxis id.
    pub international_certificate_of_vaccination_or_prophylaxis_id: Uuid,
    /// Entry index.
    pub entry_index: i32,
    /// Disease.
    pub disease: String,
    /// Disease other label.
    pub disease_other_label: String,
    /// Disease as snomed ct.
    pub disease_as_snomed_ct: String,
    /// Disease as icd 11.
    pub disease_as_icd_11: String,
    /// Vaccine or prophylaxis name.
    pub vaccine_or_prophylaxis_name: String,
    /// Vaccine as snomed ct.
    pub vaccine_as_snomed_ct: String,
    /// Vaccine as atc.
    pub vaccine_as_atc: String,
    /// Manufacturer.
    pub manufacturer: String,
    /// Manufacturer country as iso 3166 1 alpha 3.
    pub manufacturer_country_as_iso_3166_1_alpha_3: String,
    /// Batch number.
    pub batch_number: String,
    /// Lot expiry date.
    pub lot_expiry_date: Option<Date>,
    /// Route.
    pub route: String,
    /// Anatomical site.
    pub anatomical_site: String,
    /// Dose amount value.
    pub dose_amount_value: Option<f64>,
    /// Dose amount unit.
    pub dose_amount_unit: String,
    /// Dose sequence.
    pub dose_sequence: Option<i32>,
    /// Dose sequence total.
    pub dose_sequence_total: Option<i32>,
    /// Vaccination date.
    pub vaccination_date: Option<Date>,
    /// Vaccination time.
    pub vaccination_time: Option<Time>,
    /// Administered by clinician id.
    pub administered_by_clinician_id: Option<Uuid>,
    /// Administering clinician signature data url.
    pub administering_clinician_signature_data_url: String,
    /// Administering clinician professional status.
    pub administering_clinician_professional_status: String,
    /// Validity starts on.
    pub validity_starts_on: Option<Date>,
    /// Validity ends on.
    pub validity_ends_on: Option<Date>,
    /// Validity is lifetime.
    pub validity_is_lifetime: String,
    /// Centre id.
    pub centre_id: Option<Uuid>,
    /// Centre stamp image data url.
    pub centre_stamp_image_data_url: String,
    /// Centre stamp applied.
    pub centre_stamp_applied: String,
    /// Adverse event.
    pub adverse_event: String,
    /// Adverse event notes.
    pub adverse_event_notes: String,
    /// Entry valid.
    pub entry_valid: String,
    /// Entry notes.
    pub entry_notes: String,
}
/// International certificate of vaccination or prophylaxis entries.
pub type InternationalCertificateOfVaccinationOrProphylaxisEntries = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM \
            international_certificate_of_vaccination_or_prophylaxis_entries WHERE \
            deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM \
            international_certificate_of_vaccination_or_prophylaxis_entries WHERE \
            deleted_at IS NULL",
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
            "SELECT * FROM \
            international_certificate_of_vaccination_or_prophylaxis_entries WHERE id = \
            $1 AND deleted_at IS NULL",
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
            "UPDATE international_certificate_of_vaccination_or_prophylaxis_entries SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
