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
            ("position", ColType::IntegerWithDefault(0)),
            ("title", ColType::StringWithDefault(String::new())),
            ("category", ColType::StringWithDefault(String::new())),
            ("description", ColType::TextWithDefault(String::new())),
            ("impact", ColType::StringWithDefault(String::new())),
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
