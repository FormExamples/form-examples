use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "action_items",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("position", ColType::Integer),
            ("title", ColType::String),
            ("description", ColType::Text),
            ("owner_name", ColType::String),
            ("owner_email", ColType::String),
            ("due_date", ColType::DateNull),
            ("priority", ColType::String),
            ("status", ColType::String),
            ("completed_at", ColType::TimestampWithTimeZoneNull),
            ("external_reference", ColType::String),
            ],
            &[
            ("meeting", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "action_items").await
    }
}
