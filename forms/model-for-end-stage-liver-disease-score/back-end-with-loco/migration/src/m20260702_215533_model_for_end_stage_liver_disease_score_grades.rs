use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "model_for_end_stage_liver_disease_score_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("bilirubin_mg_dl", ColType::DoubleNull),
            ("creatinine_mg_dl", ColType::DoubleNull),
            ("creatinine_adjusted", ColType::DoubleNull),
            ("dialysis_rule_applied", ColType::BooleanWithDefault(false)),
            ("meld_score", ColType::IntegerNull),
            ("mortality_band", ColType::StringWithDefault(String::new())),
            ("estimated_mortality_percent", ColType::DoubleNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("model_for_end_stage_liver_disease_score", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "model_for_end_stage_liver_disease_score_grades").await
    }
}
