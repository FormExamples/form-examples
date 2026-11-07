//! Patients module.

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
    /// United kingdom NHS number.
    pub united_kingdom_nhs_number: Option<String>,
    /// Hospital mrn.
    pub hospital_mrn: Option<String>,
    /// Height as cm.
    pub height_as_cm: Option<f64>,
    /// Weight as kg.
    pub weight_as_kg: Option<f64>,
    /// Body mass index.
    pub body_mass_index: Option<f64>,
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
            medical_operation_notes SET deleted_at = now(), updated_at = now() WHERE \
            patient_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), \
            child2 AS (UPDATE medical_operation_note_team_members SET deleted_at = \
            now(), updated_at = now() WHERE medical_operation_note_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            medical_operation_note_procedures SET deleted_at = now(), updated_at = now() \
            WHERE medical_operation_note_id IN (SELECT id FROM child1) AND deleted_at IS \
            NULL RETURNING id), child4 AS (UPDATE medical_operation_note_steps SET \
            deleted_at = now(), updated_at = now() WHERE medical_operation_note_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child5 AS \
            (UPDATE medical_operation_note_implants SET deleted_at = now(), updated_at = \
            now() WHERE medical_operation_note_id IN (SELECT id FROM child1) AND \
            deleted_at IS NULL RETURNING id), child6 AS (UPDATE \
            medical_operation_note_drains SET deleted_at = now(), updated_at = now() \
            WHERE medical_operation_note_id IN (SELECT id FROM child1) AND deleted_at IS \
            NULL RETURNING id), child7 AS (UPDATE medical_operation_note_specimens SET \
            deleted_at = now(), updated_at = now() WHERE medical_operation_note_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child8 AS \
            (UPDATE medical_operation_note_complications SET deleted_at = now(), \
            updated_at = now() WHERE medical_operation_note_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child9 AS (UPDATE \
            medical_operation_note_grades SET deleted_at = now(), updated_at = now() \
            WHERE medical_operation_note_id IN (SELECT id FROM child1) AND deleted_at IS \
            NULL RETURNING id), child10 AS (UPDATE medical_operation_note_grade_rules \
            SET deleted_at = now(), updated_at = now() WHERE \
            medical_operation_note_grade_id IN (SELECT id FROM child9) AND deleted_at IS \
            NULL RETURNING id), child11 AS (UPDATE medical_operation_note_grade_flags \
            SET deleted_at = now(), updated_at = now() WHERE \
            medical_operation_note_grade_id IN (SELECT id FROM child9) AND deleted_at IS \
            NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
