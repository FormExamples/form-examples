use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "biopsy_test_request_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("appropriateness_score", ColType::IntegerNull),
            ("appropriateness_band", ColType::String),
            ("bleeding_risk_band", ColType::String),
            ("anticoagulant_action", ColType::String),
            ("completeness_percent", ColType::IntegerNull),
            ("triage_tier", ColType::String),
            ("target_timeframe", ColType::String),
            ("two_week_wait_eligible", ColType::Boolean),
            ("recommendation", ColType::String),
            ("clinician_notes", ColType::Text),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("biopsy_test_request", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "biopsy_test_request_grades").await
    }
}
