use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "electroencephalogram_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("eeg_type", ColType::String),
            ("recording_duration_minutes", ColType::DoubleNull),
            ("recording_quality", ColType::String),
            ("clinical_history", ColType::String),
            ("comparison_with_previous", ColType::String),
            ("background_rhythm", ColType::String),
            ("epileptiform_discharges", ColType::Boolean),
            ("focal_slowing", ColType::Boolean),
            ("generalised_slowing", ColType::Boolean),
            ("seizure_recorded", ColType::Boolean),
            ("status_epilepticus", ColType::Boolean),
            ("photoparoxysmal_response", ColType::Boolean),
            ("normal_eeg", ColType::Boolean),
            ("findings_narrative", ColType::String),
            ("clinical_correlation", ColType::String),
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
        drop_table(m, "electroencephalogram_test_results").await
    }
}
