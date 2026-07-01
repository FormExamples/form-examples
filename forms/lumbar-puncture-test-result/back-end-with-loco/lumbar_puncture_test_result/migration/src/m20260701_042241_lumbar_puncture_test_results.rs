use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "lumbar_puncture_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("clinical_history", ColType::String),
            ("opening_pressure_cmh2o", ColType::DoubleNull),
            ("csf_appearance", ColType::String),
            ("csf_white_cell_count", ColType::DoubleNull),
            ("csf_red_cell_count", ColType::DoubleNull),
            ("csf_protein_g_l", ColType::DoubleNull),
            ("csf_glucose_mmol_l", ColType::DoubleNull),
            ("csf_serum_glucose_ratio", ColType::DoubleNull),
            ("csf_lactate_mmol_l", ColType::DoubleNull),
            ("gram_stain_result", ColType::String),
            ("culture_result", ColType::String),
            ("pcr_result", ColType::String),
            ("oligoclonal_bands", ColType::String),
            ("xanthochromia", ColType::String),
            ("raised_protein", ColType::Boolean),
            ("pleocytosis", ColType::Boolean),
            ("low_glucose", ColType::Boolean),
            ("bacterial_meningitis_pattern", ColType::Boolean),
            ("viral_pattern", ColType::Boolean),
            ("subarachnoid_haemorrhage_suggested", ColType::Boolean),
            ("normal_csf", ColType::Boolean),
            ("findings_narrative", ColType::String),
            ("impression", ColType::String),
            ("reporting_category", ColType::String),
            ("recommended_follow_up", ColType::String),
            ("critical_result_communicated", ColType::Boolean),
            ("reported_to", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "lumbar_puncture_test_results").await
    }
}
