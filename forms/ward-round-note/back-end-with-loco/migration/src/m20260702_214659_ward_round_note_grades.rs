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
            ("status", ColType::StringWithDefault(String::new())),
            ("completeness_percent", ColType::IntegerNull),
            ("header_documented", ColType::StringWithDefault(String::new())),
            ("problems_documented", ColType::StringWithDefault(String::new())),
            ("examination_documented", ColType::StringWithDefault(String::new())),
            ("investigations_documented", ColType::StringWithDefault(String::new())),
            ("vte_documented", ColType::StringWithDefault(String::new())),
            ("medication_documented", ColType::StringWithDefault(String::new())),
            ("plan_documented", ColType::StringWithDefault(String::new())),
            ("escalation_documented", ColType::StringWithDefault(String::new())),
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
