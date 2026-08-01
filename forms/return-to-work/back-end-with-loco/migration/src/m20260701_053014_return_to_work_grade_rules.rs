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
            ("rule_code", ColType::StringWithDefault(String::new())),
            ("rule_title", ColType::StringWithDefault(String::new())),
            ("rule_band", ColType::StringWithDefault(String::new())),
            ("rule_priority", ColType::StringWithDefault(String::new())),
            ("rule_kind", ColType::StringWithDefault(String::new())),
            ("rule_evidence", ColType::TextWithDefault(String::new())),
            ("rule_notes", ColType::TextWithDefault(String::new())),
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
