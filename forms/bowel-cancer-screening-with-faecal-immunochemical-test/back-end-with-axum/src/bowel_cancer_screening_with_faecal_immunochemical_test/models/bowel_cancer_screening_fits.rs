//! bowel_cancer_screening_fits model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub id: Uuid,
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub reviewed_at: Option<DateTimeWithTimeZone>,
    pub screening_hub: String,
    pub participant_identifier: String,
    pub age: Option<i32>,
    pub within_age_range: String,
    pub recall_interval: String,
    pub invitation_date: Option<Date>,
    pub previous_outcome: String,
    pub last_screen_date: Option<Date>,
    pub kit_returned: String,
    pub return_date: Option<Date>,
    pub sample_adequacy: String,
    pub spoilt_reason: String,
    pub faecal_haemoglobin_ug_g: Option<f64>,
    pub assay: String,
    pub threshold_applied: Option<f64>,
    pub red_flag_symptoms: String,
    pub clinical_note: String,
    pub context: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM bowel_cancer_screening_fits ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM bowel_cancer_screening_fits")
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
        sqlx::query_as("SELECT * FROM bowel_cancer_screening_fits WHERE id = $1")
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
        sqlx::query("DELETE FROM bowel_cancer_screening_fits WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
