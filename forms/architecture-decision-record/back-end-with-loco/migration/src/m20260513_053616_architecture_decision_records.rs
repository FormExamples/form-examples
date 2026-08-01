use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "architecture_decision_records",
            &[
            
            ("id", ColType::PkAuto),
            
            ("slug", ColType::StringWithDefault(String::new())),
            ("number", ColType::IntegerNull),
            ("title", ColType::String),
            ("decision_date", ColType::DateNull),
            ("status", ColType::StringWithDefault("pending".to_string())),
            ("decision_group", ColType::StringWithDefault(String::new())),
            ("issue", ColType::TextWithDefault(String::new())),
            ("decision", ColType::TextWithDefault(String::new())),
            ("assumptions", ColType::TextWithDefault(String::new())),
            ("constraints", ColType::TextWithDefault(String::new())),
            ("argument", ColType::TextWithDefault(String::new())),
            ("implications", ColType::TextWithDefault(String::new())),
            ("related_decisions", ColType::TextWithDefault(String::new())),
            ("related_requirements", ColType::TextWithDefault(String::new())),
            ("related_artifacts", ColType::TextWithDefault(String::new())),
            ("related_principles", ColType::TextWithDefault(String::new())),
            ("signed_off_by", ColType::StringWithDefault(String::new())),
            ("signed_off_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[
            ("author", ""),
            ("organization", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "architecture_decision_records").await
    }
}
