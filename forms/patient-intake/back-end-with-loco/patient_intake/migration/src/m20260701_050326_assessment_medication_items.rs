use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "assessment_medication_items",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("medication_name", ColType::String),
            ("dose", ColType::String),
            ("frequency", ColType::String),
            ("route", ColType::String),
            ("prescriber", ColType::String),
            ("reason", ColType::String),
            ("start_date", ColType::DateNull),
            ("sort_order", ColType::Integer),
            ],
            &[
            ("medications", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_medication_items").await
    }
}
