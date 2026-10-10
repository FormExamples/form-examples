use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "lpa_preferences",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("order_position", ColType::IntegerWithDefault(1)),
                ("category", ColType::StringWithDefault(String::new())),
                ("statement", ColType::TextWithDefault(String::new())),
                ("lpa_id", ColType::Uuid),
            ],
            &[("lpa", "lpa_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE lpa_preferences ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "lpa_preferences").await
    }
}
