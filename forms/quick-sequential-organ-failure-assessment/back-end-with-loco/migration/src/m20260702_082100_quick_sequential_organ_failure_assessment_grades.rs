use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "quick_sequential_organ_failure_assessment_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("respiratory_rate_point", ColType::IntegerNull),
                ("mentation_point", ColType::IntegerNull),
                ("systolic_blood_pressure_point", ColType::IntegerNull),
                ("total_score", ColType::IntegerNull),
                ("risk_band", ColType::StringWithDefault(String::new())),
                ("threshold_met", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                (
                    "quick_sequential_organ_failure_assessment_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "quick_sequential_organ_failure_assessment",
                "quick_sequential_organ_failure_assessment_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE quick_sequential_organ_failure_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "quick_sequential_organ_failure_assessment_grades").await
    }
}
