use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "sleep_study_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("study_type", ColType::String),
            ("study_adequacy", ColType::String),
            ("clinical_history", ColType::String),
            ("comparison_with_previous", ColType::String),
            ("total_recording_time_hours", ColType::DoubleNull),
            ("total_sleep_time_hours", ColType::DoubleNull),
            ("apnoea_hypopnoea_index", ColType::DoubleNull),
            ("oxygen_desaturation_index", ColType::DoubleNull),
            ("minimum_spo2_percent", ColType::DoubleNull),
            ("time_below_90_percent_spo2", ColType::DoubleNull),
            ("mean_heart_rate_bpm", ColType::IntegerNull),
            ("osa_severity", ColType::String),
            ("obstructive_sleep_apnoea", ColType::Boolean),
            ("central_sleep_apnoea", ColType::Boolean),
            ("periodic_limb_movements", ColType::Boolean),
            ("nocturnal_hypoventilation", ColType::Boolean),
            ("significant_desaturation", ColType::Boolean),
            ("normal_study", ColType::Boolean),
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
        drop_table(m, "sleep_study_test_results").await
    }
}
