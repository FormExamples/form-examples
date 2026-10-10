use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "casualty_cards",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "status",
                    ColType::TextWithDefault("in_progress".to_string()),
                ),
                ("attendance_date", ColType::DateNull),
                ("arrival_time", ColType::TimestampWithTimeZoneNull),
                ("patient_id", ColType::Uuid),
            ],
            &[("patient", "patient_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE casualty_cards ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_cards").await
    }
}
