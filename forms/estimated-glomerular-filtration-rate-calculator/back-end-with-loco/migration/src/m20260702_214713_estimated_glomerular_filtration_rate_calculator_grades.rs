use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "estimated_glomerular_filtration_rate_calculator_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("serum_creatinine_mg_dl", ColType::DoubleNull),
                ("egfr_ml_min_1_73m2", ColType::DoubleNull),
                ("g_stage", ColType::StringWithDefault(String::new())),
                ("g_stage_label", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                (
                    "estimated_glomerular_filtration_rate_calculator_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "estimated_glomerular_filtration_rate_calculator",
                "estimated_glomerular_filtration_rate_calculator_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE estimated_glomerular_filtration_rate_calculator_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "estimated_glomerular_filtration_rate_calculator_grades").await
    }
}
