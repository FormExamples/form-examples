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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("specimen_condition", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("suspected_agent", ColType::StringWithDefault(String::new())),
            ("time_since_ingestion_hours", ColType::DoubleNull),
            ("paracetamol_level_mg_l", ColType::DoubleNull),
            ("salicylate_level_mg_l", ColType::DoubleNull),
            ("ethanol_level", ColType::DoubleNull),
            ("lithium_level_mmol_l", ColType::DoubleNull),
            ("digoxin_level", ColType::DoubleNull),
            ("carboxyhaemoglobin_percent", ColType::DoubleNull),
            ("drugs_of_abuse_screen", ColType::StringWithDefault(String::new())),
            ("specific_drug_level", ColType::StringWithDefault(String::new())),
            ("paracetamol_nomogram", ColType::StringWithDefault(String::new())),
            ("overall_result_status", ColType::StringWithDefault(String::new())),
            ("toxic_level_present", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "toxicology_test_results").await
    }
}
