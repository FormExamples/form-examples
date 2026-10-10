use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "casualty_card_gps",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("name", ColType::TextWithDefault(String::new())),
                ("practice_name", ColType::TextWithDefault(String::new())),
                ("practice_address", ColType::TextWithDefault(String::new())),
                ("practice_phone", ColType::TextWithDefault(String::new())),
                ("casualty_card_id", ColType::Uuid),
            ],
            &[("casualty_card", "casualty_card_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE casualty_card_gps ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "casualty_card_gps").await
    }
}
