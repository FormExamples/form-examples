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
            ("status", ColType::String),
            ("site_name", ColType::String),
            ("setting", ColType::String),
            ("referral_date", ColType::DateNull),
            ("requested_by_date", ColType::DateNull),
            ("procedure", ColType::String),
            ("primary_indication", ColType::String),
            ("clinical_question", ColType::String),
            ("relevant_history", ColType::String),
            ("red_flag_weight_loss", ColType::Boolean),
            ("red_flag_anaemia", ColType::Boolean),
            ("red_flag_abdominal_mass", ColType::Boolean),
            ("red_flag_rectal_bleeding", ColType::Boolean),
            ("fit_result_ug_g", ColType::DoubleNull),
            ("haemoglobin_g_l", ColType::DoubleNull),
            ("taking_anticoagulant", ColType::Boolean),
            ("anticoagulant_agent", ColType::String),
            ("taking_antiplatelet", ColType::Boolean),
            ("antiplatelet_agent", ColType::String),
            ("diabetes_medication", ColType::String),
            ("fit_for_bowel_prep", ColType::Boolean),
            ("bowel_prep_agent", ColType::String),
            ("chronic_kidney_disease", ColType::Boolean),
            ("egfr_ml_min", ColType::DoubleNull),
            ("asa_grade", ColType::String),
            ("urgency", ColType::String),
            ("supervising_consultant", ColType::String),
            ("requester_contact", ColType::String),
            ("notes", ColType::String),
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
