use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "tumor_marker_test_result_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("result_classification", ColType::String),
            ("abnormality_severity", ColType::String),
            ("reporting_category", ColType::String),
            ("report_completeness_percent", ColType::IntegerNull),
            ("follow_up_urgency", ColType::String),
            ("target_timeframe", ColType::String),
            ("recommended_action", ColType::String),
            ("recommendation", ColType::String),
            ("clinician_notes", ColType::Text),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("tumor_marker_test_result", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "tumor_marker_test_result_grades").await
    }
}
