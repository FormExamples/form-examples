use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "genetic_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("test_type", ColType::String),
            ("genes_tested", ColType::Text),
            ("sample_type", ColType::String),
            ("clinical_history", ColType::String),
            ("inheritance_pattern", ColType::String),
            ("variants_detected", ColType::String),
            ("variant_classification", ColType::String),
            ("zygosity", ColType::String),
            ("pathogenic_variant_found", ColType::Boolean),
            ("vus_found", ColType::Boolean),
            ("carrier_status_positive", ColType::Boolean),
            ("secondary_finding", ColType::Boolean),
            ("no_clinically_significant_variant", ColType::Boolean),
            ("interpretation", ColType::String),
            ("impression", ColType::String),
            ("reporting_category", ColType::String),
            ("recommended_cascade_testing", ColType::Boolean),
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
        drop_table(m, "genetic_test_results").await
    }
}
