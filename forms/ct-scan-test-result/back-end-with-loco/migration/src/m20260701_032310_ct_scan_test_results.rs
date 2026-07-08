use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "ct_scan_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("body_region", ColType::String),
            ("contrast_used", ColType::String),
            ("technique", ColType::String),
            ("examination_adequacy", ColType::String),
            ("clinical_history", ColType::String),
            ("comparison_with_previous", ColType::String),
            ("findings_narrative", ColType::String),
            ("acute_finding", ColType::Boolean),
            ("mass_or_lesion", ColType::Boolean),
            ("haemorrhage", ColType::Boolean),
            ("infarct", ColType::Boolean),
            ("fracture", ColType::Boolean),
            ("infection_inflammation", ColType::Boolean),
            ("obstruction", ColType::Boolean),
            ("incidental_finding", ColType::Boolean),
            ("largest_lesion_size_mm", ColType::DoubleNull),
            ("radiation_dose_dlp", ColType::DoubleNull),
            ("impression", ColType::String),
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
        drop_table(m, "ct_scan_test_results").await
    }
}
