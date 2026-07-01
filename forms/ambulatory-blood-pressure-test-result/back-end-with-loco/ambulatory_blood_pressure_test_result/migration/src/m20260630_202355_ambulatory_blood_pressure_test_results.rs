use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "ambulatory_blood_pressure_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("monitoring_type", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("valid_readings_percent", ColType::DoubleNull),
            ("recording_adequate", ColType::Boolean),
            ("clinical_history", ColType::String),
            ("daytime_average_systolic", ColType::DoubleNull),
            ("daytime_average_diastolic", ColType::DoubleNull),
            ("nighttime_average_systolic", ColType::DoubleNull),
            ("nighttime_average_diastolic", ColType::DoubleNull),
            ("twenty_four_hour_average_systolic", ColType::DoubleNull),
            ("twenty_four_hour_average_diastolic", ColType::DoubleNull),
            ("nocturnal_dip_percent", ColType::DoubleNull),
            ("dipper_status", ColType::String),
            ("hypertension_confirmed", ColType::Boolean),
            ("white_coat_effect", ColType::Boolean),
            ("masked_hypertension", ColType::Boolean),
            ("severe_hypertension", ColType::Boolean),
            ("nocturnal_hypertension", ColType::Boolean),
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
        drop_table(m, "ambulatory_blood_pressure_test_results").await
    }
}
