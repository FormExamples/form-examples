use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "staff_professionalisms",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("reception_courtesy", ColType::IntegerNull),
                ("nursing_courtesy", ColType::IntegerNull),
                ("respect_shown", ColType::IntegerNull),
                ("encounter_satisfaction_id", ColType::Uuid),
            ],
            &[("encounter_satisfaction", "encounter_satisfaction_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE staff_professionalisms ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "staff_professionalisms").await
    }
}
