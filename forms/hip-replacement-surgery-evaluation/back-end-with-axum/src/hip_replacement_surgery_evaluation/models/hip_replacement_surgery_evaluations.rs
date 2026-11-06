//! hip_replacement_surgery_evaluations model.

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
    pub status: String,
    pub assessment_date: Option<Date>,
    pub assessment_time: Option<String>,
    pub site_name: String,
    pub affected_side: String,
    pub symptom_duration_months: Option<i32>,
    pub pain_at_rest_0_10: Option<i32>,
    pub pain_on_activity_0_10: Option<i32>,
    pub night_pain: String,
    pub prior_hip_surgery: String,
    pub prior_hip_surgery_detail: String,
    pub prior_injury_or_dysplasia_history: String,
    pub prior_injury_or_dysplasia_detail: String,
    pub ohs_pain_severity: Option<i32>,
    pub ohs_washing_and_drying: Option<i32>,
    pub ohs_transport: Option<i32>,
    pub ohs_dressing_socks: Option<i32>,
    pub ohs_shopping: Option<i32>,
    pub ohs_walking_pain: Option<i32>,
    pub ohs_limping: Option<i32>,
    pub ohs_kneeling: Option<i32>,
    pub ohs_night_pain: Option<i32>,
    pub ohs_work_interference: Option<i32>,
    pub ohs_giving_way: Option<i32>,
    pub ohs_stairs: Option<i32>,
    pub walking_distance_before_pain: String,
    pub shoes_and_socks_difficulty: String,
    pub walking_aid_use: String,
    pub limp_present: String,
    pub antalgic_gait: String,
    pub trendelenburg_sign: String,
    pub leg_length_discrepancy_as_cm: Option<f64>,
    pub flexion_degrees: Option<i32>,
    pub internal_rotation_degrees: Option<i32>,
    pub external_rotation_degrees: Option<i32>,
    pub abduction_degrees: Option<i32>,
    pub adduction_degrees: Option<i32>,
    pub fixed_flexion_deformity_present: String,
    pub hip_abductor_strength_mrc: Option<i32>,
    pub joint_stability: String,
    pub tenderness_site: String,
    pub weight_bearing_xray_performed: String,
    pub kellgren_lawrence_grade: Option<i32>,
    pub joint_space_narrowing: String,
    pub subchondral_sclerosis_or_cysts_present: String,
    pub mri_performed: String,
    pub mri_findings: String,
    pub ct_performed: String,
    pub ct_indication: String,
    pub physiotherapy_tried: String,
    pub physiotherapy_duration_weeks: Option<i32>,
    pub weight_management_advice_given: String,
    pub steroid_injection_given: String,
    pub steroid_injection_count: Option<i32>,
    pub steroid_injection_response: String,
    pub analgesic_trial_given: String,
    pub analgesic_trial_response: String,
    pub walking_aid_trial: String,
    pub conservative_measures_exhausted: String,
    pub diabetes_controlled: String,
    pub cardiac_disease_present: String,
    pub bleeding_disorder_or_anticoagulant_use: String,
    pub smoking_status: String,
    pub general_fitness_note: String,
    pub full_blood_count_done: String,
    pub renal_function_done: String,
    pub clotting_or_inr_done: String,
    pub ecg_done: String,
    pub mrsa_screen_done: String,
    pub urinalysis_done: String,
    pub risks_and_benefits_discussed: String,
    pub realistic_expectations_discussed: String,
    pub patient_decision_aid_given: String,
    pub interpreter_required: String,
    pub interpreter_language: String,
    pub recommendation: String,
    pub target_list_date: Option<Date>,
    pub responsible_surgeon: String,
    pub additional_notes: String,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
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
            "SELECT * FROM hip_replacement_surgery_evaluations ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM hip_replacement_surgery_evaluations")
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
        sqlx::query_as("SELECT * FROM hip_replacement_surgery_evaluations WHERE id = $1")
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
        sqlx::query("DELETE FROM hip_replacement_surgery_evaluations WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
