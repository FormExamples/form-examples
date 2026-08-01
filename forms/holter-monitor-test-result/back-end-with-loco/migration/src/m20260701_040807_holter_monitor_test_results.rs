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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("monitor_type", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("recording_duration_hours", ColType::DoubleNull),
            ("analysed_percent", ColType::DoubleNull),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("predominant_rhythm", ColType::StringWithDefault(String::new())),
            ("mean_heart_rate_bpm", ColType::IntegerNull),
            ("minimum_heart_rate_bpm", ColType::IntegerNull),
            ("maximum_heart_rate_bpm", ColType::IntegerNull),
            ("longest_pause_seconds", ColType::DoubleNull),
            ("ventricular_ectopic_percent", ColType::DoubleNull),
            ("supraventricular_ectopic_percent", ColType::DoubleNull),
            ("atrial_fibrillation_detected", ColType::BooleanWithDefault(false)),
            ("significant_pauses", ColType::BooleanWithDefault(false)),
            ("ventricular_tachycardia", ColType::BooleanWithDefault(false)),
            ("supraventricular_tachycardia", ColType::BooleanWithDefault(false)),
            ("high_grade_av_block", ColType::BooleanWithDefault(false)),
            ("symptom_rhythm_correlation", ColType::BooleanWithDefault(false)),
            ("normal_study", ColType::BooleanWithDefault(false)),
            ("findings_narrative", ColType::StringWithDefault(String::new())),
            ("comparison_with_previous", ColType::StringWithDefault(String::new())),
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
        drop_table(m, "holter_monitor_test_results").await
    }
}
