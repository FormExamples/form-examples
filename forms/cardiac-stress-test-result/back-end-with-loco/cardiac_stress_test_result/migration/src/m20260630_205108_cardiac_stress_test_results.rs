use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "cardiac_stress_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("test_type", ColType::String),
            ("protocol", ColType::String),
            ("clinical_history", ColType::String),
            ("comparison_with_previous", ColType::String),
            ("maximum_heart_rate_bpm", ColType::IntegerNull),
            ("percent_predicted_heart_rate", ColType::DoubleNull),
            ("exercise_duration_minutes", ColType::DoubleNull),
            ("mets_achieved", ColType::DoubleNull),
            ("peak_blood_pressure", ColType::String),
            ("blood_pressure_response", ColType::String),
            ("ischaemic_st_changes", ColType::Boolean),
            ("chest_pain_induced", ColType::Boolean),
            ("arrhythmia_induced", ColType::Boolean),
            ("terminated_early", ColType::Boolean),
            ("test_positive", ColType::Boolean),
            ("test_negative", ColType::Boolean),
            ("test_inconclusive", ColType::Boolean),
            ("reason_for_termination", ColType::String),
            ("duke_treadmill_score", ColType::DoubleNull),
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
        drop_table(m, "cardiac_stress_test_results").await
    }
}
