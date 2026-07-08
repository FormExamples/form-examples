use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "holter_monitor_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("monitor_type", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("recording_duration_hours", ColType::DoubleNull),
            ("analysed_percent", ColType::DoubleNull),
            ("clinical_history", ColType::String),
            ("predominant_rhythm", ColType::String),
            ("mean_heart_rate_bpm", ColType::IntegerNull),
            ("minimum_heart_rate_bpm", ColType::IntegerNull),
            ("maximum_heart_rate_bpm", ColType::IntegerNull),
            ("longest_pause_seconds", ColType::DoubleNull),
            ("ventricular_ectopic_percent", ColType::DoubleNull),
            ("supraventricular_ectopic_percent", ColType::DoubleNull),
            ("atrial_fibrillation_detected", ColType::Boolean),
            ("significant_pauses", ColType::Boolean),
            ("ventricular_tachycardia", ColType::Boolean),
            ("supraventricular_tachycardia", ColType::Boolean),
            ("high_grade_av_block", ColType::Boolean),
            ("symptom_rhythm_correlation", ColType::Boolean),
            ("normal_study", ColType::Boolean),
            ("findings_narrative", ColType::String),
            ("comparison_with_previous", ColType::String),
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
        drop_table(m, "holter_monitor_test_results").await
    }
}
