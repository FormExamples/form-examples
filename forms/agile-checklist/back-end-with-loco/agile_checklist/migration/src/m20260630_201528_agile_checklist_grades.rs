use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "agile_checklist_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("answered_count", ColType::Integer),
            ("teams_yes_count", ColType::Integer),
            ("teams_applicable_count", ColType::Integer),
            ("teams_percent", ColType::DoubleNull),
            ("stakeholders_yes_count", ColType::Integer),
            ("stakeholders_applicable_count", ColType::Integer),
            ("stakeholders_percent", ColType::DoubleNull),
            ("practices_yes_count", ColType::Integer),
            ("practices_applicable_count", ColType::Integer),
            ("practices_percent", ColType::DoubleNull),
            ("overall_percent", ColType::DoubleNull),
            ("teams_band", ColType::String),
            ("stakeholders_band", ColType::String),
            ("practices_band", ColType::String),
            ("maturity", ColType::String),
            ("top_action_1", ColType::String),
            ("top_action_2", ColType::String),
            ("top_action_3", ColType::String),
            ("coach_notes", ColType::Text),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("agile_checklist", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "agile_checklist_grades").await
    }
}
