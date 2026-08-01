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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("study_type", ColType::StringWithDefault(String::new())),
            ("study_adequacy", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("comparison_with_previous", ColType::StringWithDefault(String::new())),
            ("total_recording_time_hours", ColType::DoubleNull),
            ("total_sleep_time_hours", ColType::DoubleNull),
            ("apnoea_hypopnoea_index", ColType::DoubleNull),
            ("oxygen_desaturation_index", ColType::DoubleNull),
            ("minimum_spo2_percent", ColType::DoubleNull),
            ("time_below_90_percent_spo2", ColType::DoubleNull),
            ("mean_heart_rate_bpm", ColType::IntegerNull),
            ("osa_severity", ColType::StringWithDefault(String::new())),
            ("obstructive_sleep_apnoea", ColType::BooleanWithDefault(false)),
            ("central_sleep_apnoea", ColType::BooleanWithDefault(false)),
            ("periodic_limb_movements", ColType::BooleanWithDefault(false)),
            ("nocturnal_hypoventilation", ColType::BooleanWithDefault(false)),
            ("significant_desaturation", ColType::BooleanWithDefault(false)),
            ("normal_study", ColType::BooleanWithDefault(false)),
            ("findings_narrative", ColType::StringWithDefault(String::new())),
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
        drop_table(m, "sleep_study_test_results").await
    }
}
