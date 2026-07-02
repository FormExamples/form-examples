use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "wells_score_for_pulmonary_embolism_grade_rules",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("rule_id", ColType::String),
            ("instrument", ColType::String),
            ("points", ColType::Double),
            ("band", ColType::String),
            ("category", ColType::String),
            ("description", ColType::String),
            ],
            &[
            ("wells_score_for_pulmonary_embolism_grade", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "wells_score_for_pulmonary_embolism_grade_rules").await
    }
}
