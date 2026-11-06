//! heart_failure_reviews model.

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
    pub review_date: Option<Date>,
    pub care_setting: String,
    pub review_type: String,
    pub last_review_date: Option<Date>,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub year_of_diagnosis: Option<i32>,
    pub heart_failure_type: String,
    pub latest_lvef: Option<f64>,
    pub last_echo_date: Option<Date>,
    pub aetiology: String,
    pub nyha_class: Option<i32>,
    pub breathlessness: String,
    pub orthopnoea: String,
    pub paroxysmal_nocturnal_dyspnoea: String,
    pub fatigue: String,
    pub change_since_last_review: String,
    pub decompensation: String,
    pub weight_kg: Option<f64>,
    pub weight_change_kg: Option<f64>,
    pub peripheral_oedema: String,
    pub raised_jvp: String,
    pub lung_crackles: String,
    pub systolic_blood_pressure: Option<i32>,
    pub diastolic_blood_pressure: Option<i32>,
    pub heart_rate: Option<i32>,
    pub heart_rhythm: String,
    pub nt_pro_bnp: Option<f64>,
    pub sodium: Option<f64>,
    pub potassium: Option<f64>,
    pub urea: Option<f64>,
    pub creatinine: Option<f64>,
    pub egfr: Option<f64>,
    pub haemoglobin: Option<f64>,
    pub ferritin: Option<f64>,
    pub transferrin_saturation: Option<f64>,
    pub hba1c: Option<f64>,
    pub bloods_date: Option<Date>,
    pub raas_inhibitor_status: String,
    pub raas_inhibitor_agent: String,
    pub raas_inhibitor_dose: String,
    pub raas_inhibitor_at_target_dose: String,
    pub raas_inhibitor_adherence: String,
    pub beta_blocker_status: String,
    pub beta_blocker_agent: String,
    pub beta_blocker_dose: String,
    pub beta_blocker_at_target_dose: String,
    pub beta_blocker_adherence: String,
    pub mra_status: String,
    pub mra_agent: String,
    pub mra_dose: String,
    pub mra_at_target_dose: String,
    pub mra_adherence: String,
    pub sglt2_inhibitor_status: String,
    pub sglt2_inhibitor_agent: String,
    pub sglt2_inhibitor_dose: String,
    pub sglt2_inhibitor_at_target_dose: String,
    pub sglt2_inhibitor_adherence: String,
    pub loop_diuretic_agent: String,
    pub loop_diuretic_dose: String,
    pub other_medications: String,
    pub icd: String,
    pub crt: String,
    pub pacemaker: String,
    pub device_check_status: String,
    pub influenza_vaccination: String,
    pub pneumococcal_vaccination: String,
    pub covid_vaccination: String,
    pub smoking_status: String,
    pub alcohol_status: String,
    pub daily_weights: String,
    pub self_management_plan: String,
    pub cardiac_rehab: String,
    pub review_context: String,
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
            sqlx::query_as("SELECT * FROM heart_failure_reviews ORDER BY id LIMIT $1 OFFSET $2")
                .bind(limit)
                .bind(offset)
                .fetch_all(db)
                .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM heart_failure_reviews")
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
        sqlx::query_as("SELECT * FROM heart_failure_reviews WHERE id = $1")
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
        sqlx::query("DELETE FROM heart_failure_reviews WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
