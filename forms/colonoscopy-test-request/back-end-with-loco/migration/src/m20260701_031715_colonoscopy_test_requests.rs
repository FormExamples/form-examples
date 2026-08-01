use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "colonoscopy_test_requests",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("site_name", ColType::StringWithDefault(String::new())),
            ("setting", ColType::StringWithDefault(String::new())),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("procedure", ColType::StringWithDefault(String::new())),
            ("primary_indication", ColType::StringWithDefault(String::new())),
            ("clinical_question", ColType::StringWithDefault(String::new())),
            ("relevant_history", ColType::StringWithDefault(String::new())),
            ("red_flag_weight_loss", ColType::BooleanWithDefault(false)),
            ("red_flag_anaemia", ColType::BooleanWithDefault(false)),
            ("red_flag_abdominal_mass", ColType::BooleanWithDefault(false)),
            ("red_flag_rectal_bleeding", ColType::BooleanWithDefault(false)),
            ("fit_result_ug_g", ColType::DoubleNull),
            ("haemoglobin_g_l", ColType::DoubleNull),
            ("taking_anticoagulant", ColType::BooleanWithDefault(false)),
            ("anticoagulant_agent", ColType::StringWithDefault(String::new())),
            ("taking_antiplatelet", ColType::BooleanWithDefault(false)),
            ("antiplatelet_agent", ColType::StringWithDefault(String::new())),
            ("diabetes_medication", ColType::StringWithDefault(String::new())),
            ("fit_for_bowel_prep", ColType::BooleanWithDefault(false)),
            ("bowel_prep_agent", ColType::StringWithDefault(String::new())),
            ("chronic_kidney_disease", ColType::BooleanWithDefault(false)),
            ("egfr_ml_min", ColType::DoubleNull),
            ("asa_grade", ColType::StringWithDefault(String::new())),
            ("urgency", ColType::StringWithDefault("routine".to_string())),
            ("supervising_consultant", ColType::StringWithDefault(String::new())),
            ("requester_contact", ColType::StringWithDefault(String::new())),
            ("notes", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "colonoscopy_test_requests").await
    }
}
