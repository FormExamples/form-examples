use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "return_to_work_grade_rules",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("rule_code", ColType::String),
            ("rule_title", ColType::String),
            ("rule_band", ColType::String),
            ("rule_priority", ColType::String),
            ("rule_kind", ColType::String),
            ("rule_evidence", ColType::Text),
            ("rule_notes", ColType::Text),
            ],
            &[
            ("return_to_work_grade", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "return_to_work_grade_rules").await
    }
}
