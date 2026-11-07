//! Application eligible conditions module.

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
    /// Application id.
    pub application_id: Uuid,
    /// Eligible condition id.
    pub eligible_condition_id: Uuid,
    /// Diagnosis date.
    pub diagnosis_date: Option<Date>,
    /// Snomed ct code.
    pub snomed_ct_code: String,
    /// Icd10 code.
    pub icd10_code: String,
    /// Treatment detail.
    pub treatment_detail: String,
    /// Fistula site.
    pub fistula_site: String,
    /// Appliance type.
    pub appliance_type: String,
    /// Substitution therapy.
    pub substitution_therapy: String,
    /// On substitution therapy.
    pub on_substitution_therapy: String,
    /// Diabetes treatment mode.
    pub diabetes_treatment_mode: String,
    /// Anticonvulsant.
    pub anticonvulsant: String,
    /// Continuous anticonvulsant therapy.
    pub continuous_anticonvulsant_therapy: String,
    /// Cannot leave home unaided.
    pub cannot_leave_home_unaided: String,
    /// Disability carer detail.
    pub disability_carer_detail: String,
    /// Disability expected to be permanent.
    pub disability_expected_to_be_permanent: String,
    /// Cancer site.
    pub cancer_site: String,
    /// Cancer treatment phase.
    pub cancer_treatment_phase: String,
    /// Histology confirmed.
    pub histology_confirmed: String,
    /// Practitioner attestation notes.
    pub practitioner_attestation_notes: String,
}
/// Application eligible conditions.
pub type ApplicationEligibleConditions = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM application_eligible_conditions WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM application_eligible_conditions WHERE deleted_at IS \
            NULL",
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
            "SELECT * FROM application_eligible_conditions WHERE id = $1 AND deleted_at \
            IS NULL",
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
            "UPDATE application_eligible_conditions SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
