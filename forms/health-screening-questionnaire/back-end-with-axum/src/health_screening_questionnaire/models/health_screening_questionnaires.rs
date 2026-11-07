//! health_screening_questionnaires model.

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
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub status: String,
    pub screening_purpose: String,
    pub site_name: String,
    pub assessment_date: Option<Date>,
    pub assessment_mode: String,
    pub usual_activity_level: String,
    pub moderate_exercise_days_per_week: Option<i32>,
    pub fruit_and_vegetable_portions_per_day: Option<i32>,
    pub diet_notes: String,
    pub smoking_status: String,
    pub cigarettes_per_day: Option<i32>,
    pub audit_c_frequency: Option<i32>,
    pub audit_c_typical_quantity: Option<i32>,
    pub audit_c_binge_frequency: Option<i32>,
    pub condition_diabetes: String,
    pub condition_hypertension: String,
    pub condition_asthma: String,
    pub condition_copd: String,
    pub condition_heart_disease: String,
    pub condition_kidney_disease: String,
    pub condition_thyroid: String,
    pub condition_other: String,
    pub past_surgeries: String,
    pub current_medications: String,
    pub known_drug_allergies: String,
    pub family_history_premature_cardiac_event: String,
    pub family_history_other: String,
    pub symptom_unexplained_chest_pain: String,
    pub symptom_dizzy_spells_or_fainting: String,
    pub symptom_persistent_cough_over_3_weeks: String,
    pub symptom_unexplained_weight_loss: String,
    pub symptom_joint_pain_restricting_movement: String,
    pub symptom_shortness_of_breath_on_exertion: String,
    pub symptom_palpitations: String,
    pub parq_diagnosed_heart_condition: String,
    pub parq_chest_pain_at_rest: String,
    pub parq_chest_pain_during_activity: String,
    pub parq_dizziness_or_loss_of_consciousness: String,
    pub parq_other_chronic_medical_condition: String,
    pub parq_prescribed_medication_for_chronic_condition: String,
    pub parq_bone_or_joint_problem: String,
    pub height_as_cm: Option<f64>,
    pub weight_as_kg: Option<f64>,
    pub body_mass_index: Option<f64>,
    pub resting_blood_pressure_systolic: Option<i32>,
    pub resting_blood_pressure_diastolic: Option<i32>,
    pub resting_heart_rate: Option<i32>,
    pub job_role: String,
    pub physical_demands_of_role: String,
    pub exposure_noise: String,
    pub exposure_chemicals: String,
    pub exposure_manual_handling: String,
    pub exposure_other: String,
    pub exposure_other_detail: String,
    pub stress_level: Option<i32>,
    pub sleep_quality: Option<i32>,
    pub mental_health_concern: String,
    pub mental_health_concern_note: String,
    pub vaccination_up_to_date: String,
    pub vaccination_gaps_note: String,
    pub consent_to_screening: String,
    pub information_accurate_confirmed: String,
    pub interpreter_required: String,
    pub patient_id: Uuid,
    pub assessor_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM health_screening_questionnaires WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM health_screening_questionnaires WHERE deleted_at IS \
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
            "SELECT * FROM health_screening_questionnaires WHERE id = $1 AND deleted_at \
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
            "WITH target AS (UPDATE health_screening_questionnaires SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE health_screening_questionnaire_grades SET deleted_at \
            = now(), updated_at = now() WHERE health_screening_questionnaire_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE health_screening_questionnaire_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE health_screening_questionnaire_grade_id IN (SELECT \
            id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM \
            target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
