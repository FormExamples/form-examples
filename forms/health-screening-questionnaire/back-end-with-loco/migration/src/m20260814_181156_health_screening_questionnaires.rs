use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "health_screening_questionnaires",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("screening_purpose", ColType::StringWithDefault(String::new())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("assessment_date", ColType::DateNull),
            ("assessment_mode", ColType::StringWithDefault(String::new())),
            ("usual_activity_level", ColType::StringWithDefault(String::new())),
            ("moderate_exercise_days_per_week", ColType::IntegerNull),
            ("fruit_and_vegetable_portions_per_day", ColType::IntegerNull),
            ("diet_notes", ColType::TextWithDefault(String::new())),
            ("smoking_status", ColType::StringWithDefault(String::new())),
            ("cigarettes_per_day", ColType::IntegerNull),
            ("audit_c_frequency", ColType::IntegerNull),
            ("audit_c_typical_quantity", ColType::IntegerNull),
            ("audit_c_binge_frequency", ColType::IntegerNull),
            ("condition_diabetes", ColType::StringWithDefault(String::new())),
            ("condition_hypertension", ColType::StringWithDefault(String::new())),
            ("condition_asthma", ColType::StringWithDefault(String::new())),
            ("condition_copd", ColType::StringWithDefault(String::new())),
            ("condition_heart_disease", ColType::StringWithDefault(String::new())),
            ("condition_kidney_disease", ColType::StringWithDefault(String::new())),
            ("condition_thyroid", ColType::StringWithDefault(String::new())),
            ("condition_other", ColType::StringWithDefault(String::new())),
            ("past_surgeries", ColType::TextWithDefault(String::new())),
            ("current_medications", ColType::TextWithDefault(String::new())),
            ("known_drug_allergies", ColType::TextWithDefault(String::new())),
            ("family_history_premature_cardiac_event", ColType::StringWithDefault(String::new())),
            ("family_history_other", ColType::TextWithDefault(String::new())),
            ("symptom_unexplained_chest_pain", ColType::StringWithDefault(String::new())),
            ("symptom_dizzy_spells_or_fainting", ColType::StringWithDefault(String::new())),
            ("symptom_persistent_cough_over_3_weeks", ColType::StringWithDefault(String::new())),
            ("symptom_unexplained_weight_loss", ColType::StringWithDefault(String::new())),
            ("symptom_joint_pain_restricting_movement", ColType::StringWithDefault(String::new())),
            ("symptom_shortness_of_breath_on_exertion", ColType::StringWithDefault(String::new())),
            ("symptom_palpitations", ColType::StringWithDefault(String::new())),
            ("parq_diagnosed_heart_condition", ColType::StringWithDefault(String::new())),
            ("parq_chest_pain_at_rest", ColType::StringWithDefault(String::new())),
            ("parq_chest_pain_during_activity", ColType::StringWithDefault(String::new())),
            ("parq_dizziness_or_loss_of_consciousness", ColType::StringWithDefault(String::new())),
            ("parq_other_chronic_medical_condition", ColType::StringWithDefault(String::new())),
            ("parq_prescribed_medication_for_chronic_condition", ColType::StringWithDefault(String::new())),
            ("parq_bone_or_joint_problem", ColType::StringWithDefault(String::new())),
            ("height_as_cm", ColType::DoubleNull),
            ("weight_as_kg", ColType::DoubleNull),
            ("body_mass_index", ColType::DoubleNull),
            ("resting_blood_pressure_systolic", ColType::IntegerNull),
            ("resting_blood_pressure_diastolic", ColType::IntegerNull),
            ("resting_heart_rate", ColType::IntegerNull),
            ("job_role", ColType::StringWithDefault(String::new())),
            ("physical_demands_of_role", ColType::StringWithDefault(String::new())),
            ("exposure_noise", ColType::StringWithDefault(String::new())),
            ("exposure_chemicals", ColType::StringWithDefault(String::new())),
            ("exposure_manual_handling", ColType::StringWithDefault(String::new())),
            ("exposure_other", ColType::StringWithDefault(String::new())),
            ("exposure_other_detail", ColType::StringWithDefault(String::new())),
            ("stress_level", ColType::IntegerNull),
            ("sleep_quality", ColType::IntegerNull),
            ("mental_health_concern", ColType::StringWithDefault(String::new())),
            ("mental_health_concern_note", ColType::TextWithDefault(String::new())),
            ("vaccination_up_to_date", ColType::StringWithDefault(String::new())),
            ("vaccination_gaps_note", ColType::TextWithDefault(String::new())),
            ("consent_to_screening", ColType::StringWithDefault(String::new())),
            ("information_accurate_confirmed", ColType::StringWithDefault(String::new())),
            ("interpreter_required", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("assessor", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "health_screening_questionnaires").await
    }
}
