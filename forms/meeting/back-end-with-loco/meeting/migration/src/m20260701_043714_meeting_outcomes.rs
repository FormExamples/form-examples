use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "meeting_outcomes",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("position", ColType::Integer),
            ("title", ColType::String),
            ("category", ColType::String),
            ("description", ColType::Text),
            ("impact", ColType::String),
            ],
            &[
            ("meeting", ""),
            ("action_item?", "related_action_item_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "meeting_outcomes").await
    }
}
