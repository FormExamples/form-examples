//! chronic_kidney_disease_reviews model.

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
    pub clinician_name: String,
    pub clinician_role: String,
    pub reviewed_at: Option<Date>,
    pub care_setting: String,
    pub review_type: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub diabetes_status: String,
    pub primary_cause: String,
    pub months_since_diagnosis: Option<i32>,
    pub egfr: Option<f64>,
    pub egfr_sample_date: Option<Date>,
    pub previous_egfr: Option<f64>,
    pub previous_egfr_date: Option<Date>,
    pub acr: Option<f64>,
    pub acr_sample_date: Option<Date>,
    pub acr_measured: String,
    pub systolic_blood_pressure: Option<i32>,
    pub diastolic_blood_pressure: Option<i32>,
    pub acei_or_arb_prescribed: String,
    pub sglt2i_prescribed: String,
    pub statin_prescribed: String,
    pub nephrotoxic_drug_present: String,
    pub nephrotoxic_dose_adjusted: String,
    pub medication_review_completed: String,
    pub hba1c: Option<f64>,
    pub potassium: Option<f64>,
    pub bicarbonate: Option<f64>,
    pub calcium: Option<f64>,
    pub phosphate: Option<f64>,
    pub pth: Option<f64>,
    pub haemoglobin: Option<f64>,
    pub referral_decision: String,
    pub clinical_note: String,
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
            "SELECT * FROM chronic_kidney_disease_reviews ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM chronic_kidney_disease_reviews")
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
        sqlx::query_as("SELECT * FROM chronic_kidney_disease_reviews WHERE id = $1")
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
        sqlx::query("DELETE FROM chronic_kidney_disease_reviews WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
