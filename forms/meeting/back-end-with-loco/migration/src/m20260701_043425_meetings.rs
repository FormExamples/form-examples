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
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("title", ColType::StringWithDefault(String::new())),
            ("purpose", ColType::StringWithDefault(String::new())),
            ("long_description", ColType::TextWithDefault(String::new())),
            ("category", ColType::StringWithDefault(String::new())),
            ("visibility", ColType::StringWithDefault(String::new())),
            ("scheduled_start_at", ColType::TimestampWithTimeZoneNull),
            ("scheduled_end_at", ColType::TimestampWithTimeZoneNull),
            ("timezone", ColType::StringWithDefault(String::new())),
            ("location", ColType::StringWithDefault(String::new())),
            ("video_url", ColType::StringWithDefault(String::new())),
            ("phone_number", ColType::StringWithDefault(String::new())),
            ("dial_in_code", ColType::StringWithDefault(String::new())),
            ("joining_instructions", ColType::TextWithDefault(String::new())),
            ("calendar_uid", ColType::StringWithDefault(String::new())),
            ("summary", ColType::StringWithDefault(String::new())),
            ("actual_start_at", ColType::TimestampWithTimeZoneNull),
            ("actual_end_at", ColType::TimestampWithTimeZoneNull),
            ("overall_result", ColType::StringWithDefault(String::new())),
            ("additional_notes", ColType::TextWithDefault(String::new())),
            ("signed_by_name", ColType::StringWithDefault(String::new())),
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
