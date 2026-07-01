use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "microbiology_culture_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("specimen_type", ColType::String),
            ("specimen_site_detail", ColType::String),
            ("specimen_condition", ColType::String),
            ("clinical_history", ColType::String),
            ("gram_stain_result", ColType::String),
            ("culture_result", ColType::String),
            ("organism_isolated", ColType::String),
            ("second_organism_isolated", ColType::String),
            ("colony_count", ColType::String),
            ("antibiotic_sensitivities", ColType::String),
            ("resistance_mrsa", ColType::Boolean),
            ("resistance_esbl", ColType::Boolean),
            ("resistance_cpe", ColType::Boolean),
            ("c_difficile_toxin", ColType::String),
            ("acid_fast_bacilli", ColType::String),
            ("pcr_result", ColType::String),
            ("critical_organism", ColType::Boolean),
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
        drop_table(m, "microbiology_culture_test_results").await
    }
}
