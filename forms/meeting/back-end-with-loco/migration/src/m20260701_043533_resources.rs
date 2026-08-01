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
            ("position", ColType::IntegerWithDefault(0)),
            ("resource_type", ColType::StringWithDefault(String::new())),
            ("name", ColType::StringWithDefault(String::new())),
            ("quantity", ColType::IntegerNull),
            ("unit", ColType::StringWithDefault(String::new())),
            ("url", ColType::StringWithDefault(String::new())),
            ("cost_amount", ColType::DoubleNull),
            ("cost_currency", ColType::StringWithDefault(String::new())),
            ("status", ColType::StringWithDefault(String::new())),
            ("notes", ColType::TextWithDefault(String::new())),
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
