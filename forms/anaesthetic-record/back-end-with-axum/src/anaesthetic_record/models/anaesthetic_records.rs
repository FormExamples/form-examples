//! anaesthetic_records model.

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
    pub theatre: String,
    pub operation_date: Option<Date>,
    pub anaesthetist_name: String,
    pub assistant_name: String,
    pub surgeon_name: String,
    pub planned_procedure: String,
    pub urgency: String,
    pub machine_checked: String,
    pub who_sign_in: String,
    pub who_time_out: String,
    pub consent_confirmed: String,
    pub fasting_confirmed: String,
    pub iv_access: String,
    pub allergy_band_checked: String,
    pub documented_allergies: String,
    pub asa_status: String,
    pub asa_emergency_modifier: String,
    pub mallampati_class: Option<i32>,
    pub mouth_opening_cm: Option<f64>,
    pub thyromental_distance_cm: Option<f64>,
    pub dentition: String,
    pub anticipated_difficult_airway: String,
    pub prior_difficult_intubation: String,
    pub airway_technique: String,
    pub device_size: String,
    pub tube_depth_cm: Option<f64>,
    pub cuffed: String,
    pub cormack_lehane_grade: Option<i32>,
    pub intubation_attempts: Option<i32>,
    pub capnography_confirmed: String,
    pub monitoring_modalities: String,
    pub anaesthetic_technique: String,
    pub crystalloid_ml: Option<f64>,
    pub colloid_ml: Option<f64>,
    pub blood_products_ml: Option<f64>,
    pub estimated_blood_loss_ml: Option<f64>,
    pub urine_output_ml: Option<f64>,
    pub cell_salvage_ml: Option<f64>,
    pub regional_technique: String,
    pub regional_level: String,
    pub regional_drug: String,
    pub regional_dose_mg: Option<f64>,
    pub block_height: String,
    pub regional_complications: String,
    pub recovery_destination: String,
    pub handover_airway_status: String,
    pub analgesia_plan: String,
    pub antiemetic_plan: String,
    pub oxygen_plan: String,
    pub outstanding_tasks: String,
    pub handover_at: Option<DateTimeWithTimeZone>,
    pub receiving_practitioner: String,
    pub anaesthetist_signature: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
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
        let rows =
            sqlx::query_as("SELECT * FROM anaesthetic_records ORDER BY id LIMIT $1 OFFSET $2")
                .bind(limit)
                .bind(offset)
                .fetch_all(db)
                .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM anaesthetic_records")
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
        sqlx::query_as("SELECT * FROM anaesthetic_records WHERE id = $1")
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
        sqlx::query("DELETE FROM anaesthetic_records WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
