//! pre_operative_assessment_by_patients model.

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
    pub weight: Option<f64>,
    pub height: Option<f64>,
    pub bmi: Option<f64>,
    pub planned_procedure: String,
    pub procedure_urgency: String,
    pub status: String,
    pub hypertension: String,
    pub hypertension_controlled: String,
    pub ischemic_heart_disease: String,
    pub ihd_details: String,
    pub heart_failure: String,
    pub heart_failure_nyha: String,
    pub valvular_disease: String,
    pub valvular_details: String,
    pub arrhythmia: String,
    pub arrhythmia_type: String,
    pub pacemaker: String,
    pub recent_mi: String,
    pub recent_mi_weeks: Option<i32>,
    pub asthma: String,
    pub asthma_frequency: String,
    pub copd: String,
    pub copd_severity: String,
    pub osa: String,
    pub osa_cpap: String,
    pub smoking: String,
    pub smoking_pack_years: Option<i32>,
    pub recent_urti: String,
    pub ckd: String,
    pub ckd_stage: String,
    pub dialysis: String,
    pub dialysis_type: String,
    pub liver_disease: String,
    pub cirrhosis: String,
    pub child_pugh_score: String,
    pub hepatitis: String,
    pub hepatitis_type: String,
    pub diabetes: String,
    pub diabetes_control: String,
    pub diabetes_on_insulin: String,
    pub thyroid_disease: String,
    pub thyroid_type: String,
    pub adrenal_insufficiency: String,
    pub stroke_or_tia: String,
    pub stroke_details: String,
    pub epilepsy: String,
    pub epilepsy_controlled: String,
    pub neuromuscular_disease: String,
    pub neuromuscular_details: String,
    pub raised_icp: String,
    pub bleeding_disorder: String,
    pub bleeding_details: String,
    pub on_anticoagulants: String,
    pub anticoagulant_type: String,
    pub sickle_cell_disease: String,
    pub sickle_cell_trait: String,
    pub anaemia: String,
    pub rheumatoid_arthritis: String,
    pub cervical_spine_issues: String,
    pub limited_neck_movement: String,
    pub limited_mouth_opening: String,
    pub dental_issues: String,
    pub dental_details: String,
    pub previous_difficult_airway: String,
    pub mallampati_score: String,
    pub gord: String,
    pub hiatus_hernia: String,
    pub nausea: String,
    pub name: String,
    pub dose: String,
    pub frequency: String,
    pub sort_order: i32,
    pub allergen: String,
    pub reaction: String,
    pub severity: String,
    pub allergy_sort_order: i32,
    pub previous_anaesthesia: String,
    pub anaesthesia_problems: String,
    pub anaesthesia_problem_details: String,
    pub family_mh_history: String,
    pub family_mh_details: String,
    pub ponv: String,
    pub alcohol: String,
    pub alcohol_units_per_week: Option<i32>,
    pub recreational_drugs: String,
    pub drug_details: String,
    pub exercise_tolerance: String,
    pub estimated_mets: Option<f64>,
    pub mobility_aids: String,
    pub recent_decline: String,
    pub possibly_pregnant: String,
    pub pregnancy_confirmed: String,
    pub gestation_weeks: Option<i32>,
    pub cancer_history: String,
    pub cancer_history_details: String,
    pub mrsa_history: String,
    pub recent_hospital_or_care_home_admission: String,
    pub palpitations_or_blackouts: String,
    pub heart_or_artery_surgery: String,
    pub swollen_ankles: String,
    pub snoring: String,
    pub snoring_loud: String,
    pub collar_size_inches: Option<f64>,
    pub daytime_sleepiness: String,
    pub observed_apnoea_episodes: String,
    pub urinary_symptoms: String,
    pub urinary_catheter_history: String,
    pub prostate_problems: String,
    pub personal_vte_history: String,
    pub family_vte_history: String,
    pub blood_transfusion_history: String,
    pub joint_or_arthritis_problems: String,
    pub back_or_neck_problems: String,
    pub skin_conditions: String,
    pub pressure_sore_risk: String,
    pub bowel_problems: String,
    pub food_intolerances: String,
    pub food_intolerances_details: String,
    pub blood_donor: String,
    pub body_piercings: String,
    pub hearing_problems: String,
    pub vision_problems: String,
    pub balance_issues: String,
    pub contraceptive_or_hrt_use: String,
    pub last_menstrual_period: String,
    pub head_injury_requiring_hospitalisation: String,
    pub memory_concerns: String,
    pub dementia_diagnosis: String,
    pub depression_or_anxiety_history: String,
    pub depression_anxiety_impacts_daily_life: String,
    pub depression_anxiety_seen_doctor: String,
    pub learning_difficulties: String,
    pub patient_id: Uuid,
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
            "SELECT * FROM pre_operative_assessment_by_patients ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar("SELECT COUNT(*) FROM pre_operative_assessment_by_patients")
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
        sqlx::query_as("SELECT * FROM pre_operative_assessment_by_patients WHERE id = $1")
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
        sqlx::query("DELETE FROM pre_operative_assessment_by_patients WHERE id = $1")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
