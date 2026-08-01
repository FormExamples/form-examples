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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("eeg_type", ColType::StringWithDefault(String::new())),
            ("recording_duration_minutes", ColType::DoubleNull),
            ("recording_quality", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("comparison_with_previous", ColType::StringWithDefault(String::new())),
            ("background_rhythm", ColType::StringWithDefault(String::new())),
            ("epileptiform_discharges", ColType::BooleanWithDefault(false)),
            ("focal_slowing", ColType::BooleanWithDefault(false)),
            ("generalised_slowing", ColType::BooleanWithDefault(false)),
            ("seizure_recorded", ColType::BooleanWithDefault(false)),
            ("status_epilepticus", ColType::BooleanWithDefault(false)),
            ("photoparoxysmal_response", ColType::BooleanWithDefault(false)),
            ("normal_eeg", ColType::BooleanWithDefault(false)),
            ("findings_narrative", ColType::StringWithDefault(String::new())),
            ("clinical_correlation", ColType::StringWithDefault(String::new())),
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
        drop_table(m, "electroencephalogram_test_results").await
    }
}
