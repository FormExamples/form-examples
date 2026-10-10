use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "caprini_venous_thromboembolism_risk_assessment_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("total_score", ColType::IntegerNull),
                ("risk_band", ColType::StringWithDefault(String::new())),
                (
                    "prophylaxis_recommendation",
                    ColType::TextWithDefault(String::new()),
                ),
                ("graded_at", ColType::TimestampWithTimeZone),
                (
                    "caprini_venous_thromboembolism_risk_assessment_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "caprini_venous_thromboembolism_risk_assessment",
                "caprini_venous_thromboembolism_risk_assessment_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE caprini_venous_thromboembolism_risk_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "caprini_venous_thromboembolism_risk_assessment_grades").await
    }
}
