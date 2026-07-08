use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "administration_records",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("vaccine_name", ColType::String),
            ("batch_number", ColType::String),
            ("expiry_date", ColType::DateNull),
            ("administration_site", ColType::String),
            ("administration_route", ColType::String),
            ("dose_number", ColType::String),
            ("administered_by", ColType::String),
            ("administration_date", ColType::DateNull),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "administration_records").await
    }
}
