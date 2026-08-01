use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "blood_test_result_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("result_classification", ColType::StringWithDefault(String::new())),
            ("abnormality_severity", ColType::StringWithDefault(String::new())),
            ("reporting_category", ColType::StringWithDefault(String::new())),
            ("report_completeness_percent", ColType::IntegerNull),
            ("follow_up_urgency", ColType::StringWithDefault(String::new())),
            ("target_timeframe", ColType::StringWithDefault(String::new())),
            ("recommended_action", ColType::StringWithDefault(String::new())),
            ("recommendation", ColType::StringWithDefault(String::new())),
            ("clinician_notes", ColType::TextWithDefault(String::new())),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("blood_test_result", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "blood_test_result_grades").await
    }
}
