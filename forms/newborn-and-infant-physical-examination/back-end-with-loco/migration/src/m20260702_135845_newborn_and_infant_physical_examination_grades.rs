use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "newborn_and_infant_physical_examination_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),

            ("eyes_result", ColType::String),
            ("heart_result", ColType::String),
            ("hips_result", ColType::String),
            ("testes_result", ColType::String),
            ("overall_outcome", ColType::String),
            ("completeness", ColType::String),
            ("completeness_percent", ColType::IntegerNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("newborn_and_infant_physical_examination", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "newborn_and_infant_physical_examination_grades").await
    }
}
