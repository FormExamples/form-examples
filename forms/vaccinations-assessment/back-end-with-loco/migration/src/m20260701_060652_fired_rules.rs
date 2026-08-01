use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "fired_rules",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("rule_id", ColType::String),
            ("category", ColType::StringWithDefault(String::new())),
            ("description", ColType::TextWithDefault(String::new())),
            ("concern_level", ColType::StringWithDefault("low".to_string())),
            ],
            &[
            ("grade", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "fired_rules").await
    }
}
