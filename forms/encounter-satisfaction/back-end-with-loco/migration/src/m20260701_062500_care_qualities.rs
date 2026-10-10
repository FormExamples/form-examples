use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "care_qualities",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("involvement_in_decisions", ColType::IntegerNull),
                ("treatment_plan_explanation", ColType::IntegerNull),
                ("confidence_in_care", ColType::IntegerNull),
                ("encounter_satisfaction_id", ColType::Uuid),
            ],
            &[("encounter_satisfaction", "encounter_satisfaction_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE care_qualities ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "care_qualities").await
    }
}
