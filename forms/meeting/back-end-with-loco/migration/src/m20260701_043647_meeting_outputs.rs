use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "meeting_outputs",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("position", ColType::IntegerWithDefault(0)),
            ("title", ColType::StringWithDefault(String::new())),
            ("kind", ColType::StringWithDefault(String::new())),
            ("url", ColType::StringWithDefault(String::new())),
            ("description", ColType::TextWithDefault(String::new())),
            ("owner_name", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("meeting", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "meeting_outputs").await
    }
}
