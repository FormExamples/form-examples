use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "meetings",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("title", ColType::String),
            ("purpose", ColType::String),
            ("long_description", ColType::Text),
            ("category", ColType::String),
            ("visibility", ColType::String),
            ("scheduled_start_at", ColType::TimestampWithTimeZoneNull),
            ("scheduled_end_at", ColType::TimestampWithTimeZoneNull),
            ("timezone", ColType::String),
            ("location", ColType::String),
            ("video_url", ColType::String),
            ("phone_number", ColType::String),
            ("dial_in_code", ColType::String),
            ("joining_instructions", ColType::Text),
            ("calendar_uid", ColType::String),
            ("summary", ColType::String),
            ("actual_start_at", ColType::TimestampWithTimeZoneNull),
            ("actual_end_at", ColType::TimestampWithTimeZoneNull),
            ("overall_result", ColType::String),
            ("additional_notes", ColType::Text),
            ("signed_by_name", ColType::String),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[
            ("organizer", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "meetings").await
    }
}
