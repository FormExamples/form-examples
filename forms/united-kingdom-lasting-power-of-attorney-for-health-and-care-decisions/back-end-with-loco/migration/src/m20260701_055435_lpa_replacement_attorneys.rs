use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "lpa_replacement_attorneys",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("order_position", ColType::Integer),
                (
                    "replacement_trigger",
                    ColType::TextWithDefault(String::new()),
                ),
                ("lpa_id", ColType::Uuid),
                ("replacement_attorney_id", ColType::Uuid),
            ],
            &[
                ("lpa", "lpa_id"),
                ("replacement_attorney", "replacement_attorney_id"),
            ],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE lpa_replacement_attorneys ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "lpa_replacement_attorneys").await
    }
}
