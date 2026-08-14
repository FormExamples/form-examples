use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "knee_replacement_surgery_evaluations",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("assessment_date", ColType::DateNull),
            ("assessment_time", ColType::StringNull),
            ("knee_side", ColType::String),
            ("symptom_duration_months", ColType::IntegerNull),
            ("pain_at_rest_0_to_10", ColType::IntegerNull),
            ("pain_on_activity_0_to_10", ColType::IntegerNull),
            ("night_pain", ColType::String),
            ("prior_knee_surgery", ColType::String),
            ("prior_knee_surgery_type", ColType::String),
            ("prior_knee_surgery_date", ColType::DateNull),
            ("prior_injury", ColType::String),
            ("prior_injury_detail", ColType::Text),
            ("oks_pain_severity", ColType::IntegerNull),
            ("oks_washing_and_drying", ColType::IntegerNull),
            ("oks_transport", ColType::IntegerNull),
            ("oks_walking_distance", ColType::IntegerNull),
            ("oks_pain_sitting_or_lying", ColType::IntegerNull),
            ("oks_limping", ColType::IntegerNull),
            ("oks_kneeling", ColType::IntegerNull),
            ("oks_night_pain_frequency", ColType::IntegerNull),
            ("oks_pain_interfering_with_work", ColType::IntegerNull),
            ("oks_giving_way", ColType::IntegerNull),
            ("oks_shopping", ColType::IntegerNull),
            ("oks_stairs", ColType::IntegerNull),
            ("walking_distance_before_pain", ColType::String),
            ("stair_climbing_ability", ColType::String),
            ("stand_from_chair_unaided", ColType::String),
            ("walking_aid", ColType::String),
            ("flexion_degrees", ColType::IntegerNull),
            ("extension_deficit_degrees", ColType::IntegerNull),
            ("fixed_flexion_deformity_present", ColType::String),
            ("fixed_flexion_deformity_degrees", ColType::IntegerNull),
            ("coronal_deformity_type", ColType::String),
            ("coronal_deformity_severity", ColType::String),
            ("ligament_acl", ColType::String),
            ("ligament_pcl", ColType::String),
            ("ligament_mcl", ColType::String),
            ("ligament_lcl", ColType::String),
            ("patellar_tracking", ColType::String),
            ("quadriceps_strength_mrc", ColType::IntegerNull),
            ("effusion_present", ColType::String),
            ("crepitus_present", ColType::String),
            ("weight_bearing_xray_performed", ColType::String),
            ("kellgren_lawrence_grade_medial", ColType::IntegerNull),
            ("kellgren_lawrence_grade_lateral", ColType::IntegerNull),
            ("kellgren_lawrence_grade_patellofemoral", ColType::IntegerNull),
            ("mri_performed", ColType::String),
            ("mri_findings", ColType::Text),
            ("ct_performed", ColType::String),
            ("ct_indication", ColType::String),
            ("physiotherapy_tried", ColType::String),
            ("physiotherapy_duration_weeks", ColType::IntegerNull),
            ("weight_management_advice_given", ColType::String),
            ("injection_given", ColType::String),
            ("injection_type", ColType::String),
            ("injection_count", ColType::IntegerNull),
            ("injection_response", ColType::String),
            ("nsaid_analgesic_trial", ColType::String),
            ("nsaid_analgesic_response", ColType::String),
            ("walking_aid_trial", ColType::String),
            ("conservative_measures_exhausted", ColType::String),
            ("diabetes_controlled", ColType::String),
            ("cardiac_disease", ColType::String),
            ("bleeding_disorder_or_anticoagulant", ColType::String),
            ("smoking_status", ColType::String),
            ("general_fitness_note", ColType::Text),
            ("fbc_done", ColType::String),
            ("renal_function_done", ColType::String),
            ("clotting_done", ColType::String),
            ("ecg_done", ColType::String),
            ("mrsa_screen_done", ColType::String),
            ("urinalysis_done", ColType::String),
            ("risks_benefits_discussed", ColType::String),
            ("realistic_expectations_discussed", ColType::String),
            ("patient_decision_aid_given", ColType::String),
            ("interpreter_required", ColType::String),
            ("plan_recommendation", ColType::String),
            ("target_list_date", ColType::DateNull),
            ("responsible_surgeon", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "knee_replacement_surgery_evaluations").await
    }
}
