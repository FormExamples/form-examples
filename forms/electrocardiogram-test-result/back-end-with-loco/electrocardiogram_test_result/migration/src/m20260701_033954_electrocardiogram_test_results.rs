use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "electrocardiogram_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("ecg_type", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("recording_quality", ColType::String),
            ("clinical_history", ColType::String),
            ("ventricular_rate_bpm", ColType::IntegerNull),
            ("rhythm", ColType::String),
            ("pr_interval_ms", ColType::IntegerNull),
            ("qrs_duration_ms", ColType::IntegerNull),
            ("qt_interval_ms", ColType::IntegerNull),
            ("qtc_ms", ColType::IntegerNull),
            ("cardiac_axis", ColType::String),
            ("st_elevation", ColType::Boolean),
            ("st_depression", ColType::Boolean),
            ("t_wave_inversion", ColType::Boolean),
            ("pathological_q_waves", ColType::Boolean),
            ("left_ventricular_hypertrophy", ColType::Boolean),
            ("bundle_branch_block", ColType::Boolean),
            ("ischaemia", ColType::Boolean),
            ("normal_ecg", ColType::Boolean),
            ("interpretation", ColType::String),
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
        drop_table(m, "electrocardiogram_test_results").await
    }
}
