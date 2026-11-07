//! Inpatient clinical note medication changes module.

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
    /// Sort order.
    pub sort_order: i32,
    /// Drug name.
    pub drug_name: String,
    /// Action.
    pub action: String,
    /// Dose.
    pub dose: String,
    /// Route.
    pub route: String,
    /// Frequency.
    pub frequency: String,
    /// Indication.
    pub indication: String,
    /// Is antimicrobial.
    pub is_antimicrobial: String,
    /// Review date.
    pub review_date: Option<Date>,
    /// Stop date.
    pub stop_date: Option<Date>,
    /// Dmd code.
    pub dmd_code: String,
    /// Notes.
    pub notes: String,
    /// Inpatient clinical note ID.
    pub inpatient_clinical_note_id: Uuid,
}
/// Inpatient clinical note medication changes.
pub type InpatientClinicalNoteMedicationChanges = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM inpatient_clinical_note_medication_changes WHERE deleted_at IS \
            NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM inpatient_clinical_note_medication_changes WHERE \
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
            "SELECT * FROM inpatient_clinical_note_medication_changes WHERE id = $1 AND \
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
            "UPDATE inpatient_clinical_note_medication_changes SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
