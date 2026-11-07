//! Patients module.

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
    /// Name.
    pub name: String,
    /// Birth date.
    pub birth_date: Date,
    /// Sex.
    pub sex: String,
    /// Email.
    pub email: Option<String>,
    /// Phone.
    pub phone: Option<String>,
    /// Postal address as full text.
    pub postal_address_as_full_text: Option<String>,
    /// Country as iso 3166 1 alpha 2.
    pub country_as_iso_3166_1_alpha_2: Option<String>,
    /// Postcode.
    pub postcode: Option<String>,
    /// United kingdom nhs number.
    pub united_kingdom_nhs_number: Option<String>,
    /// Hospital mrn.
    pub hospital_mrn: Option<String>,
    /// Height as cm.
    pub height_as_cm: Option<Decimal>,
    /// Weight as kg.
    pub weight_as_kg: Option<Decimal>,
    /// Body mass index.
    pub body_mass_index: Option<Decimal>,
    /// Allergies summary.
    pub allergies_summary: String,
}
/// Patients.
pub type Patients = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM patients WHERE deleted_at IS NULL ORDER BY id LIMIT $1 OFFSET \
            $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM patients WHERE deleted_at IS NULL")
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
            inpatient_clinical_notes SET deleted_at = now(), updated_at = now() WHERE \
            patient_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), \
            child2 AS (UPDATE inpatient_clinical_note_problems SET deleted_at = now(), \
            updated_at = now() WHERE inpatient_clinical_note_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            inpatient_clinical_note_medication_changes SET deleted_at = now(), \
            updated_at = now() WHERE inpatient_clinical_note_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child4 AS (UPDATE \
            inpatient_clinical_note_investigations SET deleted_at = now(), updated_at = \
            now() WHERE inpatient_clinical_note_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child5 AS (UPDATE \
            inpatient_clinical_note_jobs SET deleted_at = now(), updated_at = now() \
            WHERE inpatient_clinical_note_id IN (SELECT id FROM child1) AND deleted_at \
            IS NULL RETURNING id), child6 AS (UPDATE inpatient_clinical_note_grades SET \
            deleted_at = now(), updated_at = now() WHERE inpatient_clinical_note_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child7 AS \
            (UPDATE inpatient_clinical_note_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE inpatient_clinical_note_grade_id IN (SELECT id FROM \
            child6) AND deleted_at IS NULL RETURNING id), child8 AS (UPDATE \
            inpatient_clinical_note_grade_flags SET deleted_at = now(), updated_at = \
            now() WHERE inpatient_clinical_note_grade_id IN (SELECT id FROM child6) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
