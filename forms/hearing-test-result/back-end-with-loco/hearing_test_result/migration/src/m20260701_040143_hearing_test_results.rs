use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "hearing_test_results",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("originating_request_reference", ColType::String),
            ("report_status", ColType::String),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("test_type", ColType::String),
            ("test_reliability", ColType::String),
            ("clinical_history", ColType::String),
            ("pure_tone_average_right_db", ColType::DoubleNull),
            ("pure_tone_average_left_db", ColType::DoubleNull),
            ("hearing_loss_type_right", ColType::String),
            ("hearing_loss_type_left", ColType::String),
            ("hearing_loss_severity_right", ColType::String),
            ("hearing_loss_severity_left", ColType::String),
            ("tympanometry_type_right", ColType::String),
            ("tympanometry_type_left", ColType::String),
            ("hearing_loss_present", ColType::Boolean),
            ("asymmetric_loss", ColType::Boolean),
            ("sudden_sensorineural_loss", ColType::Boolean),
            ("conductive_component", ColType::Boolean),
            ("normal_hearing", ColType::Boolean),
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
        drop_table(m, "hearing_test_results").await
    }
}
