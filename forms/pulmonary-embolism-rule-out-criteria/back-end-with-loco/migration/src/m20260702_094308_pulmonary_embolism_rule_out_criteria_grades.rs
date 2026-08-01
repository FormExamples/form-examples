use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "pulmonary_embolism_rule_out_criteria_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),

            ("classification", ColType::StringWithDefault(String::new())),
            ("all_criteria_satisfied", ColType::StringWithDefault(String::new())),
            ("applicable", ColType::StringWithDefault(String::new())),
            ("recommended_pathway", ColType::TextWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("pulmonary_embolism_rule_out_criteria", "pulmonary_embolism_rule_out_criteria_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "pulmonary_embolism_rule_out_criteria_grades").await
    }
}
