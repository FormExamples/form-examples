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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("ecg_type", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("recording_quality", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("ventricular_rate_bpm", ColType::IntegerNull),
            ("rhythm", ColType::StringWithDefault(String::new())),
            ("pr_interval_ms", ColType::IntegerNull),
            ("qrs_duration_ms", ColType::IntegerNull),
            ("qt_interval_ms", ColType::IntegerNull),
            ("qtc_ms", ColType::IntegerNull),
            ("cardiac_axis", ColType::StringWithDefault(String::new())),
            ("st_elevation", ColType::BooleanWithDefault(false)),
            ("st_depression", ColType::BooleanWithDefault(false)),
            ("t_wave_inversion", ColType::BooleanWithDefault(false)),
            ("pathological_q_waves", ColType::BooleanWithDefault(false)),
            ("left_ventricular_hypertrophy", ColType::BooleanWithDefault(false)),
            ("bundle_branch_block", ColType::BooleanWithDefault(false)),
            ("ischaemia", ColType::BooleanWithDefault(false)),
            ("normal_ecg", ColType::BooleanWithDefault(false)),
            ("interpretation", ColType::StringWithDefault(String::new())),
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
        drop_table(m, "electrocardiogram_test_results").await
    }
}
