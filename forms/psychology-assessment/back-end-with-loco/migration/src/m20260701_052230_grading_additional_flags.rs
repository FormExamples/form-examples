use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "grading_additional_flags",
            &[

            ("id", ColType::PkAuto),

            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("flag_id", ColType::String),
            ("category", ColType::StringWithDefault(String::new())),
            ("message", ColType::TextWithDefault(String::new())),
            ("priority", ColType::StringWithDefault("medium".to_string())),
            ],
            &[
            ("grade", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "grading_additional_flags").await
    }
}
