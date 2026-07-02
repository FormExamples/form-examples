use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "soap_note_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("status", ColType::String),
            ("completeness_percent", ColType::IntegerNull),
            ("subjective_present", ColType::String),
            ("objective_present", ColType::String),
            ("assessment_present", ColType::String),
            ("plan_present", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("soap_note", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "soap_note_grades").await
    }
}
