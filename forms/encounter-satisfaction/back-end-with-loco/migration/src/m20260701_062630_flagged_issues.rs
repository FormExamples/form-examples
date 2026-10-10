use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "flagged_issues",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("flag_id", ColType::Text),
                ("category", ColType::Text),
                ("message", ColType::Text),
                ("priority", ColType::Text),
                ("satisfaction_result_id", ColType::Uuid),
            ],
            &[("satisfaction_result", "satisfaction_result_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE flagged_issues ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "flagged_issues").await
    }
}
