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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("opening_pressure_cmh2o", ColType::DoubleNull),
            ("csf_appearance", ColType::StringWithDefault(String::new())),
            ("csf_white_cell_count", ColType::DoubleNull),
            ("csf_red_cell_count", ColType::DoubleNull),
            ("csf_protein_g_l", ColType::DoubleNull),
            ("csf_glucose_mmol_l", ColType::DoubleNull),
            ("csf_serum_glucose_ratio", ColType::DoubleNull),
            ("csf_lactate_mmol_l", ColType::DoubleNull),
            ("gram_stain_result", ColType::StringWithDefault(String::new())),
            ("culture_result", ColType::StringWithDefault(String::new())),
            ("pcr_result", ColType::StringWithDefault(String::new())),
            ("oligoclonal_bands", ColType::StringWithDefault(String::new())),
            ("xanthochromia", ColType::StringWithDefault(String::new())),
            ("raised_protein", ColType::BooleanWithDefault(false)),
            ("pleocytosis", ColType::BooleanWithDefault(false)),
            ("low_glucose", ColType::BooleanWithDefault(false)),
            ("bacterial_meningitis_pattern", ColType::BooleanWithDefault(false)),
            ("viral_pattern", ColType::BooleanWithDefault(false)),
            ("subarachnoid_haemorrhage_suggested", ColType::BooleanWithDefault(false)),
            ("normal_csf", ColType::BooleanWithDefault(false)),
            ("findings_narrative", ColType::StringWithDefault(String::new())),
            ("impression", ColType::StringWithDefault(String::new())),
            ("reporting_category", ColType::StringWithDefault(String::new())),
            ("recommended_follow_up", ColType::StringWithDefault(String::new())),
            ("critical_result_communicated", ColType::BooleanWithDefault(false)),
            ("reported_to", ColType::StringWithDefault(String::new())),
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
