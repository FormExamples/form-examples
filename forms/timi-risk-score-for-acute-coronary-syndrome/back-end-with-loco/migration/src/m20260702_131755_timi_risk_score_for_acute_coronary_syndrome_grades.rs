use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "timi_risk_score_for_acute_coronary_syndrome_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("total_score", ColType::IntegerNull),
                ("risk_band", ColType::StringWithDefault(String::new())),
                ("fourteen_day_event_risk_percent", ColType::DoubleNull),
                ("management", ColType::TextWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                (
                    "timi_risk_score_for_acute_coronary_syndrome_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "timi_risk_score_for_acute_coronary_syndrome",
                "timi_risk_score_for_acute_coronary_syndrome_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE timi_risk_score_for_acute_coronary_syndrome_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "timi_risk_score_for_acute_coronary_syndrome_grades").await
    }
}
