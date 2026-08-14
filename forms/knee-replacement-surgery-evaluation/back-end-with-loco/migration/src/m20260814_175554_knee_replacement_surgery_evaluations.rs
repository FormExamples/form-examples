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
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("assessment_date", ColType::DateNull),
            ("assessment_time", ColType::StringNull),
            ("knee_side", ColType::StringWithDefault(String::new())),
            ("symptom_duration_months", ColType::IntegerNull),
            ("pain_at_rest_0_to_10", ColType::IntegerNull),
            ("pain_on_activity_0_to_10", ColType::IntegerNull),
            ("night_pain", ColType::StringWithDefault(String::new())),
            ("prior_knee_surgery", ColType::StringWithDefault(String::new())),
            ("prior_knee_surgery_type", ColType::StringWithDefault(String::new())),
            ("prior_knee_surgery_date", ColType::DateNull),
            ("prior_injury", ColType::StringWithDefault(String::new())),
            ("prior_injury_detail", ColType::TextWithDefault(String::new())),
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
            ("walking_distance_before_pain", ColType::StringWithDefault(String::new())),
            ("stair_climbing_ability", ColType::StringWithDefault(String::new())),
            ("stand_from_chair_unaided", ColType::StringWithDefault(String::new())),
            ("walking_aid", ColType::StringWithDefault(String::new())),
            ("flexion_degrees", ColType::IntegerNull),
            ("extension_deficit_degrees", ColType::IntegerNull),
            ("fixed_flexion_deformity_present", ColType::StringWithDefault(String::new())),
            ("fixed_flexion_deformity_degrees", ColType::IntegerNull),
            ("coronal_deformity_type", ColType::StringWithDefault(String::new())),
            ("coronal_deformity_severity", ColType::StringWithDefault(String::new())),
            ("ligament_acl", ColType::StringWithDefault(String::new())),
            ("ligament_pcl", ColType::StringWithDefault(String::new())),
            ("ligament_mcl", ColType::StringWithDefault(String::new())),
            ("ligament_lcl", ColType::StringWithDefault(String::new())),
            ("patellar_tracking", ColType::StringWithDefault(String::new())),
            ("quadriceps_strength_mrc", ColType::IntegerNull),
            ("effusion_present", ColType::StringWithDefault(String::new())),
            ("crepitus_present", ColType::StringWithDefault(String::new())),
            ("weight_bearing_xray_performed", ColType::StringWithDefault(String::new())),
            ("kellgren_lawrence_grade_medial", ColType::IntegerNull),
            ("kellgren_lawrence_grade_lateral", ColType::IntegerNull),
            ("kellgren_lawrence_grade_patellofemoral", ColType::IntegerNull),
            ("mri_performed", ColType::StringWithDefault(String::new())),
            ("mri_findings", ColType::TextWithDefault(String::new())),
            ("ct_performed", ColType::StringWithDefault(String::new())),
            ("ct_indication", ColType::StringWithDefault(String::new())),
            ("physiotherapy_tried", ColType::StringWithDefault(String::new())),
            ("physiotherapy_duration_weeks", ColType::IntegerNull),
            ("weight_management_advice_given", ColType::StringWithDefault(String::new())),
            ("injection_given", ColType::StringWithDefault(String::new())),
            ("injection_type", ColType::StringWithDefault(String::new())),
            ("injection_count", ColType::IntegerNull),
            ("injection_response", ColType::StringWithDefault(String::new())),
            ("nsaid_analgesic_trial", ColType::StringWithDefault(String::new())),
            ("nsaid_analgesic_response", ColType::StringWithDefault(String::new())),
            ("walking_aid_trial", ColType::StringWithDefault(String::new())),
            ("conservative_measures_exhausted", ColType::StringWithDefault(String::new())),
            ("diabetes_controlled", ColType::StringWithDefault(String::new())),
            ("cardiac_disease", ColType::StringWithDefault(String::new())),
            ("bleeding_disorder_or_anticoagulant", ColType::StringWithDefault(String::new())),
            ("smoking_status", ColType::StringWithDefault(String::new())),
            ("general_fitness_note", ColType::TextWithDefault(String::new())),
            ("fbc_done", ColType::StringWithDefault(String::new())),
            ("renal_function_done", ColType::StringWithDefault(String::new())),
            ("clotting_done", ColType::StringWithDefault(String::new())),
            ("ecg_done", ColType::StringWithDefault(String::new())),
            ("mrsa_screen_done", ColType::StringWithDefault(String::new())),
            ("urinalysis_done", ColType::StringWithDefault(String::new())),
            ("risks_benefits_discussed", ColType::StringWithDefault(String::new())),
            ("realistic_expectations_discussed", ColType::StringWithDefault(String::new())),
            ("patient_decision_aid_given", ColType::StringWithDefault(String::new())),
            ("interpreter_required", ColType::StringWithDefault(String::new())),
            ("plan_recommendation", ColType::StringWithDefault(String::new())),
            ("target_list_date", ColType::DateNull),
            ("responsible_surgeon", ColType::StringWithDefault(String::new())),
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
