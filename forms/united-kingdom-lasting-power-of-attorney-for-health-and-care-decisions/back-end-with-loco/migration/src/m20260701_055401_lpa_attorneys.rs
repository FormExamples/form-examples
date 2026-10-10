use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "lpa_attorneys",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("order_position", ColType::Integer),
                ("lpa_id", ColType::Uuid),
                ("attorney_id", ColType::Uuid),
            ],
            &[("lpa", "lpa_id"), ("attorney", "attorney_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE lpa_attorneys ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "lpa_attorneys").await
    }
}
