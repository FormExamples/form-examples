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

            ("eyes_result", ColType::StringWithDefault(String::new())),
            ("heart_result", ColType::StringWithDefault(String::new())),
            ("hips_result", ColType::StringWithDefault(String::new())),
            ("testes_result", ColType::StringWithDefault(String::new())),
            ("overall_outcome", ColType::StringWithDefault(String::new())),
            ("completeness", ColType::StringWithDefault(String::new())),
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
