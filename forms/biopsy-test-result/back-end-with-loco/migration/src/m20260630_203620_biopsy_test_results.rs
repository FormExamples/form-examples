use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "biopsy_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("biopsy_site", ColType::String),
            ("biopsy_method", ColType::String),
            ("specimen_adequacy", ColType::String),
            ("clinical_history", ColType::String),
            ("comparison_with_previous", ColType::String),
            ("macroscopic_description", ColType::String),
            ("microscopic_description", ColType::String),
            ("diagnosis", ColType::String),
            ("malignancy_present", ColType::Boolean),
            ("tumour_type", ColType::String),
            ("histological_grade", ColType::String),
            ("resection_margins", ColType::String),
            ("lymphovascular_invasion", ColType::Boolean),
            ("immunohistochemistry", ColType::String),
            ("molecular_results", ColType::String),
            ("snomed_code", ColType::String),
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
        drop_table(m, "biopsy_test_results").await
    }
}
