use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "emergency_department_triage_note_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("news2_total", ColType::IntegerNull),
            ("news2_any_parameter_three", ColType::StringWithDefault(String::new())),
            ("priority_level", ColType::IntegerNull),
            ("priority_colour", ColType::StringWithDefault(String::new())),
            ("priority_name", ColType::StringWithDefault(String::new())),
            ("target_minutes", ColType::IntegerNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("emergency_department_triage_note", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "emergency_department_triage_note_grades").await
    }
}
