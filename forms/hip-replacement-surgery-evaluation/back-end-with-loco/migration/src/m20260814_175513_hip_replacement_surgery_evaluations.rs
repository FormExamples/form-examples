use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "hip_replacement_surgery_evaluations",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("assessment_date", ColType::DateNull),
            ("assessment_time", ColType::StringNull),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("affected_side", ColType::StringWithDefault(String::new())),
            ("symptom_duration_months", ColType::IntegerNull),
            ("pain_at_rest_0_10", ColType::IntegerNull),
            ("pain_on_activity_0_10", ColType::IntegerNull),
            ("night_pain", ColType::StringWithDefault(String::new())),
            ("prior_hip_surgery", ColType::StringWithDefault(String::new())),
            ("prior_hip_surgery_detail", ColType::TextWithDefault(String::new())),
            ("prior_injury_or_dysplasia_history", ColType::StringWithDefault(String::new())),
            ("prior_injury_or_dysplasia_detail", ColType::TextWithDefault(String::new())),
            ("ohs_pain_severity", ColType::IntegerNull),
            ("ohs_washing_and_drying", ColType::IntegerNull),
            ("ohs_transport", ColType::IntegerNull),
            ("ohs_dressing_socks", ColType::IntegerNull),
            ("ohs_shopping", ColType::IntegerNull),
            ("ohs_walking_pain", ColType::IntegerNull),
            ("ohs_limping", ColType::IntegerNull),
            ("ohs_kneeling", ColType::IntegerNull),
            ("ohs_night_pain", ColType::IntegerNull),
            ("ohs_work_interference", ColType::IntegerNull),
            ("ohs_giving_way", ColType::IntegerNull),
            ("ohs_stairs", ColType::IntegerNull),
            ("walking_distance_before_pain", ColType::StringWithDefault(String::new())),
            ("shoes_and_socks_difficulty", ColType::StringWithDefault(String::new())),
            ("walking_aid_use", ColType::StringWithDefault(String::new())),
            ("limp_present", ColType::StringWithDefault(String::new())),
            ("antalgic_gait", ColType::StringWithDefault(String::new())),
            ("trendelenburg_sign", ColType::StringWithDefault(String::new())),
            ("leg_length_discrepancy_as_cm", ColType::DoubleNull),
            ("flexion_degrees", ColType::IntegerNull),
            ("internal_rotation_degrees", ColType::IntegerNull),
            ("external_rotation_degrees", ColType::IntegerNull),
            ("abduction_degrees", ColType::IntegerNull),
            ("adduction_degrees", ColType::IntegerNull),
            ("fixed_flexion_deformity_present", ColType::StringWithDefault(String::new())),
            ("hip_abductor_strength_mrc", ColType::IntegerNull),
            ("joint_stability", ColType::StringWithDefault(String::new())),
            ("tenderness_site", ColType::StringWithDefault(String::new())),
            ("weight_bearing_xray_performed", ColType::StringWithDefault(String::new())),
            ("kellgren_lawrence_grade", ColType::IntegerNull),
            ("joint_space_narrowing", ColType::StringWithDefault(String::new())),
            ("subchondral_sclerosis_or_cysts_present", ColType::StringWithDefault(String::new())),
            ("mri_performed", ColType::StringWithDefault(String::new())),
            ("mri_findings", ColType::TextWithDefault(String::new())),
            ("ct_performed", ColType::StringWithDefault(String::new())),
            ("ct_indication", ColType::StringWithDefault(String::new())),
            ("physiotherapy_tried", ColType::StringWithDefault(String::new())),
            ("physiotherapy_duration_weeks", ColType::IntegerNull),
            ("weight_management_advice_given", ColType::StringWithDefault(String::new())),
            ("steroid_injection_given", ColType::StringWithDefault(String::new())),
            ("steroid_injection_count", ColType::IntegerNull),
            ("steroid_injection_response", ColType::StringWithDefault(String::new())),
            ("analgesic_trial_given", ColType::StringWithDefault(String::new())),
            ("analgesic_trial_response", ColType::StringWithDefault(String::new())),
            ("walking_aid_trial", ColType::StringWithDefault(String::new())),
            ("conservative_measures_exhausted", ColType::StringWithDefault(String::new())),
            ("diabetes_controlled", ColType::StringWithDefault(String::new())),
            ("cardiac_disease_present", ColType::StringWithDefault(String::new())),
            ("bleeding_disorder_or_anticoagulant_use", ColType::StringWithDefault(String::new())),
            ("smoking_status", ColType::StringWithDefault(String::new())),
            ("general_fitness_note", ColType::TextWithDefault(String::new())),
            ("full_blood_count_done", ColType::StringWithDefault(String::new())),
            ("renal_function_done", ColType::StringWithDefault(String::new())),
            ("clotting_or_inr_done", ColType::StringWithDefault(String::new())),
            ("ecg_done", ColType::StringWithDefault(String::new())),
            ("mrsa_screen_done", ColType::StringWithDefault(String::new())),
            ("urinalysis_done", ColType::StringWithDefault(String::new())),
            ("risks_and_benefits_discussed", ColType::StringWithDefault(String::new())),
            ("realistic_expectations_discussed", ColType::StringWithDefault(String::new())),
            ("patient_decision_aid_given", ColType::StringWithDefault(String::new())),
            ("interpreter_required", ColType::StringWithDefault(String::new())),
            ("interpreter_language", ColType::StringWithDefault(String::new())),
            ("recommendation", ColType::StringWithDefault(String::new())),
            ("target_list_date", ColType::DateNull),
            ("responsible_surgeon", ColType::StringWithDefault(String::new())),
            ("additional_notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "hip_replacement_surgery_evaluations").await
    }
}
