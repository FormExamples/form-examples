use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "estimated_glomerular_filtration_rate_calculator_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("serum_creatinine_mg_dl", ColType::DoubleNull),
            ("egfr_ml_min_1_73m2", ColType::DoubleNull),
            ("g_stage", ColType::StringWithDefault(String::new())),
            ("g_stage_label", ColType::StringWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("estimated_glomerular_filtration_rate_calculator", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "estimated_glomerular_filtration_rate_calculator_grades").await
    }
}
