use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "issue_tracker_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("score_by_priority_rank", ColType::IntegerNull),
            ("score_by_severity_of_impact", ColType::IntegerNull),
            ("score_by_magnitude_of_damage", ColType::IntegerNull),
            ("score_by_harm_grade", ColType::IntegerNull),
            ("score_by_failure_condition", ColType::String),
            ("score_by_moscow_requirement", ColType::IntegerNull),
            ("score_by_frequency_percent", ColType::DoubleNull),
            ("computed_composite_priority", ColType::String),
            ("final_composite_priority", ColType::String),
            ("override_reason", ColType::String),
            ("recommendation", ColType::String),
            ("triage_notes", ColType::Text),
            ("signed_by", ColType::String),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("issue_tracker", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "issue_tracker_grades").await
    }
}
