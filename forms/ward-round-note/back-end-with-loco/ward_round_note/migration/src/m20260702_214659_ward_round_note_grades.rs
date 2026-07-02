use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "ward_round_note_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("completeness_percent", ColType::IntegerNull),
            ("header_documented", ColType::String),
            ("problems_documented", ColType::String),
            ("examination_documented", ColType::String),
            ("investigations_documented", ColType::String),
            ("vte_documented", ColType::String),
            ("medication_documented", ColType::String),
            ("plan_documented", ColType::String),
            ("escalation_documented", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("ward_round_note", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "ward_round_note_grades").await
    }
}
