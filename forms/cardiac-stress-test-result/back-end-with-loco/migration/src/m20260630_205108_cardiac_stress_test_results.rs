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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("test_type", ColType::StringWithDefault(String::new())),
            ("protocol", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("comparison_with_previous", ColType::StringWithDefault(String::new())),
            ("maximum_heart_rate_bpm", ColType::IntegerNull),
            ("percent_predicted_heart_rate", ColType::DoubleNull),
            ("exercise_duration_minutes", ColType::DoubleNull),
            ("mets_achieved", ColType::DoubleNull),
            ("peak_blood_pressure", ColType::StringWithDefault(String::new())),
            ("blood_pressure_response", ColType::StringWithDefault(String::new())),
            ("ischaemic_st_changes", ColType::BooleanWithDefault(false)),
            ("chest_pain_induced", ColType::BooleanWithDefault(false)),
            ("arrhythmia_induced", ColType::BooleanWithDefault(false)),
            ("terminated_early", ColType::BooleanWithDefault(false)),
            ("test_positive", ColType::BooleanWithDefault(false)),
            ("test_negative", ColType::BooleanWithDefault(false)),
            ("test_inconclusive", ColType::BooleanWithDefault(false)),
            ("reason_for_termination", ColType::StringWithDefault(String::new())),
            ("duke_treadmill_score", ColType::DoubleNull),
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
        drop_table(m, "cardiac_stress_test_results").await
    }
}
