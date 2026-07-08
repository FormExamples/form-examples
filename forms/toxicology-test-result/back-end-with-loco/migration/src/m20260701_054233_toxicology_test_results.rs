use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "toxicology_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("specimen_condition", ColType::String),
            ("clinical_history", ColType::String),
            ("suspected_agent", ColType::String),
            ("time_since_ingestion_hours", ColType::DoubleNull),
            ("paracetamol_level_mg_l", ColType::DoubleNull),
            ("salicylate_level_mg_l", ColType::DoubleNull),
            ("ethanol_level", ColType::DoubleNull),
            ("lithium_level_mmol_l", ColType::DoubleNull),
            ("digoxin_level", ColType::DoubleNull),
            ("carboxyhaemoglobin_percent", ColType::DoubleNull),
            ("drugs_of_abuse_screen", ColType::String),
            ("specific_drug_level", ColType::String),
            ("paracetamol_nomogram", ColType::String),
            ("overall_result_status", ColType::String),
            ("toxic_level_present", ColType::Boolean),
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
        drop_table(m, "toxicology_test_results").await
    }
}
