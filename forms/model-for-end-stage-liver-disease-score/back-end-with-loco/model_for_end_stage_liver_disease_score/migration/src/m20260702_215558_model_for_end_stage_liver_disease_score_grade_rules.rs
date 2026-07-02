use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "model_for_end_stage_liver_disease_score_grade_rules",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("rule_id", ColType::String),
            ("component", ColType::String),
            ("contribution", ColType::DoubleNull),
            ("category", ColType::String),
            ("description", ColType::String),
            ],
            &[
            ("model_for_end_stage_liver_disease_score_grade", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "model_for_end_stage_liver_disease_score_grade_rules").await
    }
}
