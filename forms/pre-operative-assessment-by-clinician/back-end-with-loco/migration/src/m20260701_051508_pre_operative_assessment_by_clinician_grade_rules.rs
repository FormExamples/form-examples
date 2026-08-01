use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "pre_operative_assessment_by_clinician_grade_rules",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("rule_id", ColType::String),
            ("instrument", ColType::String),
            ("grade", ColType::StringWithDefault(String::new())),
            ("category", ColType::StringWithDefault(String::new())),
            ("description", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("pre_operative_assessment_by_clinician_grade", "grade_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "pre_operative_assessment_by_clinician_grade_rules").await
    }
}
