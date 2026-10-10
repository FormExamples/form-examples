use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "access_schedulings",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("ease_of_scheduling", ColType::IntegerNull),
                ("wait_for_appointment", ColType::IntegerNull),
                ("wait_in_waiting_room", ColType::IntegerNull),
                ("encounter_satisfaction_id", ColType::Uuid),
            ],
            &[("encounter_satisfaction", "encounter_satisfaction_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE access_schedulings ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "access_schedulings").await
    }
}
