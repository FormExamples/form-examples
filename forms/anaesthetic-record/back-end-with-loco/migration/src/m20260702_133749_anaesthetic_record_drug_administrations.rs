use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "anaesthetic_record_drug_administrations",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("drug_name", ColType::String),
            ("dose", ColType::DoubleNull),
            ("dose_unit", ColType::String),
            ("route", ColType::String),
            ("category", ColType::String),
            ("administered_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[
            ("anaesthetic_record", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "anaesthetic_record_drug_administrations").await
    }
}
