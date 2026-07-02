use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "apgar_score_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("total_one_minute", ColType::IntegerNull),
            ("total_five_minute", ColType::IntegerNull),
            ("total_ten_minute", ColType::IntegerNull),
            ("band_one_minute", ColType::String),
            ("band_five_minute", ColType::String),
            ("band_ten_minute", ColType::String),
            ("summary_band", ColType::String),
            ("trend", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("apgar_score", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "apgar_score_grades").await
    }
}
