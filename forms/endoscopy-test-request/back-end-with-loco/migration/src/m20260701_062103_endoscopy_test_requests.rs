use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "endoscopy_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("requested_procedure", ColType::StringWithDefault(String::new())),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_question", ColType::StringWithDefault(String::new())),
            ("relevant_history", ColType::StringWithDefault(String::new())),
            ("red_flag_dysphagia", ColType::BooleanWithDefault(false)),
            ("red_flag_weight_loss", ColType::BooleanWithDefault(false)),
            ("red_flag_anaemia", ColType::BooleanWithDefault(false)),
            ("red_flag_gi_bleeding", ColType::BooleanWithDefault(false)),
            ("red_flag_abdominal_mass", ColType::BooleanWithDefault(false)),
            ("red_flag_age_over_55", ColType::BooleanWithDefault(false)),
            ("fit_result_ug_g", ColType::DoubleNull),
            ("haemoglobin_g_l", ColType::DoubleNull),
            ("ferritin_ug_l", ColType::DoubleNull),
            ("taking_anticoagulant", ColType::BooleanWithDefault(false)),
            ("anticoagulant_agent", ColType::StringWithDefault(String::new())),
            ("taking_antiplatelet", ColType::BooleanWithDefault(false)),
            ("antiplatelet_agent", ColType::StringWithDefault(String::new())),
            ("diabetes_medication", ColType::StringWithDefault(String::new())),
            ("allergies", ColType::StringWithDefault(String::new())),
            ("latex_allergy", ColType::BooleanWithDefault(false)),
            ("cardiac_nyha_class", ColType::StringWithDefault(String::new())),
            ("pacemaker_icd", ColType::BooleanWithDefault(false)),
            ("chronic_kidney_disease", ColType::BooleanWithDefault(false)),
            ("egfr_ml_min", ColType::DoubleNull),
            ("sleep_apnoea", ColType::BooleanWithDefault(false)),
            ("neutropenia", ColType::BooleanWithDefault(false)),
            ("asa_grade", ColType::StringWithDefault(String::new())),
            ("vcjd_risk", ColType::BooleanWithDefault(false)),
            ("cpe_carriage", ColType::BooleanWithDefault(false)),
            ("mrsa", ColType::BooleanWithDefault(false)),
            ("blood_borne_virus", ColType::BooleanWithDefault(false)),
            ("fit_for_bowel_prep", ColType::BooleanWithDefault(false)),
            ("bowel_prep_agent", ColType::StringWithDefault(String::new())),
            ("sedation", ColType::StringWithDefault(String::new())),
            ("escort_available", ColType::BooleanWithDefault(false)),
            ("urgency", ColType::StringWithDefault("routine".to_string())),
            ("supervising_consultant", ColType::StringWithDefault(String::new())),
            ("requester_contact", ColType::StringWithDefault(String::new())),
            ("interpreter_required", ColType::BooleanWithDefault(false)),
            ("notes", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "endoscopy_test_requests").await
    }
}
