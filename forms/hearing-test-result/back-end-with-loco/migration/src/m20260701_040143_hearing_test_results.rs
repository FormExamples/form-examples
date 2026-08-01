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
            ("originating_request_reference", ColType::StringWithDefault(String::new())),
            ("report_status", ColType::StringWithDefault(String::new())),
            ("performed_date", ColType::DateNull),
            ("reported_date", ColType::DateNull),
            ("test_type", ColType::StringWithDefault(String::new())),
            ("test_reliability", ColType::StringWithDefault(String::new())),
            ("clinical_history", ColType::StringWithDefault(String::new())),
            ("pure_tone_average_right_db", ColType::DoubleNull),
            ("pure_tone_average_left_db", ColType::DoubleNull),
            ("hearing_loss_type_right", ColType::StringWithDefault(String::new())),
            ("hearing_loss_type_left", ColType::StringWithDefault(String::new())),
            ("hearing_loss_severity_right", ColType::StringWithDefault(String::new())),
            ("hearing_loss_severity_left", ColType::StringWithDefault(String::new())),
            ("tympanometry_type_right", ColType::StringWithDefault(String::new())),
            ("tympanometry_type_left", ColType::StringWithDefault(String::new())),
            ("hearing_loss_present", ColType::BooleanWithDefault(false)),
            ("asymmetric_loss", ColType::BooleanWithDefault(false)),
            ("sudden_sensorineural_loss", ColType::BooleanWithDefault(false)),
            ("conductive_component", ColType::BooleanWithDefault(false)),
            ("normal_hearing", ColType::BooleanWithDefault(false)),
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
        drop_table(m, "hearing_test_results").await
    }
}
