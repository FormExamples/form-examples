use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "pulmonary_embolism_rule_out_criteria_grade_rules",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),

            ("rule_id", ColType::String),
            ("instrument", ColType::String),
            ("satisfied", ColType::StringWithDefault(String::new())),
            ("outcome", ColType::StringWithDefault(String::new())),
            ("category", ColType::StringWithDefault(String::new())),
            ("description", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("pulmonary_embolism_rule_out_criteria_grade", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "pulmonary_embolism_rule_out_criteria_grade_rules").await
    }
}
