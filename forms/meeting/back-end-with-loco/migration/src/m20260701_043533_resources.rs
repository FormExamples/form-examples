use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "resources",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("position", ColType::Integer),
            ("resource_type", ColType::String),
            ("name", ColType::String),
            ("quantity", ColType::IntegerNull),
            ("unit", ColType::String),
            ("url", ColType::String),
            ("cost_amount", ColType::DoubleNull),
            ("cost_currency", ColType::String),
            ("status", ColType::String),
            ("notes", ColType::Text),
            ],
            &[
            ("meeting", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "resources").await
    }
}
