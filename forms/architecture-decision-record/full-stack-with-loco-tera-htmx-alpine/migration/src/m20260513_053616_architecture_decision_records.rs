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
            
            ("slug", ColType::StringNull),
            ("number", ColType::IntegerNull),
            ("title", ColType::String),
            ("decision_date", ColType::DateNull),
            ("status", ColType::StringNull),
            ("decision_group", ColType::StringNull),
            ("issue", ColType::TextNull),
            ("decision", ColType::TextNull),
            ("assumptions", ColType::TextNull),
            ("constraints", ColType::TextNull),
            ("argument", ColType::TextNull),
            ("implications", ColType::TextNull),
            ("related_decisions", ColType::TextNull),
            ("related_requirements", ColType::TextNull),
            ("related_artifacts", ColType::TextNull),
            ("related_principles", ColType::TextNull),
            ("signed_off_by", ColType::StringNull),
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
