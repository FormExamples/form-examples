use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "anion_gap_calculator_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("anion_gap", ColType::DoubleNull),
            ("corrected_anion_gap", ColType::DoubleNull),
            ("classification", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("anion_gap_calculator", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "anion_gap_calculator_grades").await
    }
}
